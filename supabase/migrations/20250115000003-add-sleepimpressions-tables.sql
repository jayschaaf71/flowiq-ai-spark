-- Create legacy_claim_kpi table for KPI baseline tracking
CREATE TABLE IF NOT EXISTS legacy_claim_kpi (
    id BIGSERIAL PRIMARY KEY,
    claim_id VARCHAR(255) NOT NULL,
    status VARCHAR(100),
    submitted TIMESTAMP,
    source VARCHAR(50) DEFAULT 'sleepimpr',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_legacy_claim_kpi_claim_id ON legacy_claim_kpi(claim_id);
CREATE INDEX IF NOT EXISTS idx_legacy_claim_kpi_source ON legacy_claim_kpi(source);

-- Add RLS policies
ALTER TABLE legacy_claim_kpi ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read legacy claim KPI data
CREATE POLICY "Allow read access to legacy_claim_kpi" ON legacy_claim_kpi
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert legacy claim KPI data
CREATE POLICY "Allow service role to insert legacy_claim_kpi" ON legacy_claim_kpi
    FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Ensure encounter table has the required columns
DO $$ 
BEGIN
    -- Add source column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'encounter' AND column_name = 'source') THEN
        ALTER TABLE encounter ADD COLUMN source VARCHAR(50);
    END IF;
    
    -- Add encounter_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'encounter' AND column_name = 'encounter_id') THEN
        ALTER TABLE encounter ADD COLUMN encounter_id VARCHAR(255) UNIQUE;
    END IF;
    
    -- Add cpt column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'encounter' AND column_name = 'cpt') THEN
        ALTER TABLE encounter ADD COLUMN cpt VARCHAR(20);
    END IF;
    
    -- Add charge column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'encounter' AND column_name = 'charge') THEN
        ALTER TABLE encounter ADD COLUMN charge DECIMAL(10,2) DEFAULT 0;
    END IF;
END $$;

-- Create index for encounter source
CREATE INDEX IF NOT EXISTS idx_encounter_source ON encounter(source);

-- Ensure payer_policy table has the required columns
DO $$ 
BEGIN
    -- Add policy_no column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payer_policy' AND column_name = 'policy_no') THEN
        ALTER TABLE payer_policy ADD COLUMN policy_no VARCHAR(255);
    END IF;
    
    -- Add unique constraint for patient_id and payer_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE table_name = 'payer_policy' AND constraint_name = 'payer_policy_patient_payer_unique') THEN
        ALTER TABLE payer_policy ADD CONSTRAINT payer_policy_patient_payer_unique 
        UNIQUE (patient_id, payer_name);
    END IF;
END $$;

-- Create etl_logs table for observability
CREATE TABLE IF NOT EXISTS etl_logs (
    id BIGSERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    rows_processed INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL, -- 'success', 'error', 'partial'
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for etl_logs
CREATE INDEX IF NOT EXISTS idx_etl_logs_filename ON etl_logs(filename);
CREATE INDEX IF NOT EXISTS idx_etl_logs_status ON etl_logs(status);
CREATE INDEX IF NOT EXISTS idx_etl_logs_created_at ON etl_logs(created_at);

-- Add RLS policies for etl_logs
ALTER TABLE etl_logs ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read ETL logs
CREATE POLICY "Allow read access to etl_logs" ON etl_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to insert ETL logs
CREATE POLICY "Allow service role to insert etl_logs" ON etl_logs
    FOR INSERT WITH CHECK (auth.role() = 'service_role');
