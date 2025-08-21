#!/usr/bin/env node

// Database Verification Script
// Checks if ETL tables exist and can connect to Supabase

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

async function verifyDatabase() {
  console.log('🔍 Verifying Database Connection and Tables...');
  console.log('=============================================');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables:');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    process.exit(1);
  }

  console.log('✅ Environment variables found');

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔗 Testing Supabase connection...');
    const { error: testError } = await supabase.from('etl_logs').select('*').limit(1);
    if (testError && testError.code && testError.code !== 'PGRST116') {
      throw new Error(`Connection failed: ${testError.message}`);
    }
    console.log('✅ Connected to Supabase successfully');

    const tables = ['etl_logs', 'patient_visits', 'billing_log', 'claims_collections', 'insurance_pat_ref'];
    console.log('\n📊 Checking ETL tables...');
    for (const tableName of tables) {
      try {
        const { data, error } = await supabase.from(tableName).select('*', { count: 'exact' }).limit(1);
        if (error) {
          console.log(`❌ ${tableName}: ${error.message}`);
        } else {
          console.log(`✅ ${tableName}: accessible`);
        }
      } catch (err) {
        console.log(`❌ ${tableName}: ${err.message}`);
      }
    }

    console.log('\n📋 Recent ETL Activity:');
    const { data: logs, error: logsError } = await supabase
      .from('etl_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (logsError) {
      console.log('❌ Could not fetch ETL logs:', logsError.message);
    } else if (logs && logs.length > 0) {
      logs.forEach((log) => {
        console.log(`   ${log.created_at}: ${log.file_name} (${log.status}) - ${log.records_processed || 0} records`);
      });
    } else {
      console.log('   No ETL logs found');
    }
  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    process.exit(1);
  }
}

verifyDatabase()
  .then(() => {
    console.log('\n🎉 Database verification complete!');
  })
  .catch((error) => {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  });


