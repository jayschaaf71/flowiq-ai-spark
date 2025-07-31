#!/bin/bash

# FlowIQ Connect Subdomain Setup Script
# This script sets up the connect.flow-iq.ai subdomain for FlowIQ Connect

set -e

echo "🚀 Setting up FlowIQ Connect subdomain..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required environment variables are set
check_env_vars() {
    print_status "Checking environment variables..."
    
    if [ -z "$VERCEL_TOKEN" ]; then
        print_error "VERCEL_TOKEN environment variable is not set"
        print_warning "Please set VERCEL_TOKEN before running this script"
        exit 1
    fi
    
    if [ -z "$SUPABASE_URL" ]; then
        print_error "SUPABASE_URL environment variable is not set"
        print_warning "Please set SUPABASE_URL before running this script"
        exit 1
    fi
    
    if [ -z "$SUPABASE_ANON_KEY" ]; then
        print_error "SUPABASE_ANON_KEY environment variable is not set"
        print_warning "Please set SUPABASE_ANON_KEY before running this script"
        exit 1
    fi
    
    print_success "Environment variables are set"
}

# Deploy to Vercel with connect subdomain
deploy_to_vercel() {
    print_status "Deploying FlowIQ Connect to Vercel..."
    
    # Build the application
    print_status "Building application..."
    npm run build
    
    if [ $? -ne 0 ]; then
        print_error "Build failed"
        exit 1
    fi
    
    print_success "Build completed successfully"
    
    # Deploy to Vercel
    print_status "Deploying to Vercel..."
    
    # Use Vercel CLI to deploy
    npx vercel --prod --token $VERCEL_TOKEN
    
    if [ $? -ne 0 ]; then
        print_error "Vercel deployment failed"
        exit 1
    fi
    
    print_success "Deployment to Vercel completed"
}

# Configure custom domain
configure_domain() {
    print_status "Configuring connect.flow-iq.ai domain..."
    
    # Add custom domain to Vercel project
    npx vercel domains add connect.flow-iq.ai --token $VERCEL_TOKEN
    
    if [ $? -eq 0 ]; then
        print_success "Domain connect.flow-iq.ai added to Vercel"
    else
        print_warning "Domain may already be configured or there was an issue"
    fi
    
    # Configure DNS records
    print_status "Configuring DNS records..."
    print_warning "You may need to manually configure DNS records with your domain provider"
    print_status "Add the following CNAME record:"
    echo "  Name: connect"
    echo "  Value: cname.vercel-dns.com"
    echo "  TTL: 3600"
}

# Set up environment variables in Vercel
setup_vercel_env() {
    print_status "Setting up Vercel environment variables..."
    
    # Set environment variables for FlowIQ Connect
    npx vercel env add VITE_SUPABASE_URL production $SUPABASE_URL --token $VERCEL_TOKEN
    npx vercel env add VITE_SUPABASE_ANON_KEY production $SUPABASE_ANON_KEY --token $VERCEL_TOKEN
    npx vercel env add VITE_ENVIRONMENT production "production" --token $VERCEL_TOKEN
    npx vercel env add VITE_APP_TYPE production "connect" --token $VERCEL_TOKEN
    
    print_success "Environment variables configured"
}

# Test the deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Wait a moment for deployment to propagate
    sleep 10
    
    # Test the health endpoint
    response=$(curl -s -o /dev/null -w "%{http_code}" https://connect.flow-iq.ai/health)
    
    if [ "$response" = "200" ]; then
        print_success "Deployment test passed (HTTP $response)"
    else
        print_warning "Deployment test returned HTTP $response"
        print_status "The site may still be deploying or there may be an issue"
    fi
}

# Create onboarding redirect
setup_onboarding_redirect() {
    print_status "Setting up onboarding redirect..."
    
    # Create a simple redirect page for the main connect domain
    cat > public/connect-redirect.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FlowIQ Connect - Redirecting to Onboarding</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: rgba(255,255,255,0.2);
            border-radius: 20px;
            margin: 0 auto 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
        }
        h1 {
            margin-bottom: 1rem;
            font-size: 2.5rem;
        }
        p {
            margin-bottom: 2rem;
            opacity: 0.9;
            font-size: 1.1rem;
        }
        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 2rem;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">⚡</div>
        <h1>FlowIQ Connect</h1>
        <p>Setting up your service business communication platform...</p>
        <div class="spinner"></div>
        <p>Redirecting to onboarding...</p>
    </div>
    <script>
        setTimeout(() => {
            window.location.href = '/onboarding';
        }, 2000);
    </script>
</body>
</html>
EOF
    
    print_success "Onboarding redirect page created"
}

# Main execution
main() {
    echo "🎯 FlowIQ Connect Subdomain Setup"
    echo "=================================="
    echo ""
    
    check_env_vars
    deploy_to_vercel
    configure_domain
    setup_vercel_env
    setup_onboarding_redirect
    test_deployment
    
    echo ""
    echo "🎉 FlowIQ Connect subdomain setup complete!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Configure DNS records with your domain provider"
    echo "2. Test the onboarding flow at https://connect.flow-iq.ai/onboarding"
    echo "3. Set up Stripe integration for payments"
    echo "4. Configure email templates for service businesses"
    echo ""
    echo "🔗 URLs:"
    echo "- Main site: https://connect.flow-iq.ai"
    echo "- Onboarding: https://connect.flow-iq.ai/onboarding"
    echo "- Dashboard: https://connect.flow-iq.ai/dashboard"
    echo ""
}

# Run main function
main "$@" 