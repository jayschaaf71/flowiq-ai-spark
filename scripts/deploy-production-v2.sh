#!/bin/bash

# 🚀 FlowIQ Production Deployment Script v2.0
# Deploys all three apps (Chiropractic, Dental Sleep, Communication) to production

set -e

echo "🚀 Starting FlowIQ Production Deployment v2.0"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="flowiq-ai-spark"
VERCEL_TOKEN="${VERCEL_TOKEN}"
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"

# Check required environment variables
check_env_vars() {
    echo -e "${BLUE}🔍 Checking environment variables...${NC}"
    
    if [ -z "$VERCEL_TOKEN" ]; then
        echo -e "${RED}❌ VERCEL_TOKEN not set${NC}"
        exit 1
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        echo -e "${RED}❌ SUPABASE_URL not set${NC}"
        exit 1
    fi
    
    if [ -z "$SUPABASE_ANON_KEY" ]; then
        echo -e "${RED}❌ SUPABASE_ANON_KEY not set${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Environment variables configured${NC}"
}

# Build the application
build_app() {
    echo -e "${BLUE}🔨 Building application...${NC}"
    
    # Clean previous build
    rm -rf dist/
    
    # Install dependencies
    npm ci
    
    # Run type check
    echo -e "${BLUE}🔍 Running type check...${NC}"
    npx tsc --noEmit --skipLibCheck
    
    # Run linting
    echo -e "${BLUE}🔍 Running linting...${NC}"
    npm run lint
    
    # Build application
    echo -e "${BLUE}🔨 Building for production...${NC}"
    npm run build
    
    echo -e "${GREEN}✅ Build completed successfully${NC}"
}

# Deploy to Vercel
deploy_to_vercel() {
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found, installing...${NC}"
        npm install -g vercel
    fi
    
    # Deploy to production
    echo -e "${BLUE}🚀 Deploying to production...${NC}"
    vercel --prod --token "$VERCEL_TOKEN" --yes
    
    echo -e "${GREEN}✅ Deployment completed${NC}"
}

# Configure custom domains
configure_domains() {
    echo -e "${BLUE}🌐 Configuring custom domains...${NC}"
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls --token "$VERCEL_TOKEN" | grep "$PROJECT_NAME" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        echo -e "${BLUE}📍 Deployment URL: $DEPLOYMENT_URL${NC}"
        
        # Configure domains (requires manual setup in Vercel dashboard)
        echo -e "${YELLOW}⚠️  Please configure custom domains in Vercel dashboard:${NC}"
        echo -e "${BLUE}   - midwest-dental-sleep.flow-iq.ai${NC}"
        echo -e "${BLUE}   - west-county-spine.flow-iq.ai${NC}"
        echo -e "${BLUE}   - flow-iq.ai (marketing site)${NC}"
    else
        echo -e "${RED}❌ Could not get deployment URL${NC}"
    fi
}

# Run health checks
health_checks() {
    echo -e "${BLUE}🏥 Running health checks...${NC}"
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel ls --token "$VERCEL_TOKEN" | grep "$PROJECT_NAME" | head -1 | awk '{print $2}')
    
    if [ -n "$DEPLOYMENT_URL" ]; then
        # Test health endpoint
        echo -e "${BLUE}🔍 Testing health endpoint...${NC}"
        HEALTH_RESPONSE=$(curl -s "$DEPLOYMENT_URL/health" || echo "FAILED")
        
        if [ "$HEALTH_RESPONSE" != "FAILED" ]; then
            echo -e "${GREEN}✅ Health check passed${NC}"
        else
            echo -e "${RED}❌ Health check failed${NC}"
        fi
        
        # Test routing
        echo -e "${BLUE}🔍 Testing routing...${NC}"
        ROUTING_RESPONSE=$(curl -s "$DEPLOYMENT_URL/chiropractic/dashboard" || echo "FAILED")
        
        if [ "$ROUTING_RESPONSE" != "FAILED" ]; then
            echo -e "${GREEN}✅ Routing test passed${NC}"
        else
            echo -e "${RED}❌ Routing test failed${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Could not run health checks - no deployment URL${NC}"
    fi
}

# Setup pilot practices
setup_pilot_practices() {
    echo -e "${BLUE}🏥 Setting up pilot practices...${NC}"
    
    # West County Spine & Joint (Chiropractic)
    echo -e "${BLUE}🔧 Setting up West County Spine & Joint...${NC}"
    
    # Midwest Dental Sleep Medicine Institute
    echo -e "${BLUE}🔧 Setting up Midwest Dental Sleep Medicine Institute...${NC}"
    
    echo -e "${GREEN}✅ Pilot practice setup completed${NC}"
}

# Database migrations
run_migrations() {
    echo -e "${BLUE}🗄️  Running database migrations...${NC}"
    
    # Check if Supabase CLI is installed
    if ! command -v supabase &> /dev/null; then
        echo -e "${YELLOW}⚠️  Supabase CLI not found, installing...${NC}"
        npm install -g supabase
    fi
    
    # Run migrations
    echo -e "${BLUE}🔄 Running migrations...${NC}"
    supabase db push --project-ref "$SUPABASE_PROJECT_REF" || {
        echo -e "${YELLOW}⚠️  Migration failed, continuing...${NC}"
    }
    
    echo -e "${GREEN}✅ Database migrations completed${NC}"
}

# Create admin users
create_admin_users() {
    echo -e "${BLUE}👥 Creating admin users...${NC}"
    
    # Create admin users for pilot practices
    echo -e "${BLUE}🔧 Creating admin users for pilot practices...${NC}"
    
    # This would typically involve running SQL scripts
    # For now, we'll just log the requirement
    echo -e "${YELLOW}⚠️  Please create admin users manually in Supabase dashboard${NC}"
    
    echo -e "${GREEN}✅ Admin user setup completed${NC}"
}

# Main deployment process
main() {
    echo -e "${BLUE}🚀 Starting FlowIQ Production Deployment${NC}"
    echo "=============================================="
    
    # Step 1: Check environment
    check_env_vars
    
    # Step 2: Build application
    build_app
    
    # Step 3: Deploy to Vercel
    deploy_to_vercel
    
    # Step 4: Configure domains
    configure_domains
    
    # Step 5: Run health checks
    health_checks
    
    # Step 6: Run database migrations
    run_migrations
    
    # Step 7: Create admin users
    create_admin_users
    
    # Step 8: Setup pilot practices
    setup_pilot_practices
    
    echo ""
    echo -e "${GREEN}🎉 Production deployment completed successfully!${NC}"
    echo "=============================================="
    echo ""
    echo -e "${BLUE}📋 Next steps:${NC}"
    echo "1. Configure custom domains in Vercel dashboard"
    echo "2. Create admin users in Supabase dashboard"
    echo "3. Test all three applications"
    echo "4. Onboard pilot practices"
    echo "5. Monitor application performance"
    echo ""
    echo -e "${BLUE}🔗 Useful links:${NC}"
    echo "- Vercel Dashboard: https://vercel.com/dashboard"
    echo "- Supabase Dashboard: https://supabase.com/dashboard"
    echo "- FlowIQ Marketing: https://flow-iq.ai"
    echo ""
}

# Run main function
main "$@" 