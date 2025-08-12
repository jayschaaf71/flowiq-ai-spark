import sftp from 'ssh2-sftp-client';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function runETL() {
  console.log('🚀 Starting Sleep Impressions ETL Process...');

  const client = new sftp();

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log('🔗 Connecting to SFTP server...');
    console.log('Host:', process.env.SFTP_HOST);
    console.log('Username:', process.env.SFTP_USERNAME);
    
    // Use the SSH key file directly instead of environment variable
    const privateKey = fs.readFileSync('/Users/jschaaf/.ssh/flowiq_etl_si', 'utf8');
    
    await client.connect({
      host: process.env.SFTP_HOST,
      username: process.env.SFTP_USERNAME,
      privateKey: privateKey,
      readyTimeout: 99999
    });

    console.log('✅ Connected to SFTP server');

    // List files in the root directory
    const files = await client.list('/');
    console.log('📁 Files found:', files.map(f => f.name));

    // Look for CSV files
    const csvFiles = files
      .filter(file => file.name.endsWith('.csv'))
      .map(file => file.name);

    console.log('📊 CSV files found:', csvFiles);

    if (csvFiles.length === 0) {
      console.log('❌ No CSV files found to process');
      return;
    }

    // Process each CSV file
    for (const fileName of csvFiles) {
      try {
        console.log(`\n🔄 Processing file: ${fileName}`);

        // Download file
        const fileBuffer = await client.get(`/${fileName}`);
        
        // Parse CSV
        const csvContent = fileBuffer.toString('utf-8');
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
  } finally {
    await client.end();
    console.log('🔌 SFTP connection closed');
  }
}

// Run the ETL process
runETL().catch(console.error);
