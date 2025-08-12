# Sleep Impressions ETL - Deployment Checklist

## 🚀 **DEPLOYMENT PHASE**

### ✅ **Step 1: Environment Variables Setup**

**Required Environment Variables:**
```bash
# SFTP Configuration
SI_SFTP_HOST=imports.flowiq.ai
SI_SFTP_USER=etl_si
SI_SFTP_PASS=[PASSWORD_FROM_SFTP_SERVER]

# ETL Security
ETL_SECRET_TOKEN=[GENERATE_SECURE_TOKEN]

# Supabase (existing)
VITE_SUPABASE_URL=[YOUR_SUPABASE_URL]
VITE_SUPABASE_ANON_KEY=[YOUR_SUPABASE_ANON_KEY]
```

**Action Items:**
- [ ] Set up SFTP server at `imports.flowiq.ai`
- [ ] Create SFTP user `etl_si` with access to `/midwest/si/`
- [ ] Generate secure `ETL_SECRET_TOKEN`
- [ ] Add environment variables to Vercel project

### ✅ **Step 2: Database Migration**

**Run the migration:**
```bash
# Apply the Sleep Impressions tables migration
supabase db push
```

**Verify tables created:**
- [ ] `legacy_claim_kpi` table exists
- [ ] `etl_logs` table exists
- [ ] `encounter` table has new columns (`source`, `encounter_id`, `cpt`, `charge`)
- [ ] `payer_policy` table has `policy_no` column
- [ ] RLS policies are in place

### ✅ **Step 3: SFTP Server Setup**

**Create SFTP directory structure:**
```bash
/midwest/si/
├── archive/          # Processed files go here
├── outbound/         # Future: status updates
└── [CSV files]      # New files to process
```

**Action Items:**
- [ ] Set up SFTP server at `imports.flowiq.ai`
- [ ] Create user `etl_si` with read/write permissions
- [ ] Create directory structure
- [ ] Test SFTP connection

### ✅ **Step 4: Deploy to Production**

**Deploy the ETL pipeline:**
```bash
# Push to production
git push origin main

# Verify deployment
curl -X POST https://your-domain.vercel.app/api/etl/sleepimpressions
```

**Action Items:**
- [ ] Deploy to Vercel
- [ ] Verify cron job is scheduled (daily at 3:00 AM UTC)
- [ ] Test manual API endpoint
- [ ] Check Vercel function logs

### ✅ **Step 5: Test with Real Data**

**Prepare test files:**
- [ ] Create sample `billing_log_2025-01-16.csv`
- [ ] Create sample `patient_visit_log_2025-01-16.csv`
- [ ] Create sample `insurance_pat_ref_2025-01-16.csv`
- [ ] Create sample `Claims_Report_2025-01-16.csv`

**Upload to SFTP:**
```bash
# Upload test files to SFTP
sftp etl_si@imports.flowiq.ai
cd /midwest/si/
put billing_log_2025-01-16.csv
put patient_visit_log_2025-01-16.csv
put insurance_pat_ref_2025-01-16.csv
put Claims_Report_2025-01-16.csv
```

**Trigger processing:**
```bash
# Manual trigger
curl -X POST https://your-domain.vercel.app/api/etl/sleepimpressions
```

### ✅ **Step 6: Verify Data Processing**

**Check database for processed data:**
```sql
-- Check encounter records
SELECT COUNT(*) FROM encounter WHERE source = 'sleepimpr';

-- Check automation steps
SELECT COUNT(*) FROM automation_steps 
WHERE metadata->>'source' = 'sleepimpr';

-- Check legacy KPI data
SELECT COUNT(*) FROM legacy_claim_kpi WHERE source = 'sleepimpr';

-- Check ETL logs
SELECT * FROM etl_logs ORDER BY created_at DESC LIMIT 5;
```

**Action Items:**
- [ ] Verify encounter records created
- [ ] Verify automation steps enqueued for "Delivery" visits
- [ ] Verify insurance data updated
- [ ] Verify legacy claims data stored
- [ ] Check ETL logs for processing status

### ✅ **Step 7: Monitor and Validate**

**Set up monitoring:**
- [ ] Configure Slack webhook for ETL errors
- [ ] Set up alerts for failed processing
- [ ] Create dashboard for ETL status
- [ ] Document escalation procedures

**Validation queries:**
```sql
-- Daily processing status
SELECT 
  filename,
  status,
  rows_processed,
  processing_time_ms,
  created_at
FROM etl_logs 
WHERE created_at > now() - interval '1 day'
ORDER BY created_at DESC;

-- Data quality check
SELECT 
  source,
  COUNT(*) as record_count,
  MIN(created_at) as first_record,
  MAX(created_at) as last_record
FROM encounter 
WHERE source = 'sleepimpr'
GROUP BY source;
```

### ✅ **Step 8: Staff Training and Documentation**

**Create documentation:**
- [ ] ETL processing workflow
- [ ] Monitoring dashboard guide
- [ ] Troubleshooting procedures
- [ ] Escalation contacts

**Staff training:**
- [ ] How to monitor ETL status
- [ ] How to check processed data
- [ ] How to handle errors
- [ ] How to trigger manual processing

### ✅ **Step 9: Production Validation**

**End-to-end testing:**
- [ ] Upload real Sleep Impressions files
- [ ] Verify automatic processing
- [ ] Check automated claim submission
- [ ] Validate data accuracy
- [ ] Test error scenarios

**Performance monitoring:**
- [ ] Processing time metrics
- [ ] Error rate tracking
- [ ] Data volume monitoring
- [ ] System resource usage

### ✅ **Step 10: Go-Live Checklist**

**Final verification:**
- [ ] All environment variables set
- [ ] Database migration complete
- [ ] SFTP server operational
- [ ] Cron job scheduled
- [ ] Monitoring configured
- [ ] Staff trained
- [ ] Documentation complete
- [ ] Error handling tested
- [ ] Performance validated

**Production deployment:**
- [ ] Deploy to production environment
- [ ] Enable daily cron job
- [ ] Monitor first few days of processing
- [ ] Validate with real Sleep Impressions data
- [ ] Confirm automated claims processing

## 🎯 **SUCCESS CRITERIA**

### **Technical Success:**
- [ ] Files automatically processed daily
- [ ] Data correctly mapped to database
- [ ] Automation steps triggered for "Delivery" visits
- [ ] Error handling works correctly
- [ ] Monitoring provides visibility

### **Business Success:**
- [ ] No manual CSV processing required
- [ ] Automated claims submission working
- [ ] Data consistency improved
- [ ] Processing time reduced
- [ ] Error rate minimized

### **Operational Success:**
- [ ] Staff can monitor processing status
- [ ] Issues can be quickly identified
- [ ] Manual intervention rarely needed
- [ ] System is reliable and stable

## 🚨 **TROUBLESHOOTING**

### **Common Issues:**

1. **SFTP Connection Failed**
   - Check credentials in environment variables
   - Verify network connectivity
   - Test SFTP connection manually

2. **CSV Parsing Errors**
   - Validate file format matches expected schema
   - Check for encoding issues (should be UTF-8)
   - Verify column headers match expected format

3. **Database Insert Errors**
   - Verify table schema matches migration
   - Check RLS policies for service role access
   - Validate data types and constraints

4. **Cron Job Not Running**
   - Verify Vercel cron configuration
   - Check function logs in Vercel dashboard
   - Test manual API endpoint

### **Debug Commands:**
```bash
# Test SFTP connection
sftp etl_si@imports.flowiq.ai

# Test manual ETL trigger
curl -X POST https://your-domain.vercel.app/api/etl/sleepimpressions

# Check Vercel function logs
vercel logs --follow

# Test database connection
supabase db reset
```

## 📞 **SUPPORT CONTACTS**

- **Technical Issues**: [Your Tech Lead]
- **Business Questions**: [Your Product Manager]
- **SFTP Access**: [Your Infrastructure Team]
- **Sleep Impressions Contact**: [Their Technical Contact]

## 🎉 **DEPLOYMENT COMPLETE**

Once all checklist items are completed and validated, the Sleep Impressions ETL pipeline will be fully operational and providing automated data processing for FlowIQ's revenue optimization system.
