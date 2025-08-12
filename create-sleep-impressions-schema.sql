-- Sleep Impressions ETL Database Schema
-- Based on actual data structure analysis

-- ETL Processing Logs
CREATE TABLE IF NOT EXISTS etl_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT
);

-- Patient Visits (from patient_visit_log)
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

-- Billing Log (from billing_log)
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

-- Claims Collections (from claims_for_collections)
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

-- Insurance Patient Reference (from insurance_pat_ref)
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

-- Add comments for documentation
COMMENT ON TABLE patient_visits IS 'Patient visit data from Sleep Impressions patient_visit_log';
COMMENT ON TABLE billing_log IS 'Billing information from Sleep Impressions billing_log';
COMMENT ON TABLE claims_collections IS 'Claims and collections data from Sleep Impressions claims_for_collections';
COMMENT ON TABLE insurance_pat_ref IS 'Insurance patient reference data from Sleep Impressions insurance_pat_ref';
COMMENT ON TABLE etl_logs IS 'ETL processing logs for tracking data imports';
