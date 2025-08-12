-- Sleep Impressions ETL Database Tables

-- ETL Logs Table
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

-- Patient Visits Table
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

-- Insurance Patient Reference Table
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

-- Billing Log Table
CREATE TABLE IF NOT EXISTS billing_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Add billing-specific columns based on CSV structure
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Claims Collections Table
CREATE TABLE IF NOT EXISTS claims_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Add claims-specific columns based on CSV structure
    etl_batch_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_patient_visits_visit_date ON patient_visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_patient_visits_patient_id ON patient_visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_pat_ref_visit_date ON insurance_pat_ref(visit_date);
CREATE INDEX IF NOT EXISTS idx_etl_logs_created_at ON etl_logs(created_at);
