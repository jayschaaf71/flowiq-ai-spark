import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

async function processSleepImpressions() {
  console.log('🚀 Processing Sleep Impressions Data (Final Version)...');

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

    // Create a summary object
    const summary = {
      totalFiles: files.length,
      processedFiles: 0,
      totalRecords: 0,
      errors: [],
      dataSamples: {}
    };

    // Process each file
    for (const fileName of files) {
      const filePath = path.join(downloadsPath, fileName);
      
      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${fileName}`);
        summary.errors.push(`File not found: ${fileName}`);
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

        const data = parseResult.data;
        console.log(`✅ Parsed ${data.length} rows`);

        // Store data sample
        if (data.length > 0) {
          summary.dataSamples[fileName] = {
            columns: Object.keys(data[0]),
            sampleRow: data[0],
            recordCount: data.length
          };
        }

        summary.totalRecords += data.length;
        summary.processedFiles++;

        console.log(`✅ Successfully processed ${fileName}`);

      } catch (fileError) {
        console.error(`❌ Error processing ${fileName}:`, fileError.message);
        summary.errors.push(`${fileName}: ${fileError.message}`);
      }
    }

    // Print summary
    console.log('\n�� ETL PROCESS SUMMARY:');
    console.log('========================');
    console.log(`📊 Total files: ${summary.totalFiles}`);
    console.log(`✅ Processed files: ${summary.processedFiles}`);
    console.log(`📈 Total records: ${summary.totalRecords}`);
    console.log(`❌ Errors: ${summary.errors.length}`);

    if (summary.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      summary.errors.forEach(error => console.log(`  - ${error}`));
    }

    console.log('\n📋 Data Structure Summary:');
    console.log('==========================');
    Object.entries(summary.dataSamples).forEach(([fileName, data]) => {
      console.log(`\n📁 ${fileName}:`);
      console.log(`   Records: ${data.recordCount}`);
      console.log(`   Columns: ${data.columns.join(', ')}`);
      console.log(`   Sample: ${JSON.stringify(data.sampleRow, null, 2)}`);
    });

    // Save summary to file
    const summaryFile = 'etl-summary.json';
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Summary saved to: ${summaryFile}`);

    console.log('\n🎉 Sleep Impressions ETL Complete!');
    console.log('\n📋 NEXT STEPS:');
    console.log('1. Review the data structure above');
    console.log('2. Create database tables based on the column structure');
    console.log('3. Implement data insertion logic');
    console.log('4. Set up automated processing');

  } catch (error) {
    console.error('❌ ETL process failed:', error.message);
  }
}

// Run the process
processSleepImpressions().catch(console.error);
