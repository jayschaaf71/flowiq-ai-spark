#!/bin/bash

echo "🚀 Setting up ETL Environment Variables"
echo "======================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    touch .env
fi

echo ""
echo "Please provide the following values:"
echo ""

# Supabase URL
read -p "Enter your Supabase URL (from Vercel env vars): " SUPABASE_URL
if [ ! -z "$SUPABASE_URL" ]; then
    echo "NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL" >> .env
    echo "✅ Supabase URL set"
fi

# Supabase Service Role Key
read -s -p "Enter your Supabase Service Role Key (from Vercel env vars): " SUPABASE_KEY
echo ""
if [ ! -z "$SUPABASE_KEY" ]; then
    echo "SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_KEY" >> .env
    echo "✅ Supabase Service Role Key set"
fi

# SFTP Configuration
echo ""
echo "SFTP Configuration (these should be the same as in Vercel):"
echo "SFTP_HOST=s-52998ed3b45247b4b.server.transfer.us-east-2.amazonaws.com"
echo "SFTP_USERNAME=flowiq-etl-si"
echo ""

read -p "Enter your SFTP Private Key (from Vercel env vars): " SFTP_KEY
if [ ! -z "$SFTP_KEY" ]; then
    echo "SFTP_HOST=s-52998ed3b45247b4b.server.transfer.us-east-2.amazonaws.com" >> .env
    echo "SFTP_USERNAME=flowiq-etl-si" >> .env
    echo "SFTP_PRIVATE_KEY=$SFTP_KEY" >> .env
    echo "✅ SFTP configuration set"
fi

echo ""
echo "🎉 Environment setup complete!"
echo "You can now run: node enhanced-etl-processor.js"
echo ""
echo "To test the setup, run: ./test-automation.sh"
echo ""
echo "To set up automation, run: ./automate-etl.sh"
