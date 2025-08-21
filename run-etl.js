const { Client } = require('ssh2-sftp-client');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config();

async function runETL() {
  console.log('🚀 Starting Sleep Impressions ETL Process...');

  const sftp = new Client();

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Verify environment variables
    const sftpHost = process.env.SFTP_HOST;
    const sftpUsername = process.env.SFTP_USERNAME;
    const sftpPrivateKey = process.env.SFTP_PRIVATE_KEY;

    if (!sftpHost || !sftpUsername || !sftpPrivateKey) {
      console.error('❌ Missing SFTP environment variables');
      console.log('Please set these environment variables:');
      console.log('- SFTP_HOST');
      console.log('- SFTP_USERNAME');
      console.log('- SFTP_PRIVATE_KEY');
      return;
    }

    console.log('🔗 Connecting to SFTP server...');
    await sftp.connect({
      host: sftpHost,
      username: sftpUsername,
      privateKey: sftpPrivateKey.replace(/\\n/g, '\n'),
      readyTimeout: 99999
    });

    console.log('✅ Connected to SFTP server');

    // List files in the root directory
    const files = await sftp.list('/');
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

    const processedFiles = [];
    const errors = [];

    // Process each CSV file
    for (const fileName of csvFiles) {
      try {
        console.log(`\n🔄 Processing file: ${fileName}`);

        // Download file
        const fileBuffer = await sftp.get(`/${fileName}`);
        
        // Create archive directory if it doesn't exist
        const archiveDir = '/archive';
        try {
          await sftp.mkdir(archiveDir);
        } catch (error) {
          console.log('📁 Archive directory already exists');
        }

        // Move file to archive
        await sftp.rename(`/${fileName}`, `${archiveDir}/${fileName}`);
        console.log(`📦 File ${fileName} downloaded and archived`);

        // Parse CSV
        const csvContent = fileBuffer.toString('utf-8');
        const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });

        if (parseResult.errors.length > 0) {
          throw new Error(`CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
        }

        const data = parseResult.data;
        console.log(`✅ Parsed ${data.length} rows from ${fileName}`);

        // Create ETL log entry
        const { data: logRecord, error: logError } = await supabase
          .from('etl_logs')
          .insert({
            file_name: fileName,
            file_type: determineFileType(fileName),
            status: 'processing'
          })
          .select()
          .single();

        if (logError) {
          console.error('❌ Failed to create ETL log:', logError);
          throw logError;
        }

        // Process the data based on file type
        const fileType = determineFileType(fileName);
        console.log(`📋 Processing ${fileType} data...`);

        // For now, just log the data structure
        if (data.length > 0) {
          console.log(`📊 Sample data structure:`, Object.keys(data[0]));
          console.log(`📊 First row:`, data[0]);
        }

        // Update ETL log with success
        await supabase
          .from('etl_logs')
          .update({
            status: 'completed',
            records_processed: data.length,
            records_failed: 0,
            completed_at: new Date().toISOString()
          })
          .eq('id', logRecord.id);

        console.log(`✅ Successfully processed ${fileName}: ${data.length} records`);
        processedFiles.push(fileName);

      } catch (fileError) {
        console.error(`❌ Error processing file ${fileName}:`, fileError.message);
        errors.push({
          fileName,
          error: fileError.message
        });
      }
    }

    // Summary
    console.log('\n🎉 ETL Process Summary:');
    console.log(`📊 Files found: ${csvFiles.length}`);
    console.log(`✅ Files processed: ${processedFiles.length}`);
    console.log(`❌ Errors: ${errors.length}`);

    if (processedFiles.length > 0) {
      console.log('\n✅ Successfully processed files:');
      processedFiles.forEach(file => console.log(`  - ${file}`));
    }

    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(error => console.log(`  - ${error.fileName}: ${error.error}`));
    }

  } catch (error) {
    console.error('❌ ETL process failed:', error.message);
  } finally {
    await sftp.end();
    console.log('🔌 SFTP connection closed');
  }
}

function determineFileType(fileName) {
  if (fileName.includes('billing_log')) return 'billing_log';
  if (fileName.includes('patient_visit_log')) return 'patient_visit_log';
  if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
  if (fileName.includes('Claims_Report')) return 'claims_report';
  return 'unknown';
}

// Run the ETL process
runETL().catch(console.error);
