#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verifyData() {
  console.log('🔍 Verifying Sleep Impressions data in database...');
  
  try {
    const tables = [
      { name: 'patient_visits', expected: 586 },
      { name: 'billing_log', expected: 297 },
      { name: 'claims_collections', expected: 300 },
      { name: 'insurance_pat_ref', expected: 597 },
      { name: 'etl_logs', expected: 4 }
    ];
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table.name}: ${error.message}`);
      } else {
        console.log(`✅ ${table.name}: ${count} records (expected ~${table.expected})`);
      }
    }
    
    // Show sample data
    console.log('\n📊 Sample patient data:');
    const { data: patients } = await supabase
      .from('patient_visits')
      .select('patient_first_name, patient_last_name, visit_date, primary_insurance')
      .limit(5);
    
    patients?.forEach(patient => {
      console.log(`  - ${patient.patient_first_name} ${patient.patient_last_name} (${patient.visit_date}) - ${patient.primary_insurance}`);
    });
    
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
}

verifyData();
