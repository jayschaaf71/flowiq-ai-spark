#!/bin/bash

# FlowIQ Vercel Deployment Setup Script

echo "🚀 Setting up FlowIQ for Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Login to Vercel (if not already logged in)
echo "📝 Ensuring Vercel login..."
vercel whoami || vercel login

# Link project to Vercel
echo "🔗 Linking project to Vercel..."
vercel link

# Set environment variables
echo "⚙️ Setting up environment variables..."
echo "https://jnpzabmqieceoqjypvve.supabase.co" | vercel env add VITE_SUPABASE_URL production
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3MTQ4NzIsImV4cCI6MjA2NDI5MDg3Mn0.RSZZj9ijOESttwNopqROh1pXqi7y4Q4TDW4_6eqcBFU" | vercel env add VITE_SUPABASE_ANON_KEY production
echo "production" | vercel env add VITE_ENVIRONMENT production

# Add custom domains
echo "🌐 Adding custom domains..."
vercel domains add app.flow-iq.ai
vercel domains add midwest-dental-sleep.flow-iq.ai
vercel domains add west-county-spine.flow-iq.ai

# Configure project settings
echo "⚙️ Configuring project settings..."
vercel project add flowiq-ai-spark
vercel alias set https://flowiq-ai-spark.vercel.app app.flow-iq.ai

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your FlowIQ instances are available at:"
echo "   Main App: https://app.flow-iq.ai"
echo "   Midwest Dental: https://midwest-dental-sleep.flow-iq.ai"
echo "   West County Spine: https://west-county-spine.flow-iq.ai"
echo ""
echo "📋 Next steps:"
echo "1. Verify DNS CNAME records point to Vercel"
echo "2. Test multi-tenant routing"
echo "3. Configure SSL certificates"
echo "4. Set up monitoring alerts"