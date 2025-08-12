# 🔄 **THREAD CONTINUITY SPECIFIC INSTRUCTIONS**

## **🎯 What You Need to Do for "Continue Previous Discussion Thread"**

### **Step 1: Look for the Option**
- **Location**: Agents panel (left sidebar in Cursor)
- **Look for**: "Continue previous discussion thread" with yellow icon
- **When**: When starting a new AI assistant session

### **Step 2: Click on It**
- **Click** on "Continue previous discussion thread"
- **The AI will have** all previous context
- **No need** to explain current status

### **Step 3: If Not Available**
If "Continue previous discussion thread" is not available:
1. **Use the template** from `THREAD_CONTINUITY.md`
2. **Reference team files** for current status
3. **Be specific** about what you're working on

---

## **🤖 Automatic Updates for New Threads**

### **What Happens Automatically**
- **Team status files** are updated on every commit
- **Thread continuity** information is maintained
- **Current progress** is tracked
- **Context is preserved** across sessions

### **What You Need to Do**
- **Nothing specific** - everything updates automatically
- **Just commit** your changes as normal
- **The system** handles all updates

### **What the AI Will Know**
- **Current application status** (live and operational)
- **Your current tasks** and progress
- **Team coordination** status
- **Recent changes** and decisions

---

## **📋 Quick Template for New Threads**

### **If "Continue Previous Discussion Thread" is Available**
- **Just click it** - no additional work needed
- **The AI will have** all context automatically

### **If Not Available, Use This Template**
```
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
```

---

## **📊 Where to Access Team Files**

### **Main Team Files**
- **`docs/team/TEAM_SPRINT_BOARD.md`** - Current tasks and progress
- **`docs/team/DEVELOPMENT_STATUS.md`** - Technical status
- **`docs/team/TEAM_CONTEXT.md`** - Communication and decisions
- **`docs/team/COORDINATION_PROTOCOLS.md`** - How to work together

### **How to Access**
1. **File explorer** in Cursor (left panel)
2. **Navigate to** `docs/team/` folder
3. **Open files** in tabs for quick reference
4. **Keep them open** during development

### **What You'll See**
- **Real-time updates** as team members work
- **Current task status** for both you and Jeff
- **Communication protocols** and decisions
- **System status** and health information

---

## **🚨 Important Notes**

### **Automatic Updates**
- **Everything updates** when you commit code
- **No manual work** required
- **Thread continuity** is maintained automatically
- **Team status** is always current

### **Best Practices**
- **Commit frequently** to keep status current
- **Use "Continue previous discussion thread"** when available
- **Reference team files** before starting new tasks
- **Update sprint board** after task completion

### **Troubleshooting**
- **If AI doesn't have context**: Use the template above
- **If status seems outdated**: Run `./scripts/update-team-status.sh`
- **If team files aren't updating**: Check git hooks are working

---

**Last Updated**: July 31, 2025 3:50 PM CT  
**Instructions Status**: ✅ READY FOR USE
