# CommunicationIQ DNS Setup Guide

## Current Status
- ✅ Vercel domain added: `communication-iq.flow-iq.ai`
- ❌ DNS record not configured yet
- ✅ Application code deployed and ready

## DNS Configuration Required

### Option 1: Manual DNS Record (Recommended)

Add this CNAME record in your DNS provider (GoDaddy, Namecheap, etc.):

```
Type: CNAME
Name: communication-iq
Value: cname.vercel-dns.com
TTL: 3600
```

### Option 2: Use Existing Pattern

Based on your existing subdomains, you can use the same pattern:

```
Type: CNAME
Name: communication-iq
Value: 8258e9689ef1ae18.vercel-dns-017.com
TTL: 3600
```

### Verification Steps

1. **Add the DNS record** in your domain provider
2. **Wait for propagation** (can take up to 24 hours, usually 15-30 minutes)
3. **Test the subdomain**:
   ```bash
   curl -I https://communication-iq.flow-iq.ai/health
   ```

### Expected Result

After DNS propagation, the subdomain should:
- ✅ Resolve to Vercel's servers
- ✅ Serve the CommunicationIQ application
- ✅ Show the CommunicationIQ branding and features

## Troubleshooting

### If subdomain doesn't resolve:
1. Check DNS propagation: `dig communication-iq.flow-iq.ai CNAME`
2. Verify the CNAME record is correct
3. Wait longer for propagation (up to 24 hours)

### If subdomain resolves but app doesn't load:
1. Check Vercel deployment status
2. Verify the routing configuration in `src/config/unifiedRouting.ts`
3. Check browser console for errors

## Next Steps After DNS Setup

1. **Test the CommunicationIQ application**
2. **Configure CommunicationIQ tenant settings**
3. **Set up CommunicationIQ admin accounts**
4. **Add CommunicationIQ to pilot launch checklist** 