#!/bin/bash

# ChiropracticIQ Rollback Script
# Usage: ./scripts/rollback.sh [environment] [backup-timestamp]

set -e

ENVIRONMENT=${1:-staging}
BACKUP_TIMESTAMP=$2
BACKUP_DIR="./backups"

echo "🔄 Starting rollback for $ENVIRONMENT..."
echo "📅 Date: $(date)"

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo "❌ Error: Environment must be 'staging' or 'production'"
    exit 1
fi

# List available backups if no timestamp provided
if [ -z "$BACKUP_TIMESTAMP" ]; then
    echo "📋 Available backups for $ENVIRONMENT:"
    ls -la $BACKUP_DIR/${ENVIRONMENT}-backup-* 2>/dev/null || echo "No backups found"
    echo ""
    echo "Usage: ./scripts/rollback.sh $ENVIRONMENT [backup-timestamp]"
    echo "Example: ./scripts/rollback.sh $ENVIRONMENT 20240111-143000"
    exit 1
fi

BACKUP_PATH="$BACKUP_DIR/${ENVIRONMENT}-backup-${BACKUP_TIMESTAMP}"

# Check if backup exists
if [ ! -d "$BACKUP_PATH" ]; then
    echo "❌ Error: Backup not found at $BACKUP_PATH"
    echo "📋 Available backups:"
    ls -la $BACKUP_DIR/${ENVIRONMENT}-backup-* 2>/dev/null || echo "No backups found"
    exit 1
fi

# Confirmation for production rollback
if [ "$ENVIRONMENT" = "production" ]; then
    read -p "⚠️  Are you sure you want to rollback PRODUCTION? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "❌ Rollback cancelled"
        exit 1
    fi
fi

# Create backup of current state before rollback
CURRENT_DIR="./${ENVIRONMENT}-current"
if [ -d "$CURRENT_DIR" ]; then
    FAILED_BACKUP_DIR="$BACKUP_DIR/${ENVIRONMENT}-failed-$(date +%Y%m%d-%H%M%S)"
    echo "💾 Backing up current failed state to $FAILED_BACKUP_DIR"
    mv "$CURRENT_DIR" "$FAILED_BACKUP_DIR"
fi

# Perform rollback
echo "🔄 Rolling back to backup: $BACKUP_TIMESTAMP"
cp -r "$BACKUP_PATH" "$CURRENT_DIR"

# Health check after rollback
echo "🏥 Running post-rollback health checks..."
sleep 5

case $ENVIRONMENT in
    staging)
        HEALTH_URL="https://staging.chiropractiq.app/health"
        ;;
    production)
        HEALTH_URL="https://app.chiropractiq.com/health"
        ;;
esac

# Check application health
if curl -s -f "$HEALTH_URL" > /dev/null; then
    echo "✅ Rollback successful - application is healthy"
else
    echo "⚠️  Warning: Health check failed after rollback"
    echo "🔍 Manual verification may be required"
fi

# Generate rollback report
cat > "rollback-report-$(date +%Y%m%d-%H%M%S).json" << EOF
{
  "environment": "$ENVIRONMENT",
  "rolledBackAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "backupTimestamp": "$BACKUP_TIMESTAMP",
  "rolledBackBy": "$(whoami)",
  "reason": "Manual rollback requested",
  "status": "success"
}
EOF

echo "✅ Rollback complete!"
echo "📊 Rollback report generated"
echo "🎉 $ENVIRONMENT has been rolled back to $BACKUP_TIMESTAMP"

# Cleanup old backups (keep last 5)
echo "🧹 Cleaning up old backups..."
cd $BACKUP_DIR
ls -t ${ENVIRONMENT}-backup-* 2>/dev/null | tail -n +6 | xargs rm -rf 2>/dev/null || true
cd - > /dev/null

echo "✨ Cleanup complete"