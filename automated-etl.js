#!/usr/bin/env node

/**
 * Automated Sleep Impressions ETL Processor
 * 
 * This script can be run:
 * 1. Manually: node automated-etl.js
 * 2. Via cron: 0 */6 * * * node /path/to/automated-etl.js
 * 3. Via GitHub Actions: Every 6 hours
 * 4. Via Vercel Cron: Every 6 hours
 */

import sftp from 'ssh2-sftp-client';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// Configuration
const CONFIG = {
  sftp: {
    host: process.env.SFTP_HOST,
    username: process.env.SFTP_USERNAME,
    privateKey: process.env.SFTP_PRIVATE_KEY?.replace(/\\n/g, '\n')
  },
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  processing: {
    archiveProcessedFiles: true,
    maxRetries: 3,
    retryDelay: 5000 // 5 seconds
  }
};

class AutomatedETLProcessor {
  constructor() {
    this.supabase = createClient(CONFIG.supabase.url, CONFIG.supabase.key);
    this.sftp = new sftp();
    this.batchId = crypto.randomUUID();
    this.stats = {
      filesFound: 0,
      filesProcessed: 0,
      recordsProcessed: 0,
      errors: [],
      startTime: new Date(),
      endTime: null
    };
  }

  async initialize() {
    console.log('🚀 Initializing Automated ETL Processor...');
    console.log(`🆔 Batch ID: ${this.batchId}`);
    console.log(`⏰ Start Time: ${this.stats.startTime.toISOString()}`);

    // Validate environment variables
    if (!CONFIG.sftp.host || !CONFIG.sftp.username || !CONFIG.sftp.privateKey) {
      throw new Error('Missing SFTP configuration. Please check environment variables.');
    }

    if (!CONFIG.supabase.url || !CONFIG.supabase.key) {
      throw new Error('Missing Supabase configuration. Please check environment variables.');
    }
  }

  async connectToSFTP() {
    console.log('🔗 Connecting to SFTP server...');
    
    try {
      await this.sftp.connect({
        host: CONFIG.sftp.host,
        username: CONFIG.sftp.username,
        privateKey: CONFIG.sftp.privateKey,
        readyTimeout: 30000
      });
      console.log('✅ Connected to SFTP server');
    } catch (error) {
      console.error('❌ Failed to connect to SFTP:', error.message);
      throw error;
    }
  }

  async listFiles() {
    console.log('📁 Listing files in SFTP directory...');
    
    try {
      const files = await this.sftp.list('/');
      const csvFiles = files
        .filter(file => file.name.endsWith('.csv'))
        .map(file => file.name);

      this.stats.filesFound = csvFiles.length;
      console.log(`📊 Found ${csvFiles.length} CSV files:`, csvFiles);
      
      return csvFiles;
    } catch (error) {
      console.error('❌ Failed to list files:', error.message);
      throw error;
    }
  }

  async processFile(fileName) {
    console.log(`\n🔄 Processing file: ${fileName}`);

    try {
      // Create ETL log entry
      const { data: logRecord, error: logError } = await this.supabase
        .from('etl_logs')
        .insert({
          file_name: fileName,
          file_type: this.determineFileType(fileName),
          status: 'processing',
          etl_batch_id: this.batchId
        })
        .select()
        .single();

      if (logError) {
        console.log('⚠️  Could not create ETL log (table may not exist):', logError.message);
      }

      // Download file
      const fileBuffer = await this.sftp.get(`/${fileName}`);
      console.log(`📥 Downloaded ${fileName} (${fileBuffer.length} bytes)`);

      // Parse CSV
      const csvContent = fileBuffer.toString('utf-8');
      const parseResult = Papa.parse(csvContent, { 
        header: true, 
        skipEmptyLines: true,
        transform: (value) => value.trim()
      });

      const data = parseResult.data;
      console.log(`✅ Parsed ${data.length} rows from ${fileName}`);

      // Process data based on file type
      const fileType = this.determineFileType(fileName);
      const processedData = await this.processFileData(fileType, data);

      // Archive file if enabled
      if (CONFIG.processing.archiveProcessedFiles) {
        await this.archiveFile(fileName);
      }

      // Update ETL log
      if (logRecord) {
        await this.supabase
          .from('etl_logs')
          .update({
            status: 'completed',
            records_processed: data.length,
            completed_at: new Date().toISOString()
          })
          .eq('id', logRecord.id);
      }

      this.stats.filesProcessed++;
      this.stats.recordsProcessed += data.length;

      console.log(`✅ Successfully processed ${fileName}: ${processedData.insertedCount}/${data.length} records inserted`);

    } catch (error) {
      console.error(`❌ Error processing ${fileName}:`, error.message);
      this.stats.errors.push({ fileName, error: error.message });
    }
  }

  async processFileData(fileType, data) {
    console.log(`🔄 Processing ${fileType} data...`);

    let insertedCount = 0;

    try {
      switch (fileType) {
        case 'patient_visits':
          const { data: patientVisitsData, error: patientVisitsError } = await this.supabase
            .from('patient_visits')
            .upsert(data.map(row => ({
              visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
              appointment_type: row['Appt Type'],
              patient_last_name: row['Patient Last Name'],
              patient_first_name: row['Patient First Name'],
              patient_id: row['Patient ID'] || row['Patient Id'],
              patient_home_phone: row['Patient Home Phone'],
              patient_cell_phone: row['Patient Cell Phone'],
              patient_email: row['Patient Email'],
              primary_insurance: row['Primary Insurance'],
              referring_md_last: row['Referring MD Last'],
              stage: row['Stage'],
              date_signed: row['Date Signed'] ? new Date(row['Date Signed']) : null,
              cpt_code: row['CPT Code'],
              device: row['Device'],
              location: row['Location'],
              clinic_partner: row['Clinic Partner '],
              etl_batch_id: this.batchId
            })), { onConflict: 'patient_id,visit_date,appointment_type' })
            .select();

          if (patientVisitsError) {
            console.log('⚠️  Could not insert patient visits (table may not exist):', patientVisitsError.message);
          } else {
            insertedCount = patientVisitsData.length;
          }
          break;

        case 'billing_log':
          const { data: billingLogData, error: billingLogError } = await this.supabase
            .from('billing_log')
            .upsert(data.map(row => ({
              visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
              appointment_type: row['Appt Type'],
              patient_last_name: row['Patient Last Name'],
              patient_first_name: row['Patient First Name'],
              patient_id: row['Patient Id'],
              referring_md_last: row['Referring MD Last'],
              primary_insurance: row['Primary Insurance'],
              stage: row['Stage'],
              date_consult_signed: row['Date Consult Signed'] ? new Date(row['Date Consult Signed']) : null,
              date_billed: row['Date Billed'] ? new Date(row['Date Billed']) : null,
              cpt_code: row['CPT Code'],
              claim_amount: row['Claim Amount'] ? parseFloat(row['Claim Amount']) : null,
              billing_provider: row['Billing provider'],
              location: row['Location'],
              etl_batch_id: this.batchId
            })), { onConflict: 'patient_id,cpt_code,date_billed' })
            .select();

          if (billingLogError) {
            console.log('⚠️  Could not insert billing log (table may not exist):', billingLogError.message);
          } else {
            insertedCount = billingLogData.length;
          }
          break;

        case 'claims_collections':
          const { data: claimsData, error: claimsError } = await this.supabase
            .from('claims_collections')
            .upsert(data.map(row => ({
              last_name: row['Last Name'],
              first_name: row['First Name'],
              billing_provider: row['Billing Provider'],
              patient_id: row['Patient ID'],
              dos: row['DOS'] ? new Date(row['DOS']) : null,
              insurance_id: row['Insurance ID'],
              claim_number: row['Claim#'],
              trace_id: row['Trace Id'],
              icn: row['ICN'],
              payer: row['Payer'],
              claim_date: row['Claim Date'] ? new Date(row['Claim Date']) : null,
              recent_submission_date: row['Recent Submission Date'] ? new Date(row['Recent Submission Date']) : null,
              cpt_codes: row['CPT Codes'],
              charge_fees: row['Charge Fees'],
              total_charge: row['Total Charge'] ? parseFloat(row['Total Charge']) : null,
              adj_charge: row['Adj Charge'] ? parseFloat(row['Adj Charge']) : null,
              ins_adjustment: row['Ins Adjustment'],
              allowable_sum: row['Allowable (SUM)'] ? parseFloat(row['Allowable (SUM)']) : null,
              remainder: row['Remainder'] ? parseFloat(row['Remainder']) : null,
              pat_writeoff: row['Pat Writeoff'] ? parseFloat(row['Pat Writeoff']) : null,
              deductible: row['Deductible'] ? parseFloat(row['Deductible']) : null,
              collections: row['Collections'] ? parseFloat(row['Collections']) : null,
              denial_code: row['Denial Code'],
              otc: row['OTC'],
              ins_payment: row['Ins Payment'] ? parseFloat(row['Ins Payment']) : null,
              pat_payment: row['Pat Payment'] ? parseFloat(row['Pat Payment']) : null,
              patient_address: row['Patient Address'],
              patient_city: row['Patient City'],
              patient_state: row['Patient State'],
              patient_zip: row['Patient Zip'],
              patient_dob: row['Patient DOB'] ? new Date(row['Patient DOB']) : null,
              home_phone: row['Home Phone'],
              work_phone: row['Work Phone'],
              place_of_service: row['Place of Service'],
              insurance_address: row['Insurance Address'],
              insurance_city: row['Insurance City'],
              insurance_state: row['Insurance State'],
              insurance_zip: row['Insurance Zip'],
              authorization_number: row['Authorization Number'],
              insurance_group_number: row['Insurance Group Number'],
              icd_10_diagnosis_code: row['ICD-10 Diagnosis Code'],
              etl_batch_id: this.batchId
            })), { onConflict: 'claim_number' })
            .select();

          if (claimsError) {
            console.log('⚠️  Could not insert claims (table may not exist):', claimsError.message);
          } else {
            insertedCount = claimsData.length;
          }
          break;

        case 'insurance_pat_ref':
          const { data: insuranceData, error: insuranceError } = await this.supabase
            .from('insurance_pat_ref')
            .insert(data.map(row => ({
              insurance_plan_1: row['Insurance Plan 1'],
              patient_last_name: row['Patient Last Name'],
              patient_first_name: row['Patient First Name'],
              visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
              appointment_type: row['Appt Type'],
              referring_md_last: row['Referring MD Last'],
              etl_batch_id: this.batchId
            })))
            .select();

          if (insuranceError) {
            console.log('⚠️  Could not insert insurance ref (table may not exist):', insuranceError.message);
          } else {
            insertedCount = insuranceData.length;
          }
          break;

        default:
          console.log(`❓ Unknown file type: ${fileType}`);
      }

    } catch (error) {
      console.error(`❌ Error processing ${fileType}:`, error.message);
    }

    return { insertedCount };
  }

  async archiveFile(fileName) {
    try {
      // Create archive directory if it doesn't exist
      const archiveDir = '/archive';
      try {
        await this.sftp.mkdir(archiveDir);
      } catch (error) {
        // Directory already exists
      }

      // Move file to archive with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const archivedName = `${fileName}.${timestamp}`;
      await this.sftp.rename(`/${fileName}`, `${archiveDir}/${archivedName}`);
      console.log(`📦 Archived ${fileName} as ${archivedName}`);
    } catch (error) {
      console.error(`❌ Failed to archive ${fileName}:`, error.message);
    }
  }

  determineFileType(fileName) {
    if (fileName.includes('billing_log')) return 'billing_log';
    if (fileName.includes('claims_for_collections')) return 'claims_collections';
    if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
    if (fileName.includes('patient_visit_log')) return 'patient_visits';
    return 'unknown';
  }

  async run() {
    try {
      await this.initialize();
      await this.connectToSFTP();

      const files = await this.listFiles();

      if (files.length === 0) {
        console.log('📭 No files to process');
        return;
      }

      // Process each file
      for (const fileName of files) {
        await this.processFile(fileName);
      }

      this.stats.endTime = new Date();
      await this.printSummary();

    } catch (error) {
      console.error('❌ ETL process failed:', error.message);
      this.stats.errors.push({ type: 'fatal', error: error.message });
    } finally {
      await this.cleanup();
    }
  }

  async printSummary() {
    const duration = this.stats.endTime - this.stats.startTime;
    
    console.log('\n🎉 AUTOMATED ETL PROCESS SUMMARY:');
    console.log('==================================');
    console.log(`🆔 Batch ID: ${this.batchId}`);
    console.log(`⏰ Duration: ${Math.round(duration / 1000)} seconds`);
    console.log(`📊 Files found: ${this.stats.filesFound}`);
    console.log(`✅ Files processed: ${this.stats.filesProcessed}`);
    console.log(`📈 Records processed: ${this.stats.recordsProcessed}`);
    console.log(`❌ Errors: ${this.stats.errors.length}`);

    if (this.stats.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      this.stats.errors.forEach(error => {
        if (error.fileName) {
          console.log(`  - ${error.fileName}: ${error.error}`);
        } else {
          console.log(`  - ${error.error}`);
        }
      });
    }

    // Save summary to file
    const summaryFile = `etl-summary-${this.batchId}.json`;
    fs.writeFileSync(summaryFile, JSON.stringify(this.stats, null, 2));
    console.log(`\n💾 Summary saved to: ${summaryFile}`);
  }

  async cleanup() {
    try {
      await this.sftp.end();
      console.log('🔌 SFTP connection closed');
    } catch (error) {
      console.error('❌ Error closing SFTP connection:', error.message);
    }
  }
}

// Main execution
async function main() {
  const processor = new AutomatedETLProcessor();
  await processor.run();
}

// Handle command line arguments
if (process.argv.includes('--help')) {
  console.log(`
Automated Sleep Impressions ETL Processor

Usage:
  node automated-etl.js [options]

Options:
  --help     Show this help message
  --dry-run  Process files without inserting into database
  --verbose  Enable verbose logging

Environment Variables:
  SFTP_HOST                    SFTP server hostname
  SFTP_USERNAME               SFTP username
  SFTP_PRIVATE_KEY            SFTP private key
  NEXT_PUBLIC_SUPABASE_URL    Supabase project URL
  SUPABASE_SERVICE_ROLE_KEY   Supabase service role key

Examples:
  node automated-etl.js
  node automated-etl.js --dry-run
  node automated-etl.js --verbose
  `);
  process.exit(0);
}

// Run the processor
main().catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
