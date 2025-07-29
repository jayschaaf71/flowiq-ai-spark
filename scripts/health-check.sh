#!/bin/bash

# FlowIQ Health Check Script
# Usage: ./scripts/health-check.sh [environment]

set -e

ENVIRONMENT=${1:-production}
BASE_URL=""

case $ENVIRONMENT in
    production)
        BASE_URL="https://flowiq-ai-spark-diug6m0uf-flow-iq.vercel.app"
        ;;
    staging)
        BASE_URL="https://staging.flow-iq.ai"
        ;;
    *)
        echo "❌ Error: Environment must be 'production' or 'staging'"
        exit 1
        ;;
esac

echo "🏥 Running health checks for $ENVIRONMENT environment..."
echo "🔗 Base URL: $BASE_URL"

# Function to check endpoint
check_endpoint() {
    local endpoint=$1
    local name=$2
    local expected_status=${3:-200}
    
    echo "🔍 Checking $name..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$endpoint" || echo "000")
    
    if [ "$response" = "$expected_status" ]; then
        echo "✅ $name: OK ($response)"
        return 0
    else
        echo "❌ $name: FAILED ($response)"
        return 1
    fi
}

# Function to check tenant routing
check_tenant() {
    local tenant=$1
    local name=$2
    
    echo "🔍 Checking tenant routing for $name..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "https://$tenant.flow-iq.ai" || echo "000")
    
    if [ "$response" = "200" ]; then
        echo "✅ $name tenant routing: OK ($response)"
        return 0
    else
        echo "❌ $name tenant routing: FAILED ($response)"
        return 1
    fi
}

# Function to check if app loads (even with auth redirect)
check_app_load() {
    local url=$1
    local name=$2
    
    echo "🔍 Checking $name..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$url" || echo "000")
    
    # Accept 200 (OK), 401 (Unauthorized - expected for auth), 302 (Redirect)
    if [ "$response" = "200" ] || [ "$response" = "401" ] || [ "$response" = "302" ]; then
        echo "✅ $name: OK ($response)"
        return 0
    else
        echo "❌ $name: FAILED ($response)"
        return 1
    fi
}

# Initialize counters
total_checks=0
passed_checks=0
failed_checks=0

# Basic health checks
echo ""
echo "📋 Running basic health checks..."

check_app_load "$BASE_URL/health" "Health Check" && ((passed_checks++)) || ((failed_checks++))
((total_checks++))

check_app_load "$BASE_URL/" "Main App" && ((passed_checks++)) || ((failed_checks++))
((total_checks++))

# Tenant routing checks
echo ""
echo "🏢 Running tenant routing checks..."

check_tenant "midwest-dental-sleep" "Midwest Dental Sleep" && ((passed_checks++)) || ((failed_checks++))
((total_checks++))

check_tenant "west-county-spine" "West County Spine" && ((passed_checks++)) || ((failed_checks++))
((total_checks++))

# Performance checks
echo ""
echo "⚡ Running performance checks..."

# Check page load time
start_time=$(date +%s.%N)
curl -s "$BASE_URL" > /dev/null
end_time=$(date +%s.%N)
load_time=$(echo "$end_time - $start_time" | bc)

if (( $(echo "$load_time < 3.0" | bc -l) )); then
    echo "✅ Page load time: OK (${load_time}s)"
    ((passed_checks++))
else
    echo "❌ Page load time: SLOW (${load_time}s)"
    ((failed_checks++))
fi
((total_checks++))

# Database connectivity check
echo ""
echo "🗄️ Running database connectivity checks..."

# Check if Supabase is accessible (this should work)
if curl -s -f "https://jnpzabmqieceoqjypvve.supabase.co/rest/v1/" > /dev/null 2>&1; then
    echo "✅ Supabase connectivity: OK"
    ((passed_checks++))
else
    echo "❌ Supabase connectivity: FAILED"
    ((failed_checks++))
fi
((total_checks++))

# Summary
echo ""
echo "📊 Health Check Summary"
echo "========================"
echo "Total checks: $total_checks"
echo "Passed: $passed_checks"
echo "Failed: $failed_checks"
echo "Success rate: $(( (passed_checks * 100) / total_checks ))%"

if [ $failed_checks -eq 0 ]; then
    echo ""
    echo "🎉 All health checks passed!"
    exit 0
else
    echo ""
    echo "⚠️ Some health checks failed. Please investigate."
    exit 1
fi 