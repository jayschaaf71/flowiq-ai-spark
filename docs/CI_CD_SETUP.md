# 🚀 FlowIQ CI/CD Pipeline Setup Guide

## **Overview**

This guide covers the complete CI/CD pipeline implementation for the FlowIQ application, including production deployment, security scanning, and database migrations.

## **📋 Prerequisites**

### **1. GitHub Repository Setup**
- Repository must be connected to GitHub
- Branch protection rules enabled for `main` and `develop`
- Required status checks configured

### **2. Required GitHub Secrets**

Set up the following secrets in your GitHub repository (`Settings > Secrets and variables > Actions`):

#### **✅ Already Configured (You Have These)**
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_URL=your_supabase_url
```

#### **➕ Additional Secrets Needed**
```
SUPABASE_PROJECT_REF=jnpzabmqieceoqjypvve
SUPABASE_DB_URL=your_supabase_database_url
```

**To get the missing secrets:**

1. **SUPABASE_PROJECT_REF**: You already have this value (`jnpzabmqieceoqjypvve`)
2. **SUPABASE_DB_URL**: Get this from your Supabase dashboard:
   - Go to your Supabase project dashboard
   - Navigate to Settings > Database
   - Copy the "Connection string" (postgresql://...)

## **🔧 Workflow Files**

### **1. Production CI/CD Pipeline** (`.github/workflows/production-deploy.yml`)

**Features:**
- ✅ Security and quality checks
- ✅ Multi-node testing (Node 16, 18, 20)
- ✅ Database migration validation
- ✅ Staging and production deployments
- ✅ Health checks and monitoring
- ✅ Manual deployment triggers

**Triggers:**
- Push to `main` branch
- Pull requests to `main`
- Manual workflow dispatch

### **2. Database Migrations** (`.github/workflows/database-migrations.yml`)

**Features:**
- ✅ Migration file validation
- ✅ SQL syntax checking
- ✅ RLS policy verification
- ✅ Staging migration testing
- ✅ Production migration deployment
- ✅ Rollback planning

**Triggers:**
- Changes to `supabase/migrations/**`
- Manual workflow dispatch

### **3. Security Scanning** (`.github/workflows/security-scan.yml`)

**Features:**
- ✅ Dependency vulnerability scanning
- ✅ Code security analysis (Semgrep)
- ✅ Secrets detection (TruffleHog)
- ✅ Environment variable security
- ✅ Supabase security checks
- ✅ Weekly automated scans

**Triggers:**
- Push to `main` or `develop`
- Pull requests
- Weekly scheduled scans
- Manual workflow dispatch

## **🚀 Setup Instructions**

### **Step 1: Add Missing GitHub Secrets**

1. Go to your GitHub repository
2. Navigate to `Settings > Secrets and variables > Actions`
3. Add the missing secrets:

**SUPABASE_PROJECT_REF**
```
Name: SUPABASE_PROJECT_REF
Value: jnpzabmqieceoqjypvve
```

**SUPABASE_DB_URL**
```
Name: SUPABASE_DB_URL
Value: postgresql://postgres:[YOUR-PASSWORD]@db.jnpzabmqieceoqjypvve.supabase.co:5432/postgres
```

### **Step 2: Set Up Branch Protection**

1. Go to `Settings > Branches`
2. Add rule for `main` branch:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

3. Add rule for `develop` branch:
   - ✅ Require status checks to pass before merging

### **Step 3: Configure Environments**

1. Go to `Settings > Environments`
2. Create `staging` environment:
   - Add protection rules if needed
   - Configure environment secrets

3. Create `production` environment:
   - ✅ Required reviewers
   - ✅ Wait timer (5 minutes)
   - ✅ Deployment branches (main only)

### **Step 4: Test the Pipeline**

1. Create a test branch from `develop`
2. Make a small change and push
3. Create a pull request to `develop`
4. Verify all checks pass
5. Merge to `develop` to trigger staging deployment
6. Create pull request from `develop` to `main`
7. Verify production deployment

## **📊 Pipeline Stages**

### **Development Workflow**
```
Feature Branch → Pull Request → Code Review → Merge to develop → Staging Deployment
```

### **Production Workflow**
```
develop → Pull Request → Code Review → Merge to main → Production Deployment
```

### **Security Workflow**
```
Code Changes → Security Scan → Vulnerability Check → Approval → Deployment
```

## **🔍 Monitoring and Alerts**

### **Deployment Monitoring**
- Health checks on all endpoints
- Smoke tests after deployment
- Performance monitoring
- Error tracking

### **Security Monitoring**
- Weekly vulnerability scans
- Real-time security alerts
- Compliance reporting
- Audit logging

## **🛠️ Manual Operations**

### **Manual Deployment**
1. Go to `Actions` tab
2. Select `Production CI/CD Pipeline`
3. Click `Run workflow`
4. Choose environment (staging/production)
5. Click `Run workflow`

### **Database Rollback**
1. Go to `Actions` tab
2. Select `Database Migrations`
3. Click `Run workflow`
4. Choose `rollback-migrations` job
5. Review rollback plan
6. Execute rollback

### **Security Scan**
1. Go to `Actions` tab
2. Select `Security Scanning`
3. Click `Run workflow`
4. Review results in artifacts

## **📈 Best Practices**

### **Code Quality**
- ✅ All tests must pass
- ✅ No security vulnerabilities
- ✅ Code review required
- ✅ TypeScript strict mode
- ✅ ESLint rules enforced

### **Security**
- ✅ No hardcoded secrets
- ✅ Environment variables for sensitive data
- ✅ RLS policies on all tables
- ✅ Regular security scans
- ✅ Dependency updates

### **Deployment**
- ✅ Staging deployment first
- ✅ Health checks after deployment
- ✅ Rollback capability
- ✅ Monitoring and alerting

## **🚨 Troubleshooting**

### **Common Issues**

**Pipeline Fails on Security Scan**
- Check for hardcoded secrets in code
- Update vulnerable dependencies
- Review Semgrep results

**Database Migration Fails**
- Verify SQL syntax in migration files
- Check RLS policies
- Ensure proper naming conventions

**Deployment Fails**
- Check environment variables
- Verify Vercel configuration
- Review health check endpoints

### **Getting Help**

1. Check the Actions tab for detailed logs
2. Review security scan artifacts
3. Verify GitHub secrets are correct
4. Test locally before pushing

---

**Last Updated**: $(date)
**Version**: 1.0.0
**Status**: Ready for Implementation 