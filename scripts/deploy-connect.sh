#!/bin/bash

# Simplified FlowIQ Connect Deployment Script
# This script deploys the current build to Vercel

set -e

echo "🚀 Deploying FlowIQ Connect..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Build the application
print_status "Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

print_success "Build completed successfully"

# Deploy to Vercel using Vercel CLI
print_status "Deploying to Vercel..."
npx vercel --prod

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed"
    exit 1
fi

print_success "Deployment completed successfully"

echo ""
echo "🎉 FlowIQ Connect deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure custom domain in Vercel dashboard"
echo "2. Set up DNS records for connect.flow-iq.ai"
echo "3. Test the onboarding flow"
echo ""
echo "🔗 URLs:"
echo "- Main site: https://flowiq-ai-spark.vercel.app"
echo "- Onboarding: https://flowiq-ai-spark.vercel.app/onboarding"
echo "" 