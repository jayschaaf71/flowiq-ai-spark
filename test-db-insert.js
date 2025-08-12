#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testInsert() {
  console.log('🧪 Testing database insert...');
  
  try {
    // Test inserting into etl_logs
    const { data, error } = await supabase
      .from('etl_logs')
      .insert({
        file_name: 'test_file.csv',
        file_type: 'test',
        status: 'testing',
        records_processed: 1
      })
      .select();
    
    if (error) {
      console.error('❌ Insert failed:', error);
    } else {
      console.log('✅ Insert successful:', data);
    }
    
    // Test inserting into patient_visits
    const { data: patientData, error: patientError } = await supabase
      .from('patient_visits')
      .insert({
        patient_last_name: 'Test',
        patient_first_name: 'Patient',
        patient_id: 'test-123',
        visit_date: '2025-08-11'
      })
      .select();
    
    if (patientError) {
      console.error('❌ Patient insert failed:', patientError);
    } else {
      console.log('✅ Patient insert successful:', patientData);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testInsert();
