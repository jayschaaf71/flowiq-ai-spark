#!/bin/bash

echo "🚀 ETL PR Merge Script"
echo "======================"

echo "Step 1: Checking current status..."
git status

echo -e "\nStep 2: Attempting merge with main..."
git merge main --no-commit --no-ff

if [ $? -eq 0 ]; then
    echo "✅ No conflicts! Ready to merge."
    echo "To complete the merge:"
    echo "git commit -m 'Merge ETL automation setup'"
    echo "git push origin etl-automation-setup"
else
    echo "⚠️  Conflicts detected. Here's how to resolve them:"
    echo ""
    echo "Conflicted files:"
    git diff --name-only --diff-filter=U
    
    echo ""
    echo "Resolution strategy:"
    echo "1. For package.json/package-lock.json: Keep both versions"
    echo "2. For docs/team/*.md: Keep your version (more recent)"
    echo "3. For src/etl/midwest_si/*: Keep your version (new files)"
    echo "4. For vercel.json: Merge manually if needed"
    
    echo ""
    echo "To resolve conflicts:"
    echo "1. Edit each conflicted file"
    echo "2. Remove conflict markers (<<<<<<, =======, >>>>>>>)"
    echo "3. Keep the appropriate content"
    echo "4. git add <resolved-file>"
    echo "5. git commit -m 'Resolve merge conflicts'"
fi

echo ""
echo "Step 3: After merging, test the application:"
echo "npm install"
echo "npm run dev"
echo "npm test"

echo ""
echo "🎉 Ready to merge your ETL PR!"
