# Sleep Impressions ETL Pipeline

This ETL pipeline integrates Sleep Impressions data into FlowIQ's automated claims processing system.

## Overview

The pipeline performs a one-way data flow:
```
Sleep Impressions → CSV Files → FlowIQ ETL → Automated Claims Processing
```

## Components

### 1. SFTP Watcher (`watchSftp.ts`)
- Connects to SFTP server at `imports.flowiq.ai`
- Monitors `/midwest/si/` directory for new CSV files
- Downloads and processes files, then archives them
- Runs daily at 3:00 AM UTC via Vercel cron

### 2. File Router (`ingest.ts`)
- Routes files based on filename patterns:
  - `billing_log_*.csv` → Encounter records
  - `patient_visit_*.csv` → Visit tracking + claim triggers
  - `insurance_pat_ref_*.csv` → Payer policies
  - `Claims_Report_*.csv` → Legacy KPI baseline

### 3. Data Mappers
- **Billing Logs**: Creates encounter records with `source: 'sleepimpr'`
- **Visit Logs**: Triggers automated claim submission for "Delivery" stage
- **Insurance Refs**: Updates payer policy information
- **Legacy Claims**: Stores baseline KPI data for comparison

## Database Schema

### New Tables
- `legacy_claim_kpi`: Baseline claim status tracking
- `etl_logs`: Processing observability

### Enhanced Tables
- `encounter`: Added `source`, `encounter_id`, `cpt`, `charge` columns
- `payer_policy`: Added `policy_no` column and unique constraints

## Environment Variables

```bash
# SFTP Configuration
SI_SFTP_HOST=imports.flowiq.ai
SI_SFTP_USER=etl_si
SI_SFTP_PASS=••••••••

# ETL Security
ETL_SECRET_TOKEN=••••••••

# Supabase (existing)
VITE_SUPABASE_URL=••••••••
VITE_SUPABASE_ANON_KEY=••••••••
```

## Testing

Run the test suite:
```bash
npm test tests/etl_si.test.ts
```

Test fixtures are in `tests/fixtures/midwest_si/`:
- `billing_log_2025-01-15.csv`
- `patient_visit_log_2025-01-15.csv`
- `insurance_pat_ref_2025-01-15.csv`
- `Claims_Report_2025-01-15.csv`

## Manual Execution

Trigger the ETL job manually:
```bash
curl -X POST https://your-domain.vercel.app/api/etl/sleepimpressions
```

Or with authentication:
```bash
curl -H "Authorization: Bearer $ETL_SECRET_TOKEN" \
     https://your-domain.vercel.app/api/etl/sleepimpressions
```

## Monitoring

### ETL Logs
Check the `etl_logs` table for processing status:
```sql
SELECT * FROM etl_logs 
WHERE filename LIKE '%sleepimpressions%' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Data Validation
Verify ingested data:
```sql
-- Check encounter records
SELECT COUNT(*) FROM encounter WHERE source = 'sleepimpr';

-- Check automation steps
SELECT COUNT(*) FROM automation_steps 
WHERE metadata->>'source' = 'sleepimpr';

-- Check legacy KPI data
SELECT COUNT(*) FROM legacy_claim_kpi WHERE source = 'sleepimpr';
```

## Error Handling

- **SFTP Errors**: Logged to console and ETL logs table
- **CSV Parsing Errors**: Graceful handling with detailed error messages
- **Database Errors**: Individual row failures don't stop entire process
- **Network Errors**: Automatic retry logic in SFTP client

## Security

- SFTP credentials stored in environment variables
- API endpoint requires authentication for manual triggers
- Row-level security policies on all tables
- No sensitive data logged to console

## Future Enhancements

### Phase 2: Two-Way Integration
- Add CSV export functionality for status updates
- Implement outbound SFTP to `/midwest/si/outbound/`
- Create staff import instructions

### Phase 3: HL7 Integration
- Purchase REMware HL7 Inbound module
- Implement ORU/MDM message formats
- Full automated two-way sync

## Troubleshooting

### Common Issues

1. **SFTP Connection Failed**
   - Verify credentials in environment variables
   - Check network connectivity to `imports.flowiq.ai`

2. **CSV Parsing Errors**
   - Validate file format matches expected schema
   - Check for encoding issues (should be UTF-8)

3. **Database Insert Errors**
   - Verify table schema matches migration
   - Check RLS policies for service role access

4. **Cron Job Not Running**
   - Verify Vercel cron configuration
   - Check function logs in Vercel dashboard

### Debug Mode

Enable detailed logging by setting:
```bash
DEBUG=etl:*
```

## Acceptance Criteria

- [x] Files auto-archived after ingest
- [x] `encounter.source = 'sleepimpr'` rows exist
- [x] `claims.submit` jobs enqueued for "Delivery" stage
- [x] Unit test suite green
- [x] Daily cron job configured
- [x] Error logging and monitoring
- [x] Security and authentication
