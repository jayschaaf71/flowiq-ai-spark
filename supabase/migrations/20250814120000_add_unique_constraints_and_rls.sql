-- Unique indexes for idempotent upserts
CREATE UNIQUE INDEX IF NOT EXISTS uq_patient_visits_pid_date_appt
ON patient_visits (patient_id, visit_date, appointment_type);

CREATE UNIQUE INDEX IF NOT EXISTS uq_billing_log_pid_cpt_billed
ON billing_log (patient_id, cpt_code, date_billed);

-- claim_number may be the best unique key; guard nulls
CREATE UNIQUE INDEX IF NOT EXISTS uq_claims_collections_claim_number
ON claims_collections (claim_number)
WHERE claim_number IS NOT NULL;

-- Optional RLS scaffolding (disabled by default for service-role usage)
-- Uncomment to enable and craft policies per tenant
-- ALTER TABLE patient_visits ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE billing_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE claims_collections ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE insurance_pat_ref ENABLE ROW LEVEL SECURITY;

-- Example read policy (restrict later if needed)
-- CREATE POLICY read_all_patient_visits ON patient_visits FOR SELECT USING (true);
-- CREATE POLICY read_all_billing_log ON billing_log FOR SELECT USING (true);
-- CREATE POLICY read_all_claims ON claims_collections FOR SELECT USING (true);
-- CREATE POLICY read_all_ins_ref ON insurance_pat_ref FOR SELECT USING (true);
