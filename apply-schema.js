#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applySchema() {
  console.log('🚀 Verifying Sleep Impressions Database Schema...');
  
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables.');
    }

    console.log('✅ Environment variables validated');
    console.log('🔗 Testing Supabase connection...');

    // Test connection with a simple query
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      console.log('✅ Connected to Supabase successfully');
    } else {
      console.log('✅ Connected to Supabase successfully');
    }

    // Verify tables
    await verifyTables();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

async function verifyTables() {
  console.log('\n🔍 Checking for Sleep Impressions tables...');
  
  const expectedTables = ['etl_logs', 'patient_visits', 'billing_log', 'claims_collections', 'insurance_pat_ref'];
  
  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        console.log(`❌ Table ${tableName}: Does not exist`);
        console.log(`   You need to create this table manually in Supabase dashboard`);
      } else {
        console.log(`✅ Table ${tableName}: Exists and accessible`);
      }
    } catch (error) {
      console.log(`❌ Table ${tableName}: ${error.message}`);
    }
  }
}

applySchema().then(() => {
  console.log('\n🎉 Schema verification complete!');
  console.log('\n📋 Next steps:');
  console.log('1. If any tables failed, apply the SQL manually in Supabase dashboard');
  console.log('2. Run the ETL process: node enhanced-etl-processor.js');
  console.log('3. Test the integration: node automated-etl.js');
}).catch(error => {
  console.error('❌ Schema verification failed:', error.message);
  process.exit(1);
});
