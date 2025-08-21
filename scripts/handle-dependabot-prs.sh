#!/bin/bash

# Script to handle Dependabot PRs systematically
echo "🔧 Dependabot PR Management Script"
echo "=================================="

# List of PRs to handle
PRS=(
    "19:react-hook-form:7.53.1:7.62.0"
    "18:zod:3.23.8:4.0.14"
    "13:recharts:2.13.0:3.1.0"
    "12:vite:5.4.10:7.0.6"
    "11:react-router-dom:6.27.0:7.7.1"
    "10:cmdk:1.0.0:1.1.1"
    "9:@radix-ui/react-toggle-group:1.1.0:1.1.10"
    "7:@radix-ui/react-menubar:1.1.2:1.1.15"
    "6:@radix-ui/react-progress:1.1.0:1.1.7"
    "2:tailwind-merge:2.5.4:3.3.1"
)

echo "📋 Found ${#PRS[@]} Dependabot PRs to handle"
echo ""

for pr in "${PRS[@]}"; do
    IFS=':' read -r pr_number package old_version new_version <<< "$pr"
    echo "🔍 PR #$pr_number: $package ($old_version → $new_version)"
    
    # Check if this is a breaking change
    if [[ "$package" == "zod" && "$old_version" == "3.23.8" && "$new_version" == "4.0.14" ]]; then
        echo "   ⚠️  BREAKING CHANGE: zod v4 has breaking changes"
        echo "   💡 Recommendation: Test thoroughly or hold off"
    elif [[ "$package" == "react-router-dom" && "$old_version" == "6.27.0" && "$new_version" == "7.7.1" ]]; then
        echo "   ⚠️  MAJOR VERSION: react-router-dom v7 has breaking changes"
        echo "   💡 Recommendation: Test thoroughly or hold off"
    elif [[ "$package" == "vite" && "$old_version" == "5.4.10" && "$new_version" == "7.0.6" ]]; then
        echo "   ⚠️  MAJOR VERSION: vite v7 has breaking changes"
        echo "   💡 Recommendation: Test thoroughly or hold off"
    else
        echo "   ✅ Minor/Patch update - generally safe"
    fi
    echo ""
done

echo "📝 Recommendations:"
echo "1. Merge your ETL PR (#20) first"
echo "2. Test the breaking changes (zod, react-router-dom, vite) in a separate branch"
echo "3. Merge the safe minor/patch updates"
echo "4. Investigate PR #17 (bug fix) separately"
echo ""
echo "🔗 GitHub PRs: https://github.com/jayschaaf71/flowiq-ai-spark/pulls"
