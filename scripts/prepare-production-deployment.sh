#!/bin/bash

# 🚀 Production Deployment Preparation Script
# Guides through the deployment preparation process

echo "🚀 Preparing for Production Deployment"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check current status
check_status() {
    echo -e "${BLUE}🔍 Checking current deployment status...${NC}"
    
    # Check if Vercel CLI is installed
    if command -v vercel &> /dev/null; then
        echo -e "${GREEN}✅ Vercel CLI is installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
        echo -e "${BLUE}   Installing Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    # Check if Supabase CLI is installed
    if command -v supabase &> /dev/null; then
        echo -e "${GREEN}✅ Supabase CLI is installed${NC}"
    else
        echo -e "${YELLOW}⚠️  Supabase CLI not found${NC}"
        echo -e "${BLUE}   Installing Supabase CLI...${NC}"
        npm install -g supabase
    fi
    
    # Check environment variables
    echo -e "${BLUE}🔍 Checking environment variables...${NC}"
    
    if [ -n "$VERCEL_TOKEN" ]; then
        echo -e "${GREEN}✅ VERCEL_TOKEN is set${NC}"
    else
        echo -e "${RED}❌ VERCEL_TOKEN is not set${NC}"
        echo -e "${BLUE}   Get your Vercel token from: https://vercel.com/account/tokens${NC}"
    fi
    
    if [ -n "$SUPABASE_ANON_KEY" ]; then
        echo -e "${GREEN}✅ SUPABASE_ANON_KEY is set${NC}"
    else
        echo -e "${RED}❌ SUPABASE_ANON_KEY is not set${NC}"
        echo -e "${BLUE}   Get your Supabase anon key from: https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve/settings/api${NC}"
    fi
}

# Guide through deployment preparation
prepare_deployment() {
    echo -e "${BLUE}📋 Deployment Preparation Guide${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Before deploying to production, you need to:${NC}"
    echo ""
    echo "1. Get your Vercel token:"
    echo "   - Go to https://vercel.com/account/tokens"
    echo "   - Create a new token"
    echo "   - Set: export VERCEL_TOKEN=your_token_here"
    echo ""
    echo "2. Get your Supabase anon key:"
    echo "   - Go to https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve/settings/api"
    echo "   - Copy the anon public key"
    echo "   - Set: export SUPABASE_ANON_KEY=your_key_here"
    echo ""
    echo "3. Configure custom domains in Vercel:"
    echo "   - midwest-dental-sleep.flow-iq.ai"
    echo "   - west-county-spine.flow-iq.ai"
    echo "   - flow-iq.ai (marketing site)"
    echo ""
    echo "4. Set up monitoring and alerts"
    echo ""
    echo "5. Test the deployment"
    echo ""
}

# Test build process
test_build() {
    echo -e "${BLUE}🔨 Testing build process...${NC}"
    
    # Clean previous build
    rm -rf dist/
    
    # Run build
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Build successful${NC}"
        return 0
    else
        echo -e "${RED}❌ Build failed${NC}"
        return 1
    fi
}

# Test TypeScript compilation
test_typescript() {
    echo -e "${BLUE}🔍 Testing TypeScript compilation...${NC}"
    
    npx tsc --noEmit --skipLibCheck
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
        return 0
    else
        echo -e "${RED}❌ TypeScript compilation failed${NC}"
        return 1
    fi
}

# Main function
main() {
    echo -e "${BLUE}🚀 Production Deployment Preparation${NC}"
    echo "=========================================="
    
    # Check current status
    check_status
    
    # Test build and TypeScript
    echo ""
    echo -e "${BLUE}🧪 Running pre-deployment tests...${NC}"
    
    local tests_passed=true
    
    if ! test_typescript; then
        tests_passed=false
    fi
    
    if ! test_build; then
        tests_passed=false
    fi
    
    echo ""
    
    if [ "$tests_passed" = true ]; then
        echo -e "${GREEN}✅ All pre-deployment tests passed!${NC}"
        echo ""
        echo -e "${BLUE}📋 Next Steps:${NC}"
        echo "1. Set environment variables (see guide below)"
        echo "2. Run: ./scripts/deploy-production-v2.sh"
        echo "3. Configure custom domains in Vercel"
        echo "4. Test production deployment"
        echo "5. Begin EHR integration with API credentials"
        echo ""
        
        # Show preparation guide
        prepare_deployment
        
        echo ""
        echo -e "${GREEN}🎉 Ready for production deployment!${NC}"
    else
        echo -e "${RED}❌ Some tests failed${NC}"
        echo ""
        echo -e "${BLUE}📋 Please fix the issues above before proceeding${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🔗 Useful Links:${NC}"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- Supabase Dashboard: https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve"
    echo "- FlowIQ Marketing: https://flow-iq.ai"
    echo ""
}

# Run main function
main "$@" 