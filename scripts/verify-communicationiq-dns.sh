#!/bin/bash

# CommunicationIQ DNS Verification Script

echo "🔍 Checking CommunicationIQ DNS setup..."

# Check if subdomain resolves
echo "📡 Testing DNS resolution..."
if nslookup communication-iq.flow-iq.ai > /dev/null 2>&1; then
    echo "✅ DNS resolution working"
else
    echo "❌ DNS resolution failed - subdomain may not be configured yet"
fi

# Check CNAME record
echo "🔗 Checking CNAME record..."
CNAME_RESULT=$(dig communication-iq.flow-iq.ai CNAME +short 2>/dev/null)
if [ -n "$CNAME_RESULT" ]; then
    echo "✅ CNAME record found: $CNAME_RESULT"
else
    echo "❌ CNAME record not found"
fi

# Test HTTPS connection
echo "🌐 Testing HTTPS connection..."
if curl -s -I https://communication-iq.flow-iq.ai/health > /dev/null 2>&1; then
    echo "✅ HTTPS connection working"
    echo "🎉 CommunicationIQ subdomain is ready!"
else
    echo "❌ HTTPS connection failed"
    echo "💡 This is normal if DNS hasn't propagated yet"
fi

echo ""
echo "📋 Next steps:"
echo "1. Add CNAME record in your DNS provider"
echo "2. Wait for DNS propagation (15-30 minutes)"
echo "3. Run this script again to verify"
echo ""
echo "📖 See scripts/setup-communicationiq-dns.md for detailed instructions" 