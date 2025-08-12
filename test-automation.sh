#!/bin/bash

echo "🚀 Testing ETL automation..."
echo "📁 Current directory: $(pwd)"
echo "📅 Current time: $(date)"

# Test if we can run the ETL script directly
if [ -f "enhanced-etl-processor.js" ]; then
    echo "✅ ETL script found"
    
    # Test with environment variables from Vercel
    export NEXT_PUBLIC_SUPABASE_URL="https://jnpzabmqieceoqjypvve.supabase.co"
    export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucHphYm1xaWVjZW9xanlwdnZlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODcxNDg3MiwiZXhwIjoyMDY0MjkwODcyfQ.CSiUTDC5KeL2y-LNLHJt7jwwc8tLvsLnXarH5fhhonM"
    
    echo "🔄 Running ETL test..."
    node enhanced-etl-processor.js
    
    if [ $? -eq 0 ]; then
        echo "✅ ETL test successful"
    else
        echo "❌ ETL test failed"
    fi
else
    echo "❌ ETL script not found"
fi
