#!/bin/bash

# ChiropracticIQ Deployment Script
# Usage: ./scripts/deploy.sh [environment] [version]

set -e

ENVIRONMENT=${1:-staging}
VERSION=${2:-latest}
DEPLOY_DIR="./dist"
BACKUP_DIR="./backups"

echo "🚀 Starting deployment to $ENVIRONMENT..."
echo "📦 Version: $VERSION"
echo "📅 Date: $(date)"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo "❌ Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# Create backup directory
mkdir -p $BACKUP_DIR

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if build exists
if [ ! -d "$DEPLOY_DIR" ]; then
    echo "❌ Error: Build directory not found. Run 'npm run build' first."
    exit 1
fi

# Check if Supabase is accessible
echo "🔗 Checking Supabase connectivity..."
if ! curl -s -f "https://jnpzabmqieceoqjypvve.supabase.co/rest/v1/" > /dev/null; then
    echo "❌ Error: Cannot connect to Supabase"
    exit 1
fi

# Environment-specific deployment
case $ENVIRONMENT in
    staging)
        echo "🏗️  Deploying to staging environment..."
        
        # Backup current staging if exists
        if [ -d "./staging-current" ]; then
            mv "./staging-current" "$BACKUP_DIR/staging-backup-$(date +%Y%m%d-%H%M%S)"
        fi
        
        # Deploy to staging
        cp -r $DEPLOY_DIR ./staging-current
        
        echo "✅ Staging deployment complete"
        echo "🌐 Staging URL: https://staging.chiropractiq.app"
        ;;
        
    production)
        echo "🏭 Deploying to production environment..."
        
        # Additional production checks
        read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "❌ Deployment cancelled"
            exit 1
        fi
        
        # Backup current production
        if [ -d "./production-current" ]; then
            mv "./production-current" "$BACKUP_DIR/production-backup-$(date +%Y%m%d-%H%M%S)"
        fi
        
        # Deploy to production
        cp -r $DEPLOY_DIR ./production-current
        
        # Health check after deployment
        echo "🏥 Running post-deployment health checks..."
        sleep 5
        
        # Check application health (this would call your health endpoint)
        if curl -s -f "https://app.chiropractiq.com/health" > /dev/null; then
            echo "✅ Production deployment successful"
            echo "🌐 Production URL: https://app.chiropractiq.com"
        else
            echo "❌ Health check failed, rolling back..."
            # Rollback procedure
            if [ -d "$BACKUP_DIR/production-backup-$(date +%Y%m%d)*" ]; then
                mv ./production-current ./production-failed-$(date +%Y%m%d-%H%M%S)
                mv $BACKUP_DIR/production-backup-$(date +%Y%m%d)* ./production-current
                echo "🔄 Rollback complete"
            fi
            exit 1
        fi
        ;;
esac

# Post-deployment tasks
echo "📋 Running post-deployment tasks..."

# Generate deployment report
cat > "deployment-report-$(date +%Y%m%d-%H%M%S).json" << EOF
{
  "environment": "$ENVIRONMENT",
  "version": "$VERSION",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "gitHash": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "deployedBy": "$(whoami)",
  "status": "success"
}
EOF

echo "✅ Deployment complete!"
echo "📊 Deployment report generated"
echo "🎉 ChiropracticIQ $VERSION is now live on $ENVIRONMENT"