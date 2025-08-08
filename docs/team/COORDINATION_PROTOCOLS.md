# 🤝 **COORDINATION PROTOCOLS**

## **🔄 Git Workflow for Team Development**

### **Branch Strategy** ✅ CONFIRMED WORKING
```
main (protected) ← develop ← feature/[developer]/[feature]
```

### **Current Branches**
- **main**: Production-ready code (protected)
- **develop**: Integration branch for staging
- **production-deployment-ready**: Current deployment branch
- **feature branches**: Individual development work

### **Workflow Process**
1. **Create feature branch**: `git checkout -b feature/jason/platform-admin`
2. **Develop and commit**: Regular commits with descriptive messages
3. **Push to remote**: `git push origin feature/[branch-name]`
4. **Create pull request**: To `develop` for integration
5. **Code review**: Both team members review
6. **Merge to develop**: Triggers staging deployment
7. **Merge to main**: Triggers production deployment

---

## **🚨 Conflict Prevention & Resolution**

### **Areas Requiring Coordination**

#### **Database Migrations**
- **Coordination**: Always communicate before creating migrations
- **Process**: 
  1. Discuss changes in daily standup
  2. Create migration in feature branch
  3. Test in staging environment
  4. Coordinate deployment timing

#### **API Changes**
- **Coordination**: Notify team of breaking changes
- **Process**:
  1. Document changes in `API_CHANGES.md`
  2. Use feature flags for major changes
  3. Test in staging before production
  4. Coordinate deployment with team

#### **UI/UX Changes**
- **Coordination**: Ensure consistency across components
- **Process**:
  1. Use shared component library
  2. Follow design system guidelines
  3. Test across different screen sizes
  4. Get feedback from both team members

#### **Deployment Timing**
- **Coordination**: Avoid simultaneous deployments
- **Process**:
  1. Communicate deployment plans in standup
  2. Use staging environment for testing
  3. Coordinate production deployments
  4. Monitor health checks after deployment

---

## **📞 Communication Protocols**

### **Daily Standup (10:00 AM CT)**
```
Format:
1. What I completed yesterday
2. What I'm working on today
3. Any blockers or issues
4. Questions for the team

Duration: 15 minutes
Location: Cursor team chat
```

### **Real-time Updates**
- **Use**: Cursor team chat for quick updates
- **When**: 
  - Starting new task
  - Completing task
  - Encountering blocker
  - Making important decision

### **Documentation Updates**
- **Update**: `TEAM_SPRINT_BOARD.md` after each task completion
- **Update**: `DEVELOPMENT_STATUS.md` when status changes
- **Update**: `TEAM_CONTEXT.md` for decisions and changes

---

## **🛠️ Development Best Practices**

### **Code Quality**
- **TypeScript**: Strict mode enabled
- **ESLint**: All rules must pass
- **Testing**: Maintain 85%+ coverage
- **Documentation**: Update README for new features

### **Git Best Practices**
- **Commit Messages**: Descriptive and clear
- **Branch Naming**: `feature/[developer]/[feature]`
- **Pull Requests**: Include description and testing notes
- **Code Review**: Required for all changes

### **Deployment Best Practices**
- **Staging First**: Always deploy to staging before production
- **Health Checks**: Verify all endpoints after deployment
- **Rollback Plan**: Always have rollback strategy
- **Monitoring**: Watch metrics after deployment

---

## **🚨 Emergency Procedures**

### **Production Issues**
1. **Immediate**: Check health endpoints
2. **Assessment**: Determine severity and impact
3. **Communication**: Notify team immediately
4. **Resolution**: Apply fix or rollback
5. **Documentation**: Update status and lessons learned

### **Data Issues**
1. **Assessment**: Determine scope and impact
2. **Backup**: Verify data backups
3. **Recovery**: Restore from backup if needed
4. **Investigation**: Identify root cause
5. **Prevention**: Implement safeguards

### **Security Issues**
1. **Immediate**: Assess vulnerability
2. **Containment**: Limit exposure
3. **Communication**: Notify team and stakeholders
4. **Resolution**: Apply security patch
5. **Review**: Conduct security audit

---

## **📊 Monitoring & Alerts**

### **Automated Monitoring**
- **Uptime**: 99.9% target
- **Performance**: <3s page load times
- **Errors**: <0.1% error rate
- **Security**: Weekly vulnerability scans

### **Manual Checks**
- **Daily**: Review health check results
- **Weekly**: Review performance metrics
- **Monthly**: Conduct security review

---

**Last Updated**: July 31, 2025 3:30 PM CT  
**Next Review**: August 1, 2025 10:00 AM CT
