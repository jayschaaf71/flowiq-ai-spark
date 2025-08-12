# 🚀 **JEFF'S CURSOR SETUP GUIDE**

## **✅ Quick Setup for Jeff**

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/jayschaaf71/flowiq-ai-spark.git
cd flowiq-ai-spark
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Set Up Cursor Workspace**
1. **Open the project** in Cursor
2. **Apply workspace settings** (already configured)
3. **Keep team files open** in tabs:
   - `docs/team/TEAM_SPRINT_BOARD.md`
   - `docs/team/DEVELOPMENT_STATUS.md`
   - `docs/team/TEAM_CONTEXT.md`

### **Step 4: Verify Setup**
```bash
# Test the auto-update system
./scripts/update-team-status.sh

# Check git hooks are working
git status
```

---

## **🔄 How to Use the Team Coordination System**

### **Starting Your Work Day**
1. **Check** `TEAM_SPRINT_BOARD.md` for your current tasks
2. **Update** your status in the sprint board
3. **Create feature branch** for your work:
   ```bash
   git checkout -b feature/jeff/practice-setup
   ```

### **During Development**
1. **Work on your tasks** as normal
2. **Commit frequently** to trigger auto-updates
3. **Update sprint board** when tasks are completed
4. **Communicate blockers** in Cursor team chat

### **End of Day**
1. **Commit your changes** (auto-updates team status)
2. **Update sprint board** with progress
3. **Push to remote** to share with team

---

## **🤖 AI Assistant Thread Continuity**

### **Starting New AI Sessions**
When you start a new conversation with the AI assistant, use this template:

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

### **Using "Continue Previous Discussion Thread"**
1. **Look for** "Continue previous discussion thread" in the agents panel
2. **Click on it** to resume previous conversations
3. **The AI will have** all current context and status

---

## **📞 Communication with Jason**

### **Real-Time Updates**
- **Cursor team chat** for quick questions
- **Shared files** for status updates
- **Daily standup** at 10:00 AM CT

### **What You Can See**
- **Jason's current tasks** in `TEAM_SPRINT_BOARD.md`
- **System status** in `DEVELOPMENT_STATUS.md`
- **Communication protocols** in `TEAM_CONTEXT.md`
- **Git commits** show what Jason is working on

### **What Jason Can See**
- **Your current tasks** in `TEAM_SPRINT_BOARD.md`
- **Your progress** through git commits
- **Your blockers** through team chat
- **Your decisions** in team context files

---

## **🎯 Your Current Tasks**

### **Immediate (This Week)**
1. **Practice Setup Configuration**
   - Configure Midwest Dental Sleep settings
   - Configure West County Spine settings
   - Test practice-specific workflows

2. **User Onboarding Process**
   - Create training materials
   - Set up user guides
   - Prepare onboarding flows

### **Next Week**
1. **Provider Training Sessions**
2. **Patient Portal Setup**
3. **Feedback Collection System**

---

## **🚨 Important Notes**

### **Auto-Updates**
- **Everything updates automatically** when you commit
- **No manual work** required for status updates
- **Thread continuity** is maintained automatically

### **Conflict Prevention**
- **Coordinate** with Jason on overlapping work
- **Communicate** blockers immediately
- **Document** decisions in team files

### **Best Practices**
- **Commit frequently** to keep status current
- **Use feature branches** for your work
- **Reference team files** before starting new tasks
- **Update sprint board** after task completion

---

**Last Updated**: July 31, 2025 3:50 PM CT  
**Ready for**: Jeff to begin practice setup work
