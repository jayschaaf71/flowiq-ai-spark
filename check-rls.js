#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRLS() {
  console.log('🔍 Checking RLS policies...');
  
  try {
    // Check if we can read from tables
    const tables = ['etl_logs', 'patient_visits', 'billing_log', 'claims_collections', 'insurance_pat_ref'];
    
    for (const table of tables) {
      console.log(`\n📋 Testing table: ${table}`);
      
      // Try to read
      const { data: readData, error: readError } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (readError) {
        console.log(`❌ Read failed: ${readError.message}`);
      } else {
        console.log(`✅ Read successful: ${readData?.length || 0} rows`);
      }
      
      // Try to insert
      const { data: insertData, error: insertError } = await supabase
        .from(table)
        .insert({
          created_at: new Date().toISOString()
        })
        .select();
      
      if (insertError) {
        console.log(`❌ Insert failed: ${insertError.message}`);
      } else {
        console.log(`✅ Insert successful: ${insertData?.length || 0} rows`);
      }
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkRLS();
