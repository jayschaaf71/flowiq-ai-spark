#!/bin/bash

# 🚀 Production Environment Setup Script
# Sets up environment variables for production deployment

echo "🚀 Setting up production environment variables..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Supabase Configuration
export SUPABASE_URL="https://jnpzabmqieceoqjypvve.supabase.co"
export SUPABASE_PROJECT_REF="jnpzabmqieceoqjypvve"

echo -e "${BLUE}📋 Required Environment Variables:${NC}"
echo ""
echo -e "${YELLOW}⚠️  Please set the following environment variables:${NC}"
echo ""
echo "export VERCEL_TOKEN=your_vercel_token_here"
echo "export SUPABASE_ANON_KEY=your_supabase_anon_key_here"
echo "export VITE_OPENAI_API_KEY=your_openai_api_key_here"
echo "export VITE_TWILIO_ACCOUNT_SID=your_twilio_account_sid_here"
echo "export VITE_TWILIO_AUTH_TOKEN=your_twilio_auth_token_here"
echo "export VITE_VAPI_API_KEY=your_vapi_api_key_here"
echo "export VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here"
echo "export STRIPE_SECRET_KEY=your_stripe_secret_key_here"
echo "export VITE_RESEND_API_KEY=your_resend_api_key_here"
echo ""
echo -e "${BLUE}🔗 Get your Supabase anon key from:${NC}"
echo "https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve/settings/api"
echo ""
echo -e "${BLUE}🔗 Get your Vercel token from:${NC}"
echo "https://vercel.com/account/tokens"
echo ""

# Check if variables are set
check_vars() {
    echo -e "${BLUE}🔍 Checking environment variables...${NC}"
    
    if [ -n "$VERCEL_TOKEN" ]; then
        echo -e "${GREEN}✅ VERCEL_TOKEN is set${NC}"
    else
        echo -e "${RED}❌ VERCEL_TOKEN is not set${NC}"
    fi
    
    if [ -n "$SUPABASE_ANON_KEY" ]; then
        echo -e "${GREEN}✅ SUPABASE_ANON_KEY is set${NC}"
    else
        echo -e "${RED}❌ SUPABASE_ANON_KEY is not set${NC}"
    fi
    
    if [ -n "$VITE_OPENAI_API_KEY" ]; then
        echo -e "${GREEN}✅ VITE_OPENAI_API_KEY is set${NC}"
    else
        echo -e "${YELLOW}⚠️  VITE_OPENAI_API_KEY is not set (optional for basic deployment)${NC}"
    fi
}

# Run check
check_vars

echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Set the environment variables above"
echo "2. Run: ./scripts/deploy-production-v2.sh"
echo "3. Configure custom domains in Vercel dashboard"
echo ""

echo -e "${GREEN}✅ Environment setup script completed${NC}" 