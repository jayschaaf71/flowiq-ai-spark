import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function runETL() {
  console.log('🚀 Starting Sleep Impressions ETL Process (Local Files)...');

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Look for CSV files in the current directory
    const files = fs.readdirSync('.').filter(file => file.endsWith('.csv'));
    
    console.log('📁 CSV files found in current directory:', files);

    if (files.length === 0) {
      console.log('❌ No CSV files found in current directory');
      console.log('Please download the files from SFTP and place them in this directory');
      return;
    }

    // Process each CSV file
    for (const fileName of files) {
      try {
        console.log(`\n🔄 Processing file: ${fileName}`);

        // Read file
        const csvContent = fs.readFileSync(fileName, 'utf-8');
        
        // Parse CSV
        const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

        const data = parseResult.data;
        console.log(`✅ Parsed ${data.length} rows from ${fileName}`);

        // Show sample data
        if (data.length > 0) {
          console.log(`📊 Sample data structure:`, Object.keys(data[0]));
          console.log(`📊 First row:`, data[0]);
        }

        console.log(`✅ Successfully processed ${fileName}: ${data.length} records`);

      } catch (fileError) {
        console.error(`❌ Error processing file ${fileName}:`, fileError.message);
      }
    }

    console.log('\n🎉 ETL Process Complete!');

  } catch (error) {
    console.error('❌ ETL process failed:', error.message);
  }
}

// Run the ETL process
runETL().catch(console.error);
