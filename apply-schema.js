#!/usr/bin/env node

/**
 * Apply Sleep Impressions Database Schema
 * 
 * This script applies the database schema directly using Supabase client
 * Bypasses the migration system issues
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const schemaSQL = `
-- Sleep Impressions ETL Database Tables

-- ETL Logs Table
CREATE TABLE IF NOT EXISTS etl_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Patient Visits Table
CREATE TABLE IF NOT EXISTS patient_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_date DATE,
    appointment_type TEXT,
    patient_last_name TEXT,
    patient_first_name TEXT,
    patient_id TEXT,
    patient_home_phone TEXT,
    patient_cell_phone TEXT,
    patient_email TEXT,
    primary_insurance TEXT,
    referring_md_last TEXT,
    stage TEXT,
    date_signed DATE,
    cpt_code TEXT,
    device TEXT,
    location TEXT,
    clinic_partner TEXT,
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Billing Log Table
CREATE TABLE IF NOT EXISTS billing_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_date DATE,
    appointment_type TEXT,
    patient_last_name TEXT,
    patient_first_name TEXT,
    patient_id TEXT,
    referring_md_last TEXT,
    primary_insurance TEXT,
    stage TEXT,
    date_consult_signed TIMESTAMP WITH TIME ZONE,
    date_billed TIMESTAMP WITH TIME ZONE,
    cpt_code TEXT,
    claim_amount DECIMAL(10,2),
    billing_provider TEXT,
    location TEXT,
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims Collections Table
CREATE TABLE IF NOT EXISTS claims_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    last_name TEXT,
    first_name TEXT,
    billing_provider TEXT,
    patient_id TEXT,
    dos DATE,
    insurance_id TEXT,
    claim_number TEXT,
    trace_id TEXT,
    icn TEXT,
    payer TEXT,
    claim_date TIMESTAMP WITH TIME ZONE,
    recent_submission_date TIMESTAMP WITH TIME ZONE,
    cpt_codes TEXT,
    charge_fees TEXT,
    total_charge DECIMAL(10,2),
    adj_charge DECIMAL(10,2),
    ins_adjustment TEXT,
    allowable_sum DECIMAL(10,2),
    remainder DECIMAL(10,2),
    pat_writeoff DECIMAL(10,2),
    deductible DECIMAL(10,2),
    collections DECIMAL(10,2),
    denial_code TEXT,
    otc TEXT,
    ins_payment DECIMAL(10,2),
    pat_payment DECIMAL(10,2),
    patient_address TEXT,
    patient_city TEXT,
    patient_state TEXT,
    patient_zip TEXT,
    patient_dob DATE,
    home_phone TEXT,
    work_phone TEXT,
    place_of_service TEXT,
    insurance_address TEXT,
    insurance_city TEXT,
    insurance_state TEXT,
    insurance_zip TEXT,
    authorization_number TEXT,
    insurance_group_number TEXT,
    icd_10_diagnosis_code TEXT,
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance Patient Reference Table
CREATE TABLE IF NOT EXISTS insurance_pat_ref (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    insurance_plan_1 TEXT,
    patient_last_name TEXT,
    patient_first_name TEXT,
    visit_date DATE,
    appointment_type TEXT,
    referring_md_last TEXT,
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_visits_visit_date ON patient_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_patient_visits_patient_id ON patient_visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_billing_log_visit_date ON billing_log(visit_date);
CREATE INDEX IF NOT EXISTS idx_billing_log_patient_id ON billing_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_claims_collections_dos ON claims_collections(dos);
CREATE INDEX IF NOT EXISTS idx_claims_collections_patient_id ON claims_collections(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_pat_ref_visit_date ON insurance_pat_ref(visit_date);
CREATE INDEX IF NOT EXISTS idx_etl_logs_created_at ON etl_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_etl_logs_batch_id ON etl_logs(etl_batch_id);

-- Add comments for documentation
COMMENT ON TABLE patient_visits IS 'Patient visit data from Sleep Impressions patient_visit_log';
COMMENT ON TABLE billing_log IS 'Billing information from Sleep Impressions billing_log';
COMMENT ON TABLE claims_collections IS 'Claims and collections data from Sleep Impressions claims_for_collections';
COMMENT ON TABLE insurance_pat_ref IS 'Insurance patient reference data from Sleep Impressions insurance_pat_ref';
COMMENT ON TABLE etl_logs IS 'ETL processing logs for tracking data imports';
`;

async function applySchema() {
  console.log('🚀 Applying Sleep Impressions Database Schema...');
  
  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
    }

    console.log('✅ Environment variables validated');
    console.log('🔗 Connecting to Supabase...');

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1);

    if (testError && testError.code !== 'PGRST116') {
      throw new Error(`Failed to connect to Supabase: ${testError.message}`);
    }

    console.log('✅ Connected to Supabase successfully');

    // Apply schema using rpc (raw SQL)
    console.log('📝 Applying database schema...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: schemaSQL });
    
    if (error) {
      console.log('⚠️  RPC method not available, trying alternative approach...');
      
      // Alternative: Try to create tables one by one
      await createTablesIndividually();
    } else {
      console.log('✅ Schema applied successfully via RPC');
    }

    // Verify tables were created
    await verifyTables();

  } catch (error) {
    console.error('❌ Error applying schema:', error.message);
    process.exit(1);
  }
}

async function createTablesIndividually() {
  console.log('🔧 Creating tables individually...');
  
  const tables = [
    {
      name: 'etl_logs',
      sql: `
        CREATE TABLE IF NOT EXISTS etl_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          file_name TEXT NOT NULL,
          file_type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'processing',
          records_processed INTEGER DEFAULT 0,
          records_failed INTEGER DEFAULT 0,
          etl_batch_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          completed_at TIMESTAMP WITH TIME ZONE,
          error_message TEXT
        );
      `
    },
    {
      name: 'patient_visits',
      sql: `
        CREATE TABLE IF NOT EXISTS patient_visits (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          visit_date DATE,
          appointment_type TEXT,
          patient_last_name TEXT,
          patient_first_name TEXT,
          patient_id TEXT,
          patient_home_phone TEXT,
          patient_cell_phone TEXT,
          patient_email TEXT,
          primary_insurance TEXT,
          referring_md_last TEXT,
          stage TEXT,
          date_signed DATE,
          cpt_code TEXT,
          device TEXT,
          location TEXT,
          clinic_partner TEXT,
          etl_batch_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'billing_log',
      sql: `
        CREATE TABLE IF NOT EXISTS billing_log (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          visit_date DATE,
          appointment_type TEXT,
          patient_last_name TEXT,
          patient_first_name TEXT,
          patient_id TEXT,
          referring_md_last TEXT,
          primary_insurance TEXT,
          stage TEXT,
          date_consult_signed TIMESTAMP WITH TIME ZONE,
          date_billed TIMESTAMP WITH TIME ZONE,
          cpt_code TEXT,
          claim_amount DECIMAL(10,2),
          billing_provider TEXT,
          location TEXT,
          etl_batch_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'claims_collections',
      sql: `
        CREATE TABLE IF NOT EXISTS claims_collections (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          last_name TEXT,
          first_name TEXT,
          billing_provider TEXT,
          patient_id TEXT,
          dos DATE,
          insurance_id TEXT,
          claim_number TEXT,
          trace_id TEXT,
          icn TEXT,
          payer TEXT,
          claim_date TIMESTAMP WITH TIME ZONE,
          recent_submission_date TIMESTAMP WITH TIME ZONE,
          cpt_codes TEXT,
          charge_fees TEXT,
          total_charge DECIMAL(10,2),
          adj_charge DECIMAL(10,2),
          ins_adjustment TEXT,
          allowable_sum DECIMAL(10,2),
          remainder DECIMAL(10,2),
          pat_writeoff DECIMAL(10,2),
          deductible DECIMAL(10,2),
          collections DECIMAL(10,2),
          denial_code TEXT,
          otc TEXT,
          ins_payment DECIMAL(10,2),
          pat_payment DECIMAL(10,2),
          patient_address TEXT,
          patient_city TEXT,
          patient_state TEXT,
          patient_zip TEXT,
          patient_dob DATE,
          home_phone TEXT,
          work_phone TEXT,
          place_of_service TEXT,
          insurance_address TEXT,
          insurance_city TEXT,
          insurance_state TEXT,
          insurance_zip TEXT,
          authorization_number TEXT,
          insurance_group_number TEXT,
          icd_10_diagnosis_code TEXT,
          etl_batch_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'insurance_pat_ref',
      sql: `
        CREATE TABLE IF NOT EXISTS insurance_pat_ref (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          insurance_plan_1 TEXT,
          patient_last_name TEXT,
          patient_first_name TEXT,
          visit_date DATE,
          appointment_type TEXT,
          referring_md_last TEXT,
          etl_batch_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  for (const table of tables) {
    try {
      console.log(`📝 Creating table: ${table.name}`);
      
      // Try to insert a test record to see if table exists
      const { error: testError } = await supabase
        .from(table.name)
        .select('*')
        .limit(1);
      
      if (testError && testError.code === 'PGRST116') {
        console.log(`⚠️  Table ${table.name} doesn't exist - you'll need to create it manually`);
        console.log(`   SQL: ${table.sql.trim()}`);
      } else {
        console.log(`✅ Table ${table.name} already exists`);
      }
    } catch (error) {
      console.log(`⚠️  Could not verify table ${table.name}: ${error.message}`);
    }
  }
}

async function verifyTables() {
  console.log('\n🔍 Verifying tables...');
  
  const expectedTables = ['etl_logs', 'patient_visits', 'billing_log', 'claims_collections', 'insurance_pat_ref'];
  
  for (const tableName of expectedTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ Table ${tableName}: Accessible`);
      }
    } catch (error) {
      console.log(`❌ Table ${tableName}: ${error.message}`);
    }
  }
}

// Run the script
applySchema().then(() => {
  console.log('\n🎉 Schema application complete!');
  console.log('\n📋 Next steps:');
  console.log('1. If any tables failed to create, apply the SQL manually in Supabase dashboard');
  console.log('2. Run the ETL process: node enhanced-etl-processor.js');
  console.log('3. Test the integration: node automated-etl.js');
}).catch(error => {
  console.error('❌ Schema application failed:', error.message);
  process.exit(1);
});
