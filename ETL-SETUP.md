# Sleep Impressions ETL Pipeline Setup

## 🚀 Quick Start

### 1. Set Up Environment Variables
```bash
./setup-etl-env.sh
```

This will prompt you for:
- Supabase URL (from Vercel environment variables)
- Supabase Service Role Key (from Vercel environment variables)
- SFTP Private Key (from Vercel environment variables)

### 2. Test the Setup
```bash
node test-etl.js
```

### 3. Run ETL Process
```bash
node run-etl.js
```

### 4. Automate with Cron (Optional)
```bash
# Add to crontab to run every 6 hours
0 */6 * * * /path/to/your/project/automate-etl.sh
```

## 📊 What the ETL Does

1. **Connects to SFTP server** (AWS Transfer Family)
2. **Downloads CSV files** from Sleep Impressions
3. **Parses the data** using Papa Parse
4. **Archives processed files** to `/archive` directory
5. **Logs processing** to Supabase `etl_logs` table
6. **Shows data structure** for further processing

## 📁 Files Processed

- `billing_log_*.csv` - Billing and claims data
- `patient_visit_log_*.csv` - Patient visit information
- `insurance_pat_ref_*.csv` - Insurance patient reference data
- `Claims_Report_*.csv` - Claims reports

## 🔧 Manual Setup (Alternative)

If you prefer to set up manually:

1. **Create `.env` file:**
```bash
touch .env
```

2. **Add environment variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SFTP_HOST=s-52998ed3b45247b4b.server.transfer.us-east-2.amazonaws.com
SFTP_USERNAME=flowiq-etl-si
SFTP_PRIVATE_KEY=your_private_key
```

## 📈 Monitoring

- **Logs:** Stored in `etl-logs/` directory
- **Database:** Check `etl_logs` table in Supabase
- **SFTP:** Files moved to `/archive` after processing

## 🛠️ Troubleshooting

### Common Issues:

1. **"Missing SFTP environment variables"**
   - Run `./setup-etl-env.sh` to configure

2. **"Cannot connect to SFTP"**
   - Check SFTP credentials in Vercel
   - Verify AWS Transfer Family server is running

3. **"CSV parsing errors"**
   - Check file format in Sleep Impressions
   - Verify file encoding is UTF-8

## 🔄 Automation Options

### Option 1: Local Cron Job
```bash
# Edit crontab
crontab -e

# Add this line to run every 6 hours
0 */6 * * * /full/path/to/automate-etl.sh
```

### Option 2: GitHub Actions (Recommended)
Create `.github/workflows/etl.yml`:
```yaml
name: ETL Pipeline
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:

jobs:
  etl:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: node run-etl.js
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_KEY }}
          SFTP_HOST: ${{ secrets.SFTP_HOST }}
          SFTP_USERNAME: ${{ secrets.SFTP_USERNAME }}
          SFTP_PRIVATE_KEY: ${{ secrets.SFTP_PRIVATE_KEY }}
```

## 📞 Support

If you encounter issues:
1. Check the logs in `etl-logs/` directory
2. Verify environment variables are set correctly
3. Test SFTP connection manually
4. Check Supabase `etl_logs` table for error details
