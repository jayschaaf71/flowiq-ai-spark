# 🔐 Manual Admin User Setup Instructions

Since the Supabase CLI connection is having issues, here's how to manually create the admin users:

## Option 1: Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve
   - Navigate to the SQL Editor

2. **Execute the SQL Script:**
   - Copy the contents of `scripts/create-admin-users.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute

3. **Verify the users were created:**
   - Go to Authentication > Users
   - You should see the two new admin users:
     - admin@midwestdental.com
     - admin@westcountyspine.com

## Option 2: Direct Database Connection

If you have PostgreSQL client installed:

```bash
# Install psql if you don't have it
brew install postgresql

# Connect and execute (replace YOUR_PASSWORD with actual password)
psql "postgresql://postgres.jnpzabmqieceoqjypvve:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f scripts/create-admin-users.sql
```

## Option 3: Supabase CLI (Alternative)

Try this command with your actual database password:

```bash
npx supabase db push --password YOUR_ACTUAL_PASSWORD
```

## ✅ After Execution

Once the SQL script runs successfully, you can use these credentials:

### 🏥 Midwest Dental Sleep Medicine Institute
- **URL:** https://flowiq-ai-spark-9rvvyhvto-flow-iq.vercel.app/dental-sleep/dashboard
- **Email:** admin@midwestdental.com
- **Password:** MidwestAdmin2024!

### 🦴 West County Spine and Joint
- **URL:** https://flowiq-ai-spark-9rvvyhvto-flow-iq.vercel.app/chiropractic/dashboard
- **Email:** admin@westcountyspine.com
- **Password:** WestCountyAdmin2024!

## 🧪 Test Data Created

The script also creates:
- 2 providers per practice
- 2 patients per practice  
- 2 appointments per practice
- Provider schedules (Monday-Friday, 8AM-5PM)

## 🚨 Troubleshooting

If you get errors:
1. Check that the tenant IDs exist in your database
2. Verify the database schema matches the script
3. Make sure you have proper permissions

**Need help?** Contact: technical-support@flow-iq.ai 