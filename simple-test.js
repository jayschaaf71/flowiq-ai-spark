#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function simpleTest() {
  console.log('🧪 Simple connection test...');
  
  try {
    // Try to access a common table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Users table error:', error.message);
      
      // Try profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (profileError) {
        console.log('❌ Profiles table error:', profileError.message);
      } else {
        console.log('✅ Profiles table accessible');
      }
    } else {
      console.log('✅ Users table accessible');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

simpleTest();
