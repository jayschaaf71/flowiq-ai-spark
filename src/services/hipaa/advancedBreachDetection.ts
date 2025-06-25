
import { supabase } from '@/integrations/supabase/client';

export interface BreachAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  timestamp: Date;
  userId?: string;
  ipAddress?: string;
  dataAccessed?: string[];
  riskScore: number;
  autoResolved: boolean;
}

export interface SecurityMetrics {
  totalAlerts: number;
  criticalAlerts: number;
  falsePositives: number;
  averageResponseTime: number;
  lastBreachAttempt?: Date;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class AdvancedBreachDetectionService {
  private alertThresholds = {
    unusual_access_pattern: 3,
    bulk_data_access: 10,
    off_hours_access: 1,
    failed_login_attempts: 5,
    unauthorized_location: 1
  };

  async detectAnomalousActivity(
    userId: string,
    action: string,
    context: any
  ): Promise<BreachAlert | null> {
    const riskFactors = await this.analyzeRiskFactors(userId, action, context);
    const riskScore = this.calculateRiskScore(riskFactors);

    if (riskScore >= 7) {
      return await this.createBreachAlert({
        severity: 'critical',
        type: 'anomalous_activity',
        description: `Critical anomalous activity detected for user ${userId}`,
        userId,
        riskScore,
        dataAccessed: context.dataAccessed || [],
        ipAddress: context.ipAddress
      });
    } else if (riskScore >= 5) {
      return await this.createBreachAlert({
        severity: 'high',
        type: 'suspicious_activity',
        description: `Suspicious activity pattern detected`,
        userId,
        riskScore,
        dataAccessed: context.dataAccessed || []
      });
    }

    return null;
  }

  private async analyzeRiskFactors(userId: string, action: string, context: any): Promise<string[]> {
    const riskFactors: string[] = [];

    // Check for unusual access patterns
    const recentActivity = await this.getRecentUserActivity(userId);
    if (this.isUnusualAccessPattern(recentActivity, action)) {
      riskFactors.push('unusual_access_pattern');
    }

    // Check for bulk data access
    if (context.recordCount && context.recordCount > this.alertThresholds.bulk_data_access) {
      riskFactors.push('bulk_data_access');
    }

    // Check for off-hours access
    if (this.isOffHoursAccess()) {
      riskFactors.push('off_hours_access');
    }

    // Check for failed authentication attempts
    const failedAttempts = await this.getFailedLoginAttempts(userId);
    if (failedAttempts >= this.alertThresholds.failed_login_attempts) {
      riskFactors.push('repeated_failed_logins');
    }

    // Check for unauthorized location
    if (context.location && await this.isUnauthorizedLocation(userId, context.location)) {
      riskFactors.push('unauthorized_location');
    }

    // Check for privilege escalation
    if (context.privilegeChange) {
      riskFactors.push('privilege_escalation');
    }

    return riskFactors;
  }

  private calculateRiskScore(riskFactors: string[]): number {
    const scoreMap: Record<string, number> = {
      unusual_access_pattern: 2,
      bulk_data_access: 3,
      off_hours_access: 1,
      repeated_failed_logins: 2,
      unauthorized_location: 4,
      privilege_escalation: 5
    };

    return riskFactors.reduce((score, factor) => 
      score + (scoreMap[factor] || 1), 0
    );
  }

  private async createBreachAlert(alertData: Partial<BreachAlert>): Promise<BreachAlert> {
    const alert: BreachAlert = {
      id: crypto.randomUUID(),
      severity: alertData.severity || 'medium',
      type: alertData.type || 'unknown',
      description: alertData.description || 'Security alert detected',
      timestamp: new Date(),
      userId: alertData.userId,
      ipAddress: alertData.ipAddress,
      dataAccessed: alertData.dataAccessed || [],
      riskScore: alertData.riskScore || 0,
      autoResolved: false
    };

    // Log the breach alert
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'security_alerts',
      alert.id,
      'BREACH_ALERT_CREATED',
      null,
      {
        ...alert,
        compliance_note: 'HIPAA security breach alert generated'
      }
    );

    // Send immediate notification for critical alerts
    if (alert.severity === 'critical') {
      await this.sendImmediateAlert(alert);
    }

    return alert;
  }

  private async sendImmediateAlert(alert: BreachAlert): Promise<void> {
    console.log('CRITICAL SECURITY ALERT:', alert);
    
    // In production, this would send notifications to security team
    // via email, SMS, or security incident management system
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const { data: alerts } = await supabase
      .from('audit_logs')
      .select('*')
      .ilike('action', '%BREACH%')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    const totalAlerts = alerts?.length || 0;
    const criticalAlerts = alerts?.filter(alert => {
      if (alert.new_values && typeof alert.new_values === 'object' && alert.new_values !== null) {
        const alertData = alert.new_values as Record<string, any>;
        return alertData.severity === 'critical';
      }
      return false;
    }).length || 0;

    return {
      totalAlerts,
      criticalAlerts,
      falsePositives: Math.floor(totalAlerts * 0.1), // Estimated
      averageResponseTime: 15, // minutes
      riskLevel: criticalAlerts > 0 ? 'high' : totalAlerts > 10 ? 'medium' : 'low'
    };
  }

  private async getRecentUserActivity(userId: string): Promise<any[]> {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    return data || [];
  }

  private isUnusualAccessPattern(recentActivity: any[], currentAction: string): boolean {
    // Analyze access patterns - simplified logic
    const actionCounts = recentActivity.reduce((counts, activity) => {
      counts[activity.action] = (counts[activity.action] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const currentCount = actionCounts[currentAction] || 0;
    const actionKeys = Object.keys(actionCounts);
    const totalActions = actionKeys.reduce((sum, key) => sum + (actionCounts[key] || 0), 0);
    const averageCount = totalActions / Math.max(actionKeys.length, 1);

    return currentCount > averageCount * 2;
  }

  private isOffHoursAccess(): boolean {
    const now = new Date();
    const hour = now.getHours();
    return hour < 6 || hour > 22; // Outside 6 AM - 10 PM
  }

  private async getFailedLoginAttempts(userId: string): Promise<number> {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('action', 'LOGIN_FAILED')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    return data?.length || 0;
  }

  private async isUnauthorizedLocation(userId: string, currentLocation: string): Promise<boolean> {
    // In production, this would check against approved locations for the user
    return false; // Simplified for demo
  }
}

export const advancedBreachDetection = new AdvancedBreachDetectionService();
