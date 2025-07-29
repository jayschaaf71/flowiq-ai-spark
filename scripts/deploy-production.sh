#!/bin/bash

# FlowIQ Production Deployment Script for Pilot Launch
echo "🚀 Deploying FlowIQ to Production for Pilot Launch..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build the application
echo "📦 Building application..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

# Set up custom domains
echo "🌐 Setting up custom domains..."
vercel domains add midwest-dental-sleep.flow-iq.ai
vercel domains add west-county-spine.flow-iq.ai

echo "✅ Production deployment complete!"
echo ""
echo "🔗 Your pilot instances are available at:"
echo "   Midwest Dental Sleep: https://midwest-dental-sleep.flow-iq.ai"
echo "   West County Spine: https://west-county-spine.flow-iq.ai"
echo ""
echo "📋 Next steps:"
echo "1. Configure DNS CNAME records"
echo "2. Set up SSL certificates"
echo "3. Test multi-tenant routing"
echo "4. Begin pilot testing" 