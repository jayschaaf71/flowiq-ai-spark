#!/bin/bash

# 🚀 Auto-Update Setup Script
# Sets up automatic status updates for team coordination

echo "🚀 Setting up automatic team status updates..."

# Create git hooks for automatic updates
mkdir -p .git/hooks

# Pre-commit hook to update status
cat > .git/hooks/pre-commit << 'HOOK_EOF'
#!/bin/bash

# Auto-update team status before commit
echo "🔄 Updating team coordination status..."
./scripts/update-team-status.sh

# Add updated files to commit
git add docs/team/
git add CI_CD_STATUS.md

echo "✅ Team status updated and included in commit"
HOOK_EOF

# Post-commit hook to push updates
cat > .git/hooks/post-commit << 'HOOK_EOF'
#!/bin/bash

# Update thread continuity after commit
echo "📋 Updating thread continuity information..."

# Get current branch and commit info
CURRENT_BRANCH=$(git branch --show-current)
LAST_COMMIT=$(git log -1 --format="%h - %s")
TIMESTAMP=$(date '+%B %d, %Y %I:%M %p CT')

# Update thread continuity file
cat > docs/team/THREAD_CONTINUITY.md << CONTINUITY_EOF
# 🔄 **THREAD CONTINUITY SYSTEM**

## **🎯 Purpose**
This system ensures smooth transitions between conversation threads with the AI assistant, maintaining context and preventing duplicate work.

---

## **📋 Quick Reference for New Threads**

### **When Starting a New Thread, Say:**
\`\`\`
"I'm continuing from a previous thread. Here's the current status:

✅ Application is live and operational
✅ CI/CD pipeline is working
✅ Team coordination system is established
✅ Current focus: Practice setup and user onboarding

Please reference these files for context:
- docs/team/TEAM_SPRINT_BOARD.md
- docs/team/DEVELOPMENT_STATUS.md
- docs/team/TEAM_CONTEXT.md
- CI_CD_STATUS.md

What specific task should I help with today?"
\`\`\`

---

## **📊 Current Status Summary**

### **Application Status**
- **Production**: ✅ LIVE
- **URLs**: 
  - Main: https://flowiq-ai-spark-diug6m0uf-flow-iq.vercel.app
  - Midwest Dental: https://midwest-dental-sleep.flow-iq.ai
  - West County Spine: https://west-county-spine.flow-iq.ai
- **Health**: 83% success rate
- **Performance**: <3s page load times

### **Team Status**
- **Jason**: Working on platform admin dashboard
- **Jeff**: Preparing for practice setup
- **Daily Standup**: 10:00 AM CT
- **Current Sprint**: Pilot Launch Preparation

### **Development Status**
- **Git Workflow**: ✅ Confirmed working
- **CI/CD Pipeline**: ✅ Fully operational
- **Branch Strategy**: main ← develop ← feature/[developer]/[feature]
- **Current Branch**: $CURRENT_BRANCH
- **Last Commit**: $LAST_COMMIT

---

## **🔄 Context Preservation Files**

### **Core Files to Reference**
1. **\`docs/team/TEAM_SPRINT_BOARD.md\`** - Current tasks and status
2. **\`docs/team/DEVELOPMENT_STATUS.md\`** - Technical status and continuity
3. **\`docs/team/TEAM_CONTEXT.md\`** - Team communication and decisions
4. **\`docs/team/COORDINATION_PROTOCOLS.md\`** - How to work together
5. **\`CI_CD_STATUS.md\`** - Deployment and pipeline status

### **Key Context Points**
- Application is deployed and live
- CI/CD pipeline is fully operational
- Team coordination system is established
- Next phase is pilot practice setup
- Daily standup at 10:00 AM CT
- Git workflow is confirmed working

---

## **🚨 Common Issues & Solutions**

### **Issue: AI doesn't know current status**
**Solution**: Reference the status files above and provide quick summary

### **Issue: Duplicate work being done**
**Solution**: Check \`TEAM_SPRINT_BOARD.md\` for current tasks

### **Issue: Lost context from previous thread**
**Solution**: Use the quick reference template above

### **Issue: Team coordination confusion**
**Solution**: Check \`TEAM_CONTEXT.md\` for communication protocols

---

## **�� Best Practices**

### **Before Starting New Thread**
1. **Update status files** with current progress
2. **Commit any changes** to preserve work
3. **Note current task** in sprint board
4. **Document any decisions** made

### **When Starting New Thread**
1. **Use quick reference template**
2. **Reference status files**
3. **Be specific about current task**
4. **Ask for confirmation of context**

### **During Thread**
1. **Update status files** as work progresses
2. **Document important decisions**
3. **Note any blockers or issues**
4. **Keep sprint board current**

---

## **🎯 Success Metrics**

### **Thread Continuity Success**
- ✅ No duplicate work between threads
- ✅ Context maintained across sessions
- ✅ Team coordination preserved
- ✅ Progress tracked accurately

### **Team Efficiency**
- ✅ Clear task ownership
- ✅ Effective communication
- ✅ Conflict prevention
- ✅ Smooth handoffs

---

**Last Updated**: $TIMESTAMP  
**Next Review**: Next development session
CONTINUITY_EOF

echo "✅ Thread continuity updated after commit"
HOOK_EOF

# Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit

echo "✅ Auto-update system configured"
echo ""
echo "📋 What this does:"
echo "1. Updates team status before each commit"
echo "2. Updates thread continuity after each commit"
echo "3. Ensures all changes are tracked"
echo "4. Maintains context across threads"
echo ""
echo "🚀 System is now fully automated!"
