#!/bin/bash

# Copy SQL script to clipboard for easy pasting into Supabase

echo "📋 Copying SQL script to clipboard..."
echo ""

# Check if pbcopy is available (macOS)
if command -v pbcopy &> /dev/null; then
    cat scripts/create-admin-users.sql | pbcopy
    echo "✅ SQL script copied to clipboard!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to: https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve"
    echo "2. Click 'SQL Editor' in the left sidebar"
    echo "3. Click in the text area and press Cmd+V to paste"
    echo "4. Click the green 'Run' button"
    echo ""
    echo "🔑 After running, you can login with:"
    echo "   Midwest Dental: admin@midwestdental.com / MidwestAdmin2024!"
    echo "   West County: admin@westcountyspine.com / WestCountyAdmin2024!"
elif command -v xclip &> /dev/null; then
    cat scripts/create-admin-users.sql | xclip -selection clipboard
    echo "✅ SQL script copied to clipboard!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Go to: https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve"
    echo "2. Click 'SQL Editor' in the left sidebar"
    echo "3. Click in the text area and press Ctrl+V to paste"
    echo "4. Click the green 'Run' button"
else
    echo "❌ No clipboard tool found. Please copy manually:"
    echo ""
    echo "1. Open scripts/create-admin-users.sql in Cursor"
    echo "2. Select all (Cmd+A) and copy (Cmd+C)"
    echo "3. Paste into Supabase SQL Editor"
fi 