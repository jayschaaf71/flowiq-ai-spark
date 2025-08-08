import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export async function ingestFile(filename: string, csv: string) {
  console.log(`Ingesting file: ${filename}`);
  
  try {
    const rows = parse(csv, { 
      columns: true, 
      skip_empty_lines: true,
      trim: true
    });

    console.log(`Parsed ${rows.length} rows from ${filename}`);

    if (filename.startsWith('billing_log')) {
      return await ingestBilling(rows);
    }
    if (filename.startsWith('patient_visit')) {
      return await ingestVisits(rows);
    }
    if (filename.startsWith('insurance_pat_ref')) {
      return await ingestIns(rows);
    }
    if (filename.startsWith('Claims_Report')) {
      return await ingestLegacyClaims(rows);
    }

    console.warn(`Unknown file type: ${filename}`);
    
  } catch (error) {
    console.error(`Error parsing file ${filename}:`, error);
    throw error;
  }
}

async function ingestBilling(rows: any[]) {
  console.log(`Processing ${rows.length} billing records`);
  
  for (const row of rows) {
    try {
      const encounterId = `${row['Patient ID']}_${row['Visit Date']}`;
      
      const { error } = await supabase
        .from('encounter')
        .upsert({
          encounter_id: encounterId,
          patient_id: row['Patient ID'],
          service_date: row['Visit Date'],
          cpt: row['CPT Code'],
          charge: Number(row['Claim Amount']) || 0,
          source: 'sleepimpr',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'encounter_id'
        });

      if (error) {
        console.error(`Error upserting billing record:`, error);
      }
      
    } catch (error) {
      console.error(`Error processing billing row:`, error, row);
    }
  }
  
  console.log(`Completed billing ingestion`);
}

async function ingestVisits(rows: any[]) {
  console.log(`Processing ${rows.length} visit records`);
  
  for (const row of rows) {
    try {
      const encounterId = `${row['Patient ID']}_${row['Visit Date']}`;
      
      if (row['Stage'] === 'Delivery') {
        // Enqueue claim submission job
        const { error } = await supabase
          .from('automation_steps')
          .insert({
            tenant_id: 'midwest',
            encounter_id: encounterId,
            action_type: 'claims.submit',
            status: 'pending',
            metadata: {
              source: 'sleepimpr',
              stage: 'Delivery',
              patient_id: row['Patient ID'],
              visit_date: row['Visit Date']
            },
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error(`Error enqueueing claim submission:`, error);
        } else {
          console.log(`Enqueued claim submission for encounter: ${encounterId}`);
        }
      }
      
    } catch (error) {
      console.error(`Error processing visit row:`, error, row);
    }
  }
  
  console.log(`Completed visit ingestion`);
}

async function ingestIns(rows: any[]) {
  console.log(`Processing ${rows.length} insurance records`);
  
  for (const row of rows) {
    try {
      const { error } = await supabase
        .from('payer_policy')
        .upsert({
          patient_id: row['Patient ID'],
          payer_name: row['Insurance Plan 1'],
          policy_no: row['Policy #'],
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'patient_id,payer_name'
        });

      if (error) {
        console.error(`Error upserting insurance record:`, error);
      }
      
    } catch (error) {
      console.error(`Error processing insurance row:`, error, row);
    }
  }
  
  console.log(`Completed insurance ingestion`);
}

async function ingestLegacyClaims(rows: any[]) {
  console.log(`Processing ${rows.length} legacy claim records`);
  
  for (const row of rows) {
    try {
      const { error } = await supabase
        .from('legacy_claim_kpi')
        .insert({
          claim_id: row['Claim #'],
          status: row['Claim Status'],
          submitted: row['Claim Submitted'],
          source: 'sleepimpr',
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error(`Error inserting legacy claim record:`, error);
      }
      
    } catch (error) {
      console.error(`Error processing legacy claim row:`, error, row);
    }
  }
  
  console.log(`Completed legacy claims ingestion`);
}
