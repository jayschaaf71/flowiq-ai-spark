#!/bin/bash

echo "🚀 ETL PR Merge Script"
echo "======================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking current status...${NC}"
git status

echo -e "\n${BLUE}Step 2: Attempting merge with main...${NC}"
git merge main --no-commit --no-ff

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ No conflicts! Ready to merge.${NC}"
    echo -e "${YELLOW}To complete the merge:${NC}"
    echo "git commit -m 'Merge ETL automation setup'"
    echo "git push origin etl-automation-setup"
else
    echo -e "${RED}⚠️  Conflicts detected. Here's how to resolve them:${NC}"
    echo ""
    echo -e "${YELLOW}Conflicted files:${NC}"
    git diff --name-only --diff-filter=U
    
    echo ""
    echo -e "${YELLOW}Resolution strategy:${NC}"
    echo "1. For package.json/package-lock.json: Keep both versions"
    echo "2. For docs/team/*.md: Keep your version (more recent)"
    echo "3. For src/etl/midwest_si/*: Keep your version (new files)"
    echo "4. For vercel.json: Merge manually if needed"
    
    echo ""
    echo -e "${YELLOW}To resolve conflicts:${NC}"
    echo "1. Edit each conflicted file"
    echo "2. Remove conflict markers (<<<<<<, =======, >>>>>>>)"
    echo "3. Keep the appropriate content"
    echo "4. git add <resolved-file>"
    echo "5. git commit -m 'Resolve merge conflicts'"
fi

echo ""
echo -e "${BLUE}Step 3: After merging, test the application:${NC}"
echo "npm install"
echo "npm run dev"
echo "npm test"

echo ""
echo -e "${GREEN}🎉 Ready to merge your ETL PR!${NC}"
