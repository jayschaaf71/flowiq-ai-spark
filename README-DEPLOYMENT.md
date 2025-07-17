# FlowIQ Deployment Guide

## Quick Start Deployment

### Prerequisites
- GitHub account with repository access
- Vercel account
- Domain ownership for flow-iq.ai
- Supabase project configured

### 1. GitHub Setup
```bash
# Connect this repository to GitHub via Lovable
# The repository will auto-sync all changes
```

### 2. Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Run setup script
chmod +x scripts/setup-vercel.sh
./scripts/setup-vercel.sh
```

### 3. DNS Configuration
Add these CNAME records to your flow-iq.ai domain:

```
app.flow-iq.ai                 → cname.vercel-dns.com
midwest-dental-sleep.flow-iq.ai → cname.vercel-dns.com
west-county-spine.flow-iq.ai   → cname.vercel-dns.com
```

### 4. Environment Variables
Set these in Vercel dashboard:

```
VITE_SUPABASE_URL=https://jnpzabmqieceoqjypvve.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_ENVIRONMENT=production
```

## Multi-Tenant Architecture

### URL Structure
- `app.flow-iq.ai` - Main admin dashboard
- `midwest-dental-sleep.flow-iq.ai` - Midwest Dental Sleep Medicine Institute
- `west-county-spine.flow-iq.ai` - West County Spine and Joint

### Tenant Detection
The application automatically detects tenants based on subdomain and routes to appropriate configurations.

## Monitoring & Health Checks

### Health Endpoints
- `/health` - Basic health check
- `/api/health` - Detailed service status

### Monitoring Setup
1. **Uptime Monitoring**: Configure external monitoring for all subdomains
2. **Performance Tracking**: Monitor Core Web Vitals
3. **Error Tracking**: Set up error reporting
4. **Database Monitoring**: Track Supabase performance

## Deployment Pipeline

### Automatic Deployments
- **Main Branch**: Auto-deploys to production
- **Develop Branch**: Auto-deploys to staging
- **Feature Branches**: Creates preview deployments

### Manual Deployment
```bash
# Deploy to production
vercel --prod

# Deploy preview
vercel
```

## Troubleshooting

### Common Issues
1. **Domain not resolving**: Check DNS propagation (24-48 hours)
2. **SSL certificate issues**: Verify domain ownership in Vercel
3. **Environment variables**: Ensure all required vars are set
4. **Tenant routing**: Check subdomain configuration

### Support
- Check deployment logs in Vercel dashboard
- Monitor Supabase logs for database issues
- Use browser dev tools for client-side debugging

## Security Checklist

- ✅ SSL certificates configured
- ✅ Security headers enabled
- ✅ Environment variables secured
- ✅ API rate limiting configured
- ✅ Database RLS policies enabled
- ✅ Authentication properly configured

## Performance Optimization

### CDN Configuration
Vercel automatically handles:
- Static asset optimization
- Image optimization
- Edge caching
- Compression

### Database Optimization
- Connection pooling via Supabase
- Query optimization
- Index management
- Cache strategies

## Scaling Considerations

### Traffic Management
- Vercel handles auto-scaling
- Monitor usage metrics
- Plan for growth

### Database Scaling
- Supabase handles database scaling
- Monitor connection limits
- Optimize queries as needed

## Maintenance

### Regular Tasks
1. **Weekly**: Review error logs and performance metrics
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Performance optimization review
4. **Annually**: Architecture and scaling review