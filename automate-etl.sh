#!/bin/bash

# Sleep Impressions ETL Automation Script
# This script can be run manually or via cron job

# Set the working directory to the script location
cd "$(dirname "$0")"

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "❌ .env file not found. Please run setup-etl-env.sh first."
    exit 1
fi

# Create logs directory if it doesn't exist
mkdir -p etl-logs

# Log file for ETL runs
LOG_FILE="etl-logs/etl-$(date +%Y%m%d-%H%M%S).log"

echo "🚀 Starting automated ETL process at $(date)" | tee -a "$LOG_FILE"
echo "📁 Working directory: $(pwd)" | tee -a "$LOG_FILE"
echo "🔧 Environment variables loaded" | tee -a "$LOG_FILE"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed or not in PATH" | tee -a "$LOG_FILE"
    exit 1
fi

# Check if required files exist
if [ ! -f "enhanced-etl-processor.js" ]; then
    echo "❌ enhanced-etl-processor.js not found" | tee -a "$LOG_FILE"
    exit 1
fi

# Run the ETL script
echo "🔄 Starting ETL process..." | tee -a "$LOG_FILE"
node enhanced-etl-processor.js 2>&1 | tee -a "$LOG_FILE"

# Check if ETL was successful
if [ $? -eq 0 ]; then
    echo "✅ ETL process completed successfully at $(date)" | tee -a "$LOG_FILE"
    
    # Optional: Send success notification
    echo "📧 ETL completed successfully - $(date)" >> "$LOG_FILE"
    
    # Clean up old log files (keep last 30 days)
    find etl-logs -name "etl-*.log" -mtime +30 -delete 2>/dev/null
    
    exit 0
else
    echo "❌ ETL process failed at $(date)" | tee -a "$LOG_FILE"
    
    # Optional: Send error notification
    echo "📧 ETL failed - $(date)" >> "$LOG_FILE"
    
    exit 1
fi
