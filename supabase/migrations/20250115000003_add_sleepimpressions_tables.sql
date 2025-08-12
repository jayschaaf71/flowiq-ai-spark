-- Sleep Impressions ETL Migration
CREATE TABLE IF NOT EXISTS legacy_claim_kpi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID REFERENCES claims(id) ON DELETE CASCADE,
    provider_name TEXT,
    patient_name TEXT,
    dos DATE,
    amount DECIMAL(10,2),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS etl_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    status TEXT NOT NULL,
    records_processed INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Add columns to existing tables
ALTER TABLE encounter 
    ADD COLUMN IF NOT EXISTS provider_name TEXT,
    ADD COLUMN IF NOT EXISTS service_date DATE,
    ADD COLUMN IF NOT EXISTS procedure_code TEXT;

ALTER TABLE payer_policy 
    ADD COLUMN IF NOT EXISTS carrier_code TEXT,
    ADD COLUMN IF NOT EXISTS group_number TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_legacy_claim_kpi_claim_id ON legacy_claim_kpi(claim_id);
CREATE INDEX IF NOT EXISTS idx_legacy_claim_kpi_dos ON legacy_claim_kpi(dos);
CREATE INDEX IF NOT EXISTS idx_etl_logs_file_name ON etl_logs(file_name);
CREATE INDEX IF NOT EXISTS idx_etl_logs_status ON etl_logs(status);
CREATE INDEX IF NOT EXISTS idx_encounter_service_date ON encounter(service_date);
CREATE INDEX IF NOT EXISTS idx_payer_policy_carrier_code ON payer_policy(carrier_code);
