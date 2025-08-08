#!/bin/bash

# 🧪 EHR Integration Test Script
# Tests EasyBIS and Dental REM integrations

echo "🧪 Testing EHR Integrations..."
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test EasyBIS Integration
test_easybis() {
    echo -e "${BLUE}🔍 Testing EasyBIS Integration...${NC}"
    
    # Check if EasyBIS config exists
    if [ -z "$EASYBIS_API_ENDPOINT" ] || [ -z "$EASYBIS_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  EasyBIS API credentials not configured${NC}"
        echo -e "${BLUE}   Please set:${NC}"
        echo -e "${BLUE}   export EASYBIS_API_ENDPOINT=your_easybis_api_endpoint${NC}"
        echo -e "${BLUE}   export EASYBIS_API_KEY=your_easybis_api_key${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ EasyBIS API credentials configured${NC}"
    return 0
}

# Test Dental REM Integration
test_dental_rem() {
    echo -e "${BLUE}🔍 Testing Dental REM Integration...${NC}"
    
    # Check if Dental REM config exists
    if [ -z "$DENTAL_REM_API_ENDPOINT" ] || [ -z "$DENTAL_REM_API_KEY" ]; then
        echo -e "${YELLOW}⚠️  Dental REM API credentials not configured${NC}"
        echo -e "${BLUE}   Please set:${NC}"
        echo -e "${BLUE}   export DENTAL_REM_API_ENDPOINT=your_dental_rem_api_endpoint${NC}"
        echo -e "${BLUE}   export DENTAL_REM_API_KEY=your_dental_rem_api_key${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ Dental REM API credentials configured${NC}"
    return 0
}

# Test TypeScript compilation
test_typescript() {
    echo -e "${BLUE}🔍 Testing TypeScript compilation...${NC}"
    
    # Run TypeScript check
    npx tsc --noEmit --skipLibCheck
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ TypeScript compilation successful${NC}"
        return 0
    else
        echo -e "${RED}❌ TypeScript compilation failed${NC}"
        return 1
    fi
}

# Test build
test_build() {
    echo -e "${BLUE}🔍 Testing build process...${NC}"
    
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

# Main test function
main() {
    echo -e "${BLUE}🚀 Starting EHR Integration Tests${NC}"
    echo ""
    
    local all_tests_passed=true
    
    # Test TypeScript compilation
    if ! test_typescript; then
        all_tests_passed=false
    fi
    
    # Test build
    if ! test_build; then
        all_tests_passed=false
    fi
    
    # Test EasyBIS integration
    if ! test_easybis; then
        all_tests_passed=false
    fi
    
    # Test Dental REM integration
    if ! test_dental_rem; then
        all_tests_passed=false
    fi
    
    echo ""
    echo -e "${BLUE}📊 Test Results Summary:${NC}"
    
    if [ "$all_tests_passed" = true ]; then
        echo -e "${GREEN}✅ All tests passed!${NC}"
        echo ""
        echo -e "${BLUE}📋 Next Steps:${NC}"
        echo "1. Configure EHR API credentials"
        echo "2. Test actual API connections"
        echo "3. Sync patient and appointment data"
        echo "4. Validate data mapping"
        echo "5. Deploy to production"
    else
        echo -e "${RED}❌ Some tests failed${NC}"
        echo ""
        echo -e "${BLUE}📋 Please fix the issues above before proceeding${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}🔗 Useful Links:${NC}"
    echo "- EasyBIS API Documentation: https://easybis.com/api"
    echo "- Dental REM API Documentation: https://dentalrem.com/api"
    echo "- Supabase Dashboard: https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve"
    echo ""
}

# Run main function
main "$@" 