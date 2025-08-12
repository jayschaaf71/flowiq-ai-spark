#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function listTables() {
  console.log('📋 Listing available tables...');
  
  try {
    // Try to get table information
    const { data, error } = await supabase
      .rpc('get_tables');
    
    if (error) {
      console.log('❌ RPC failed:', error.message);
      
      // Try alternative approach - query information_schema
      const { data: schemaData, error: schemaError } = await supabase
        .from('information_schema.tables')
        .select('table_name, table_schema')
        .eq('table_schema', 'public');
      
      if (schemaError) {
        console.log('❌ Schema query failed:', schemaError.message);
      } else {
        console.log('✅ Available tables in public schema:');
        schemaData?.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
      }
    } else {
      console.log('✅ Tables:', data);
    }
    
  } catch (error) {
    console.error('❌ List failed:', error.message);
  }
}

listTables();
