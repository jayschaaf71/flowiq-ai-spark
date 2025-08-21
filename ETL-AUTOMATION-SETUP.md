# Sleep Impressions ETL Automation Setup

## 🚀 Automation Options

### Option 1: GitHub Actions (Recommended)
- **Frequency:** Every 6 hours
- **Pros:** No local setup, automatic, version controlled
- **Cons:** Requires GitHub repository

### Option 2: Local Cron Job
- **Frequency:** Customizable (every 6 hours recommended)
- **Pros:** Full control, works offline
- **Cons:** Requires local machine to be running

### Option 3: Vercel Cron Jobs
- **Frequency:** Every 6 hours
- **Pros:** Serverless, automatic scaling
- **Cons:** Requires Vercel deployment

## 📋 Setup Instructions

### GitHub Actions Setup (Already Configured)

1. **Repository Secrets Required:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://jnpzabmqieceoqjypvve.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SFTP_HOST=s-52998ed3b45247b4b.server.transfer.us-east-2.amazonaws.com
   SFTP_USERNAME=flowiq-etl-si
   SFTP_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----...
   ```

2. **Workflow File:** `.github/workflows/etl.yml`
3. **Triggers:** 
   - Every 6 hours (cron: '0 */6 * * *')
   - Manual trigger (workflow_dispatch)
   - On push to main (when ETL files change)

### Local Cron Job Setup

1. **Open Terminal and run:**
   ```bash
   crontab -e
   ```

2. **Add this line for every 6 hours:**
   ```bash
   0 */6 * * * cd /Users/jschaaf/flowiq-ai-spark-1 && ./automate-etl.sh
   ```

3. **Or for every hour:**
   ```bash
   0 * * * * cd /Users/jschaaf/flowiq-ai-spark-1 && ./automate-etl.sh
   ```

4. **Save and exit** (Ctrl+X, Y, Enter)

### Vercel Cron Jobs Setup

1. **Add to vercel.json:**
   ```json
   {
     "crons": [
       {
         "path": "/api/etl/sleepimpressions",
         "schedule": "0 */6 * * *"
       }
     ]
   }
   ```

2. **Create API route:** `api/etl/sleepimpressions.js`

## 🔧 Manual Testing

### Test GitHub Actions
1. Go to GitHub repository
2. Click "Actions" tab
3. Select "Sleep Impressions ETL Pipeline"
4. Click "Run workflow" → "Run workflow"

### Test Local Automation
```bash
# Test the automation script
./automate-etl.sh

# Test with verbose output
bash -x ./automate-etl.sh

# Check logs
ls -la etl-logs/
tail -f etl-logs/etl-$(date +%Y%m%d)*.log
```

### Test ETL Script Directly
```bash
# Set environment variables
export NEXT_PUBLIC_SUPABASE_URL="https://jnpzabmqieceoqjypvve.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Run ETL
node enhanced-etl-processor.js
```

## 📊 Monitoring

### GitHub Actions
- **Logs:** Available in GitHub Actions tab
- **Artifacts:** ETL summary files uploaded as artifacts
- **Notifications:** Success/failure messages in workflow

### Local Cron
- **Logs:** `etl-logs/etl-YYYYMMDD-HHMMSS.log`
- **Auto-cleanup:** Logs older than 30 days are automatically deleted
- **Manual check:** `tail -f etl-logs/etl-$(date +%Y%m%d)*.log`

### Database Verification
```bash
# Check data in database
node verify-data.js

# Expected results:
# ✅ patient_visits: 586+ records
# ✅ billing_log: 297+ records  
# ✅ claims_collections: 300+ records
# ✅ insurance_pat_ref: 597+ records
# ✅ etl_logs: 4+ records
```

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Missing**
   ```bash
   # Check if .env file exists and has content
   ls -la .env
   cat .env
   ```

2. **Node.js Not Found**
   ```bash
   # Check Node.js installation
   node --version
   which node
   ```

3. **Permission Denied**
   ```bash
   # Make script executable
   chmod +x automate-etl.sh
   ```

4. **Database Connection Failed**
   ```bash
   # Test database connection
   node apply-schema.js
   ```

5. **Files Not Found**
   ```bash
   # Check if CSV files exist
   ls -la ~/Downloads/*.csv
   ```

### Log Analysis
```bash
# View latest log
tail -50 etl-logs/etl-$(date +%Y%m%d)*.log

# Search for errors
grep -i error etl-logs/etl-$(date +%Y%m%d)*.log

# Search for success
grep -i "successfully processed" etl-logs/etl-$(date +%Y%m%d)*.log
```

## 📈 Performance Metrics

### Expected Performance
- **Processing Time:** 30-60 seconds for 1,780 records
- **Memory Usage:** ~50-100MB
- **Database Inserts:** ~1,780 records per run
- **File Processing:** 4 CSV files per run

### Monitoring Commands
```bash
# Check processing time
time node enhanced-etl-processor.js

# Monitor memory usage
/usr/bin/time -l node enhanced-etl-processor.js

# Check database performance
node verify-data.js
```

## 🔄 Next Steps

1. **Set up GitHub Actions secrets** (if not already done)
2. **Test automation manually** first
3. **Enable cron job** or GitHub Actions
4. **Monitor first few runs** for any issues
5. **Set up notifications** (optional)
6. **Configure Sleep Impressions** to upload files automatically

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify environment variables
3. Test manually with `node enhanced-etl-processor.js`
4. Check database connectivity with `node apply-schema.js`
