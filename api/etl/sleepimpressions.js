const Client = require('ssh2-sftp-client');
const Papa = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const sftpHost = process.env.SFTP_HOST;
    const sftpUsername = process.env.SFTP_USERNAME;
    const sftpPrivateKey = process.env.SFTP_PRIVATE_KEY;

    if (!sftpHost || !sftpUsername || !sftpPrivateKey) {
      return res.status(500).json({ error: 'Missing SFTP configuration' });
    }

    const sftp = new Client();

    try {
      await sftp.connect({
        host: sftpHost,
        username: sftpUsername,
        privateKey: sftpPrivateKey.replace(/\\n/g, '\n'),
        readyTimeout: 99999
      });

      const files = await sftp.list('/');
      const csvFiles = files.filter(f => f.name.endsWith('.csv')).map(f => f.name);

      const processedFiles = [];
      const errors = [];

      for (const fileName of csvFiles) {
        try {
          const fileBuffer = await sftp.get(`/${fileName}`);
          const archiveDir = '/archive';
          try { await sftp.mkdir(archiveDir); } catch {}
          await sftp.rename(`/${fileName}`, `${archiveDir}/${fileName}`);

          const csvContent = fileBuffer.toString('utf-8');
          const parseResult = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
          if (parseResult.errors.length > 0) {
            throw new Error(`CSV parsing errors: ${parseResult.errors.map(e => e.message).join(', ')}`);
          }
          const rows = parseResult.data;

          const { data: logRecord } = await supabase
            .from('etl_logs')
            .insert({ file_name: fileName, file_type: determineFileType(fileName), status: 'processing' })
            .select()
            .single();

          const fileType = determineFileType(fileName);
          let insertedCount = 0;
          if (fileType === 'patient_visit_log' || fileType === 'patient_visits') {
            const { data, error } = await supabase
              .from('patient_visits')
              .upsert(rows.map(row => ({
                visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
                appointment_type: row['Appt Type'],
                patient_last_name: row['Patient Last Name'],
                patient_first_name: row['Patient First Name'],
                patient_id: row['Patient Id'] || row['Patient ID'],
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
                clinic_partner: row['Clinic Partner'] || row['Clinic Partner ']
              })), { onConflict: 'patient_id,visit_date,appointment_type' })
              .select();
            if (error) throw error; insertedCount = data.length;
          } else if (fileType === 'billing_log') {
            const { data, error } = await supabase
              .from('billing_log')
              .upsert(rows.map(row => ({
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
                location: row['Location']
              })), { onConflict: 'patient_id,cpt_code,date_billed' })
              .select();
            if (error) throw error; insertedCount = data.length;
          } else if (fileType === 'claims_collections' || fileType === 'claims_report') {
            const { data, error } = await supabase
              .from('claims_collections')
              .upsert(rows.map(row => ({
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
                pat_payment: row['Pat Payment'] ? parseFloat(row['Pat Payment']) : null
              })), { onConflict: 'claim_number' })
              .select();
            if (error) throw error; insertedCount = data.length;
          } else if (fileType === 'insurance_pat_ref') {
            const { data, error } = await supabase
              .from('insurance_pat_ref')
              .insert(rows.map(row => ({
                insurance_plan_1: row['Insurance Plan 1'],
                patient_last_name: row['Patient Last Name'],
                patient_first_name: row['Patient First Name'],
                visit_date: row['Visit Date'] ? new Date(row['Visit Date']) : null,
                appointment_type: row['Appt Type'],
                referring_md_last: row['Referring MD Last']
              })))
              .select();
            if (error) throw error; insertedCount = data.length;
          }

          await supabase
            .from('etl_logs')
            .update({ status: 'completed', records_processed: insertedCount, completed_at: new Date().toISOString() })
            .eq('id', logRecord.id);

          processedFiles.push(fileName);
        } catch (fileError) {
          errors.push({ fileName, error: fileError.message || String(fileError) });
        }
      }

      const result = {
        success: true,
        timestamp: new Date().toISOString(),
        filesFound: csvFiles.length,
        filesProcessed: processedFiles.length,
        processedFiles,
        errors: errors.length > 0 ? errors : undefined
      };

      return res.status(200).json(result);
    } finally {
      await sftp.end();
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || String(error) });
  }
};

function determineFileType(fileName) {
  if (fileName.includes('billing_log')) return 'billing_log';
  if (fileName.includes('patient_visit_log')) return 'patient_visit_log';
  if (fileName.includes('insurance_pat_ref')) return 'insurance_pat_ref';
  if (fileName.includes('Claims_Report')) return 'claims_collections';
  return 'unknown';
}


