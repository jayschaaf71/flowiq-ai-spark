import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function enhancedETLProcessor() {
  console.log('🚀 Enhanced Sleep Impressions ETL Processor...');

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Define the files to process
    const files = [
      'billing_log_2025-08-11_10-23-50.csv',
      'claims_for_collections_rpt\'_2025-08-11_10-26-42.csv',
      'insurance_pat_ref_report_2025-08-11_10-25-52.csv',
      'patient_visit_log_2025-08-11_10-24-49.csv'
    ];

    const downloadsPath = path.join(process.env.HOME, 'Downloads');
    
    console.log('📁 Processing files from:', downloadsPath);

    // Create ETL batch ID
    const etlBatchId = crypto.randomUUID();
    console.log('🆔 ETL Batch ID:', etlBatchId);

    const summary = {
      batchId: etlBatchId,
      totalFiles: files.length,
      processedFiles: 0,
      totalRecords: 0,
      insertedRecords: 0,
      errors: [],
      dataSamples: {}
    };

    // Process each file
    for (const fileName of files) {
      const filePath = path.join(downloadsPath, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${fileName}`);
        summary.errors.push(`File not found: ${fileName}`);
        continue;
      }

      try {
        console.log(`\n🔄 Processing: ${fileName}`);

        // Create ETL log entry
        const { data: logRecord, error: logError } = await supabase
          .from('etl_logs')
          .insert({
            file_name: fileName,
            file_type: determineFileType(fileName),
            status: 'processing',
            records_processed: 0
          })
          .select()
          .single();

        if (logError) {
          console.log('⚠️  Could not create ETL log (table may not exist):', logError.message);
        }

        // Read and parse CSV
        const csvContent = fs.readFileSync(filePath, 'utf-8');
        const parseResult = Papa.parse(csvContent, { 
          header: true, 
          skipEmptyLines: true,
          transform: (value) => value.trim()
        });

        const data = parseResult.data;
        console.log(`✅ Parsed ${data.length} rows`);

        // Process data based on file type
        const fileType = determineFileType(fileName);
        const processedData = await processFileData(supabase, fileType, data, etlBatchId);

        // Store data sample
        if (data.length > 0) {
          summary.dataSamples[fileName] = {
            columns: Object.keys(data[0]),
            sampleRow: data[0],
            recordCount: data.length,
            insertedCount: processedData.insertedCount
          };
        }

        summary.totalRecords += data.length;
        summary.insertedRecords += processedData.insertedCount;
        summary.processedFiles++;

        // Update ETL log
        if (logRecord) {
          await supabase
            .from('etl_logs')
            .update({
              status: 'completed',
              records_processed: data.length,
              completed_at: new Date().toISOString()
            })
            .eq('id', logRecord.id);
        }

        console.log(`✅ Successfully processed ${fileName}: ${processedData.insertedCount}/${data.length} records inserted`);

      } catch (fileError) {
        console.error(`❌ Error processing ${fileName}:`, fileError.message);
        summary.errors.push(`${fileName}: ${fileError.message}`);
      }
    }

    // Print summary
    console.log('\n🎉 ENHANCED ETL PROCESS SUMMARY:');
    console.log('==================================');
    console.log(`🆔 Batch ID: ${summary.batchId}`);
    console.log(`📊 Total files: ${summary.totalFiles}`);
    console.log(`✅ Processed files: ${summary.processedFiles}`);
    console.log(`📈 Total records: ${summary.totalRecords}`);
    console.log(`💾 Inserted records: ${summary.insertedRecords}`);
    console.log(`❌ Errors: ${summary.errors.length}`);

    if (summary.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      summary.errors.forEach(error => console.log(`  - ${error}`));
    }

    // Save detailed summary
    const summaryFile = `etl-summary-${summary.batchId}.json`;
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Detailed summary saved to: ${summaryFile}`);

    console.log('\n🎉 Enhanced ETL Process Complete!');

  } catch (error) {
    console.error('❌ Enhanced ETL process failed:', error.message);
  }
}

function determineFileType(fileName) {
  if (fileName.includes('billing_log')) return 'billing_log';
  if (fileName.includes('claims_for_collections')) return 'claims_collections';
  if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
  if (fileName.includes('patient_visit_log')) return 'patient_visits';
  return 'unknown';
}

async function processFileData(supabase, fileType, data, etlBatchId) {
  console.log(`🔄 Processing ${fileType} data...`);

  let insertedCount = 0;

  try {
    switch (fileType) {
      case 'patient_visits':
        // Insert into patient_visits table
        const { data: patientVisitsData, error: patientVisitsError } = await supabase
          .from('patient_visits')
          .insert(data.map(row => ({
            visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
            appointment_type: row['Appt Type'],
            patient_last_name: row['Patient Last Name'],
            patient_first_name: row['Patient First Name'],
            patient_id: row['Patient ID'],
            patient_home_phone: row['Patient Home Phone'],
            patient_cell_phone: row['Patient Cell Phone'],
            patient_email: row['Patient Email'],
            primary_insurance: row['Primary Insurance'],
            referring_md_last: row['Referring MD Last'],
            stage: row['Stage'],
            date_signed: row['Date Signed'] ? new Date(row['Date Signed']) : null,
            cpt_code: row['CPT Code'],
            device: row['Device'],
            location: row['Location'],
            clinic_partner: row['Clinic Partner '],
            etl_batch_id: etlBatchId
          })))
          .select();

        if (patientVisitsError) {
          console.log('⚠️  Could not insert patient visits (table may not exist):', patientVisitsError.message);
        } else {
          insertedCount = patientVisitsData.length;
        }
        break;

      case 'billing_log':
        // Insert into billing_log table
        const { data: billingLogData, error: billingLogError } = await supabase
          .from('billing_log')
          .insert(data.map(row => ({
            visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
            appointment_type: row['Appt Type'],
            patient_last_name: row['Patient Last Name'],
            patient_first_name: row['Patient First Name'],
            patient_id: row['Patient Id'],
            referring_md_last: row['Referring MD Last'],
            primary_insurance: row['Primary Insurance'],
            stage: row['Stage'],
            date_consult_signed: row['Date Consult Signed'] ? new Date(row['Date Consult Signed']) : null,
            date_billed: row['Date Billed'] ? new Date(row['Date Billed']) : null,
            cpt_code: row['CPT Code'],
            claim_amount: row['Claim Amount'] ? parseFloat(row['Claim Amount']) : null,
            billing_provider: row['Billing provider'],
            location: row['Location'],
            etl_batch_id: etlBatchId
          })))
          .select();

        if (billingLogError) {
          console.log('⚠️  Could not insert billing log (table may not exist):', billingLogError.message);
        } else {
          insertedCount = billingLogData.length;
        }
        break;

      case 'claims_collections':
        // Insert into claims_collections table
        const { data: claimsData, error: claimsError } = await supabase
          .from('claims_collections')
          .insert(data.map(row => ({
            last_name: row['Last Name'],
            first_name: row['First Name'],
            billing_provider: row['Billing Provider'],
            patient_id: row['Patient ID'],
            dos: row['DOS'] ? new Date(row['DOS']) : null,
            insurance_id: row['Insurance ID'],
            claim_number: row['Claim#'],
            trace_id: row['Trace Id'],
            icn: row['ICN'],
            payer: row['Payer'],
            claim_date: row['Claim Date'] ? new Date(row['Claim Date']) : null,
            recent_submission_date: row['Recent Submission Date'] ? new Date(row['Recent Submission Date']) : null,
            cpt_codes: row['CPT Codes'],
            charge_fees: row['Charge Fees'],
            total_charge: row['Total Charge'] ? parseFloat(row['Total Charge']) : null,
            adj_charge: row['Adj Charge'] ? parseFloat(row['Adj Charge']) : null,
            ins_adjustment: row['Ins Adjustment'],
            allowable_sum: row['Allowable (SUM)'] ? parseFloat(row['Allowable (SUM)']) : null,
            remainder: row['Remainder'] ? parseFloat(row['Remainder']) : null,
            pat_writeoff: row['Pat Writeoff'] ? parseFloat(row['Pat Writeoff']) : null,
            deductible: row['Deductible'] ? parseFloat(row['Deductible']) : null,
            collections: row['Collections'] ? parseFloat(row['Collections']) : null,
            denial_code: row['Denial Code'],
            otc: row['OTC'],
            ins_payment: row['Ins Payment'] ? parseFloat(row['Ins Payment']) : null,
            pat_payment: row['Pat Payment'] ? parseFloat(row['Pat Payment']) : null,
            patient_address: row['Patient Address'],
            patient_city: row['Patient City'],
            patient_state: row['Patient State'],
            patient_zip: row['Patient Zip'],
            patient_dob: row['Patient DOB'] ? new Date(row['Patient DOB']) : null,
            home_phone: row['Home Phone'],
            work_phone: row['Work Phone'],
            place_of_service: row['Place of Service'],
            insurance_address: row['Insurance Address'],
            insurance_city: row['Insurance City'],
            insurance_state: row['Insurance State'],
            insurance_zip: row['Insurance Zip'],
            authorization_number: row['Authorization Number'],
            insurance_group_number: row['Insurance Group Number'],
            icd_10_diagnosis_code: row['ICD-10 Diagnosis Code'],
            etl_batch_id: etlBatchId
          })))
          .select();

        if (claimsError) {
          console.log('⚠️  Could not insert claims (table may not exist):', claimsError.message);
        } else {
          insertedCount = claimsData.length;
        }
        break;

      case 'insurance_pat_ref':
        // Insert into insurance_pat_ref table
        const { data: insuranceData, error: insuranceError } = await supabase
          .from('insurance_pat_ref')
          .insert(data.map(row => ({
            insurance_plan_1: row['Insurance Plan 1'],
            patient_last_name: row['Patient Last Name'],
            patient_first_name: row['Patient First Name'],
            visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
            appointment_type: row['Appt Type'],
            referring_md_last: row['Referring MD Last'],
            etl_batch_id: etlBatchId
          })))
          .select();

        if (insuranceError) {
          console.log('⚠️  Could not insert insurance ref (table may not exist):', insuranceError.message);
        } else {
          insertedCount = insuranceData.length;
        }
        break;

      default:
        console.log(`❓ Unknown file type: ${fileType}`);
    }

  } catch (error) {
    console.error(`❌ Error processing ${fileType}:`, error.message);
  }

  return { insertedCount };
}

// Run the enhanced process
enhancedETLProcessor().catch(console.error);
