# 🔐 FlowIQ Admin Credentials for Pilot Testing

## 🏥 Midwest Dental Sleep Medicine Institute

**Application URL:** https://flowiq-ai-spark-9rvvyhvto-flow-iq.vercel.app/dental-sleep/dashboard

**Admin Credentials:**
- **Email:** admin@midwestdental.com
- **Password:** MidwestAdmin2024!
- **Role:** Practice Admin

**Test Data Available:**
- 2 Providers (Dr. Sarah Johnson, Dr. Michael Chen)
- 2 Patients (John Smith, Sarah Wilson)
- 2 Appointments (Sleep Consultation, Oral Appliance Fitting)

---

## 🦴 West County Spine and Joint

**Application URL:** https://flowiq-ai-spark-9rvvyhvto-flow-iq.vercel.app/chiropractic/dashboard

**Admin Credentials:**
- **Email:** admin@westcountyspine.com
- **Password:** WestCountyAdmin2024!
- **Role:** Practice Admin

**Test Data Available:**
- 2 Providers (Dr. Jennifer Martinez, Dr. Robert Thompson)
- 2 Patients (Mike Johnson, Lisa Brown)
- 2 Appointments (Chiropractic Adjustment, Initial Consultation)

---

## 🧪 Testing Instructions

### 1. **Access the Applications**
1. Open the URLs above in your browser
2. Click "Sign In" or "Login"
3. Enter the admin credentials
4. You should be redirected to the appropriate dashboard

### 2. **Test Core Features**
- **Dashboard:** Verify data displays correctly
- **Patients:** View and manage patient records
- **Appointments:** Schedule and manage appointments
- **Providers:** View provider schedules
- **AI Agents:** Test ScribeIQ, ClaimsIQ, etc.

### 3. **Test Multi-Tenant Isolation**
- Login to Midwest Dental Sleep
- Verify you only see Midwest data
- Login to West County Spine
- Verify you only see West County data
- No cross-tenant data should be visible

### 4. **Test Specialty Features**
**Midwest Dental Sleep:**
- Sleep study management
- DME tracking
- Oral appliance workflows

**West County Spine:**
- Chiropractic adjustments
- Pain tracking
- Spinal health workflows

---

## 🚨 Troubleshooting

### **If Login Fails:**
1. Check the URL is correct
2. Verify credentials are entered exactly
3. Clear browser cache and try again
4. Check browser console for errors

### **If Data Doesn't Load:**
1. Check database connection
2. Verify tenant routing is working
3. Check browser network tab for API errors

### **If Features Don't Work:**
1. Check browser console for JavaScript errors
2. Verify all components are loading
3. Test on different browsers if needed

---

## 📞 Support

**Pilot Support Email:** pilot-support@flow-iq.ai
**Technical Issues:** technical-support@flow-iq.ai
**Emergency:** emergency@flow-iq.ai

---

## 🔄 Database Setup

To create these admin users in your database, run:

```bash
# Execute the SQL script
psql "postgresql://postgres.jnpzabmqieceoqjypvve:your-password@aws-0-us-east-1.pooler.supabase.com:6543/postgres" -f scripts/create-admin-users.sql
```

Or use the setup script:

```bash
chmod +x scripts/setup-admin-users.sh
./scripts/setup-admin-users.sh
```

---

**⚠️ Security Note:** These are test credentials for pilot purposes only. Change passwords for production use. 