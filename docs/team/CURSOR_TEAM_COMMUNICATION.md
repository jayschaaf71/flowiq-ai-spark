# 📞 **CURSOR TEAM COMMUNICATION GUIDE**

## **🤖 How to Use Cursor Team Chat**

### **Accessing Team Chat**
1. **In Cursor**, look for the team chat panel
2. **Click on** your team member's name
3. **Start typing** to send messages
4. **Use @mentions** to notify specific team members

### **Real-Time Communication**
- **Quick questions**: Use team chat for immediate responses
- **Status updates**: Share progress and blockers
- **Coordination**: Discuss overlapping work
- **Decisions**: Document important choices

### **What You Can See**
- **Jeff's messages** in real-time
- **Jeff's current status** through shared files
- **Jeff's progress** through git commits
- **Jeff's blockers** through team chat

### **What Jeff Can See**
- **Your messages** in real-time
- **Your current status** through shared files
- **Your progress** through git commits
- **Your blockers** through team chat

---

## **📊 Real-Time Visibility**

### **What You Can Monitor**
1. **Jeff's Current Tasks**: `docs/team/TEAM_SPRINT_BOARD.md`
2. **System Status**: `docs/team/DEVELOPMENT_STATUS.md`
3. **Communication**: `docs/team/TEAM_CONTEXT.md`
4. **Git Activity**: See Jeff's commits in real-time
5. **Team Chat**: Direct communication

### **How to Check Jeff's Progress**
```bash
# See Jeff's recent commits
git log --author="Jeff" --oneline

# See Jeff's current branch
git branch -r | grep jeff

# See Jeff's uncommitted changes
git status
```

### **Team Files to Monitor**
- **`TEAM_SPRINT_BOARD.md`**: Jeff's current tasks and progress
- **`DEVELOPMENT_STATUS.md`**: Overall system status
- **`TEAM_CONTEXT.md`**: Communication and decisions
- **Git commits**: Real-time development activity

---

## **🔄 Thread Continuity for Both of You**

### **For You (Jason)**
When starting new AI sessions:
1. **Use "Continue previous discussion thread"** if available
2. **Reference team files** for current status
3. **Use the template** from `THREAD_CONTINUITY.md`

### **For Jeff**
When starting new AI sessions:
1. **Use "Continue previous discussion thread"** if available
2. **Reference team files** for current status
3. **Use the template** from `THREAD_CONTINUITY.md`

### **What Happens Automatically**
- **Team status updates** on every commit
- **Thread continuity** information updated
- **Progress tracking** maintained
- **Context preservation** across sessions

---

## **🎯 Communication Best Practices**

### **Daily Standup (10:00 AM CT)**
- **Format**: Quick status update
- **Duration**: 15 minutes
- **Topics**: Progress, blockers, coordination needs

### **Real-Time Updates**
- **Use team chat** for quick questions
- **Update sprint board** after task completion
- **Communicate blockers** immediately
- **Document decisions** in team files

### **Conflict Resolution**
1. **Direct communication** in team chat
2. **Daily standup** discussion if needed
3. **Document** decisions in `TEAM_CONTEXT.md`
4. **Escalate** if no agreement reached

---

## **📋 Quick Reference**

### **For Jason**
- **Monitor**: `TEAM_SPRINT_BOARD.md` for Jeff's progress
- **Communicate**: Use Cursor team chat
- **Coordinate**: Daily standup at 10:00 AM CT
- **Thread continuity**: Use "Continue previous discussion thread"

### **For Jeff**
- **Monitor**: `TEAM_SPRINT_BOARD.md` for Jason's progress
- **Communicate**: Use Cursor team chat
- **Coordinate**: Daily standup at 10:00 AM CT
- **Thread continuity**: Use "Continue previous discussion thread"

---

**Last Updated**: July 31, 2025 3:50 PM CT  
**Communication Status**: ✅ FULLY OPERATIONAL
