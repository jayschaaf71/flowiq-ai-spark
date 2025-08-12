import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface EtlLogEntry {
  file_name: string;
  file_type: string;
  status: 'processing' | 'completed' | 'failed';
  records_processed?: number;
  records_failed?: number;
  error_message?: string;
}

export async function routeAndIngestFile(fileName: string, fileBuffer: Buffer): Promise<void> {
  console.log(`Processing file: ${fileName}`);
  
  // Create ETL log entry
  const logEntry: EtlLogEntry = {
    file_name: fileName,
    file_type: determineFileType(fileName),
    status: 'processing'
  };
  
  const { data: logRecord, error: logError } = await supabase
    .from('etl_logs')
    .insert(logEntry)
    .select()
    .single();
    
  if (logError) {
    console.error('Failed to create ETL log:', logError);
    throw logError;
  }

  try {
    const csvContent = fileBuffer.toString('utf-8');
    const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    
    if (parseResult.errors.length > 0) {
      throw new Error(`CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
    }

    const data = parseResult.data as any[];
    console.log(`Parsed ${data.length} rows from ${fileName}`);

    // Route to specific ingestion function based on file type
    let processedCount = 0;
    let failedCount = 0;

    if (fileName.includes('billing_log')) {
      const result = await ingestBillingLog(data);
      processedCount = result.processed;
      failedCount = result.failed;
    } else if (fileName.includes('patient_visit_log')) {
      const result = await ingestPatientVisitLog(data);
      processedCount = result.processed;
      failedCount = result.failed;
    } else if (fileName.includes('insurance_pat_ref')) {
      const result = await ingestInsurancePatientRef(data);
      processedCount = result.processed;
      failedCount = result.failed;
    } else if (fileName.includes('Claims_Report')) {
      const result = await ingestClaimsReport(data);
      processedCount = result.processed;
      failedCount = result.failed;
    } else {
      throw new Error(`Unknown file type: ${fileName}`);
    }

    // Update ETL log with success
    await supabase
      .from('etl_logs')
      .update({
        status: 'completed',
        records_processed: processedCount,
        records_failed: failedCount,
        completed_at: new Date().toISOString()
      })
      .eq('id', logRecord.id);

    console.log(`Successfully processed ${fileName}: ${processedCount} records processed, ${failedCount} failed`);

  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
    
    // Update ETL log with failure
    await supabase
      .from('etl_logs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : String(error),
        completed_at: new Date().toISOString()
      })
      .eq('id', logRecord.id);
      
    throw error;
  }
}

function determineFileType(fileName: string): string {
  if (fileName.includes('billing_log')) return 'billing_log';
  if (fileName.includes('patient_visit_log')) return 'patient_visit_log';
  if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
  if (fileName.includes('Claims_Report')) return 'claims_report';
  return 'unknown';
}

async function ingestBillingLog(data: any[]): Promise<{processed: number, failed: number}> {
  let processed = 0;
  let failed = 0;

  for (const row of data) {
    try {
      // Map CSV columns to encounter table
      const encounter = {
        patient_id: row['Patient ID'] || null,
        provider_name: row['Provider'] || null,
        service_date: row['Service Date'] ? new Date(row['Service Date']).toISOString().split('T')[0] : null,
        procedure_code: row['Procedure Code'] || null,
        amount: row['Amount'] ? parseFloat(row['Amount']) : null,
        status: row['Status'] || 'pending'
      };

      const { error } = await supabase
        .from('encounter')
        .upsert(encounter, { onConflict: 'patient_id,service_date,procedure_code' });

      if (error) {
        console.error('Error inserting encounter:', error);
        failed++;
      } else {
        processed++;
      }
    } catch (error) {
      console.error('Error processing billing log row:', error);
      failed++;
    }
  }

  return { processed, failed };
}

async function ingestPatientVisitLog(data: any[]): Promise<{processed: number, failed: number}> {
  let processed = 0;
  let failed = 0;

  for (const row of data) {
    try {
      // Map CSV columns to patient/encounter data
      const visitData = {
        patient_id: row['Patient ID'] || null,
        visit_date: row['Visit Date'] ? new Date(row['Visit Date']).toISOString().split('T')[0] : null,
        provider_name: row['Provider'] || null,
        visit_type: row['Visit Type'] || null,
        notes: row['Notes'] || null
      };

      // This could map to encounters or a visits table depending on your schema
      const { error } = await supabase
        .from('encounter')
        .upsert({
          patient_id: visitData.patient_id,
          provider_name: visitData.provider_name,
          service_date: visitData.visit_date,
          procedure_code: visitData.visit_type,
          status: 'completed'
        }, { onConflict: 'patient_id,service_date' });

      if (error) {
        console.error('Error inserting visit:', error);
        failed++;
      } else {
        processed++;
      }
    } catch (error) {
      console.error('Error processing visit log row:', error);
      failed++;
    }
  }

  return { processed, failed };
}

async function ingestInsurancePatientRef(data: any[]): Promise<{processed: number, failed: number}> {
  let processed = 0;
  let failed = 0;

  for (const row of data) {
    try {
      const insuranceData = {
        patient_id: row['Patient ID'] || null,
        carrier_code: row['Insurance Carrier'] || null,
        group_number: row['Group Number'] || null,
        policy_number: row['Policy Number'] || null,
        effective_date: row['Effective Date'] ? new Date(row['Effective Date']).toISOString().split('T')[0] : null
      };

      const { error } = await supabase
        .from('payer_policy')
        .upsert({
          patient_id: insuranceData.patient_id,
          carrier_code: insuranceData.carrier_code,
          group_number: insuranceData.group_number,
          policy_number: insuranceData.policy_number,
          effective_date: insuranceData.effective_date
        }, { onConflict: 'patient_id,carrier_code' });

      if (error) {
        console.error('Error inserting insurance data:', error);
        failed++;
      } else {
        processed++;
      }
    } catch (error) {
      console.error('Error processing insurance row:', error);
      failed++;
    }
  }

  return { processed, failed };
}

async function ingestClaimsReport(data: any[]): Promise<{processed: number, failed: number}> {
  let processed = 0;
  let failed = 0;

  for (const row of data) {
    try {
      const claimData = {
        provider_name: row['Provider'] || null,
        patient_name: row['Patient'] || null,
        dos: row['DOS'] ? new Date(row['DOS']).toISOString().split('T')[0] : null,
        amount: row['Amount'] ? parseFloat(row['Amount'].replace(/[$,]/g, '')) : null,
        status: row['Status'] || 'pending'
      };

      // First try to find the associated claim
      const { data: claims, error: claimError } = await supabase
        .from('claims')
        .select('id')
        .eq('patient_name', claimData.patient_name)
        .eq('service_date', claimData.dos)
        .limit(1);

      if (claimError) {
        console.error('Error finding claim:', claimError);
        failed++;
        continue;
      }

      let claimId = claims?.[0]?.id;

      // If no claim exists, create one
      if (!claimId) {
        const { data: newClaim, error: createError } = await supabase
          .from('claims')
          .insert({
            patient_name: claimData.patient_name,
            service_date: claimData.dos,
            amount: claimData.amount,
            status: claimData.status
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating claim:', createError);
          failed++;
          continue;
        }
        claimId = newClaim.id;
      }

      // Insert legacy claim KPI data
      const { error } = await supabase
        .from('legacy_claim_kpi')
        .upsert({
          claim_id: claimId,
          provider_name: claimData.provider_name,
          patient_name: claimData.patient_name,
          dos: claimData.dos,
          amount: claimData.amount,
          status: claimData.status
        }, { onConflict: 'claim_id' });

      if (error) {
        console.error('Error inserting legacy claim KPI:', error);
        failed++;
      } else {
        processed++;
      }
    } catch (error) {
      console.error('Error processing claims report row:', error);
      failed++;
    }
  }

  return { processed, failed };
}
