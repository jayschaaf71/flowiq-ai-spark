import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function processSleepImpressions() {
  console.log('🚀 Processing Sleep Impressions Data...');

  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Define the files to process (from today's upload)
    const files = [
      'billing_log_2025-08-11_10-23-50.csv',
      'claims_for_collections_rpt\'_2025-08-11_10-26-42.csv',
      'insurance_pat_ref_report_2025-08-11_10-25-52.csv',
      'patient_visit_log_2025-08-11_10-24-49.csv'
    ];

    const downloadsPath = path.join(process.env.HOME, 'Downloads');
    
    console.log('📁 Processing files from:', downloadsPath);

    // Process each file
    for (const fileName of files) {
      const filePath = path.join(downloadsPath, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${fileName}`);
        continue;
      }

      try {
        console.log(`\n🔄 Processing: ${fileName}`);

        // Read and parse CSV
        const csvContent = fs.readFileSync(filePath, 'utf-8');
        const parseResult = Papa.parse(csvContent, { 
          header: true, 
          skipEmptyLines: true,
          transform: (value) => value.trim() // Clean whitespace
        });

        if (parseResult.errors.length > 0) {
          console.log(`⚠️  CSV parsing warnings:`, parseResult.errors);
        }

        const data = parseResult.data;
        console.log(`✅ Parsed ${data.length} rows`);

        // Show data structure
        if (data.length > 0) {
          console.log(`📊 Columns:`, Object.keys(data[0]));
          console.log(`📊 Sample row:`, data[0]);
        }

        // Determine file type and process accordingly
        const fileType = determineFileType(fileName);
        console.log(`📋 File type: ${fileType}`);

        // Create ETL log entry
        const { data: logRecord, error: logError } = await supabase
          .from('etl_logs')
          .insert({
            file_name: fileName,
            file_type: fileType,
            status: 'processing',
            records_processed: data.length
          })
          .select()
          .single();

        if (logError) {
          console.error('❌ Failed to create ETL log:', logError);
        } else {
          console.log(`📝 Created ETL log entry: ${logRecord.id}`);
        }

        // Process based on file type
        await processFileData(supabase, fileType, data, fileName);

        // Update ETL log with success
        if (logRecord) {
          await supabase
            .from('etl_logs')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString()
            })
            .eq('id', logRecord.id);
        }

        console.log(`✅ Successfully processed ${fileName}`);

      } catch (fileError) {
        console.error(`❌ Error processing ${fileName}:`, fileError.message);
      }
    }

    console.log('\n🎉 Sleep Impressions ETL Complete!');

  } catch (error) {
    console.error('❌ ETL process failed:', error.message);
  }
}

function determineFileType(fileName) {
  if (fileName.includes('billing_log')) return 'billing_log';
  if (fileName.includes('claims_for_collections')) return 'claims_collections';
  if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
  if (fileName.includes('patient_visit_log')) return 'patient_visit_log';
  return 'unknown';
}

async function processFileData(supabase, fileType, data, fileName) {
  console.log(`🔄 Processing ${fileType} data...`);

  switch (fileType) {
    case 'billing_log':
      // Process billing log data
      console.log(`💰 Billing records: ${data.length}`);
      // TODO: Insert into billing_logs table
      break;

    case 'claims_collections':
      // Process claims for collections
      console.log(`📋 Claims records: ${data.length}`);
      // TODO: Insert into claims table
      break;

    case 'insurance_pat_ref':
      // Process insurance patient reference
      console.log(`🏥 Insurance records: ${data.length}`);
      // TODO: Insert into insurance_pat_ref table
      break;

    case 'patient_visit_log':
      // Process patient visit log
      console.log(`👥 Patient visit records: ${data.length}`);
      // TODO: Insert into patient_visits table
      break;

    default:
      console.log(`❓ Unknown file type: ${fileType}`);
  }

  // For now, just log the data structure
  if (data.length > 0) {
    console.log(`📊 Data structure for ${fileType}:`, Object.keys(data[0]));
  }
}

// Run the process
processSleepImpressions().catch(console.error);
