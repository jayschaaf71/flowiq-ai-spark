import { supabase } from '@/integrations/supabase/client';

export interface ComplianceAlert {
  id: string;
  type: 'encryption_failure' | 'audit_gap' | 'access_violation' | 'data_breach' | 'configuration_drift';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  resolvedBy?: string;
  actionRequired: string;
  affectedSystems: string[];
  complianceStandard: 'HIPAA' | 'HITECH' | 'SOC2' | 'GDPR';
}

export interface AlertingConfig {
  enableRealTimeAlerts: boolean;
  alertChannels: ('email' | 'sms' | 'dashboard' | 'webhook')[];
  escalationRules: {
    severity: 'high' | 'critical';
    escalateAfterMinutes: number;
    escalationContacts: string[];
  }[];
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export class ComplianceAlertingService {
  private alertingConfig: AlertingConfig = {
    enableRealTimeAlerts: true,
    alertChannels: ['dashboard', 'email'],
    escalationRules: [
      {
        severity: 'critical',
        escalateAfterMinutes: 5,
        escalationContacts: ['compliance@company.com', 'security@company.com']
      },
      {
        severity: 'high',
        escalateAfterMinutes: 30,
        escalationContacts: ['compliance@company.com']
      }
    ],
    quietHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '06:00'
    }
  };

  async createComplianceAlert(alertData: Omit<ComplianceAlert, 'id' | 'timestamp' | 'resolved'>): Promise<ComplianceAlert> {
    const alert: ComplianceAlert = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      resolved: false,
      ...alertData
    };

    // Log the compliance alert
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'compliance_alerts',
      alert.id,
      'COMPLIANCE_ALERT_CREATED',
      null,
      {
        alert_id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        compliance_note: `${alert.complianceStandard} compliance alert: ${alert.type}`
      }
    );

    // Send notifications based on severity and configuration
    await this.processAlertNotifications(alert);

    return alert;
  }

  private async processAlertNotifications(alert: ComplianceAlert): Promise<void> {
    if (!this.alertingConfig.enableRealTimeAlerts) return;

    // Check quiet hours
    if (this.isQuietHours() && alert.severity !== 'critical') {
      console.log('Delaying non-critical alert due to quiet hours:', alert.id);
      return;
    }

    // Send notifications through configured channels
    for (const channel of this.alertingConfig.alertChannels) {
      await this.sendNotification(alert, channel);
    }

    // Set up escalation if needed
    if (alert.severity === 'high' || alert.severity === 'critical') {
      await this.scheduleEscalation(alert);
    }
  }

  private async sendNotification(alert: ComplianceAlert, channel: string): Promise<void> {
    switch (channel) {
      case 'email':
        await this.sendEmailNotification(alert);
        break;
      case 'sms':
        await this.sendSMSNotification(alert);
        break;
      case 'dashboard':
        await this.updateDashboardAlert(alert);
        break;
      case 'webhook':
        await this.sendWebhookNotification(alert);
        break;
    }
  }

  private async sendEmailNotification(alert: ComplianceAlert): Promise<void> {
    console.log('Sending email notification for compliance alert:', alert.id);
    // In production, integrate with email service
  }

  private async sendSMSNotification(alert: ComplianceAlert): Promise<void> {
    console.log('Sending SMS notification for compliance alert:', alert.id);
    // In production, integrate with SMS service
  }

  private async updateDashboardAlert(alert: ComplianceAlert): Promise<void> {
    // Store alert in database for dashboard display
    await supabase
      .from('audit_logs')
      .insert({
        table_name: 'compliance_alerts',
        record_id: alert.id,
        action: 'DASHBOARD_ALERT',
        new_values: {
          alert_id: alert.id,
          type: alert.type,
          severity: alert.severity,
          title: alert.title,
          description: alert.description
        }
      });
  }

  private async sendWebhookNotification(alert: ComplianceAlert): Promise<void> {
    console.log('Sending webhook notification for compliance alert:', alert.id);
    // In production, send to configured webhook endpoints
  }

  private isQuietHours(): boolean {
    if (!this.alertingConfig.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const startTime = this.parseTime(this.alertingConfig.quietHours.startTime);
    const endTime = this.parseTime(this.alertingConfig.quietHours.endTime);

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      // Quiet hours span midnight
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 100 + minutes;
  }

  private async scheduleEscalation(alert: ComplianceAlert): Promise<void> {
    const escalationRule = this.alertingConfig.escalationRules.find(
      rule => rule.severity === alert.severity
    );

    if (!escalationRule) return;

    // In production, this would use a job queue or scheduler
    setTimeout(async () => {
      const isResolved = await this.isAlertResolved(alert.id);
      if (!isResolved) {
        await this.escalateAlert(alert, escalationRule.escalationContacts);
      }
    }, escalationRule.escalateAfterMinutes * 60 * 1000);
  }

  private async isAlertResolved(alertId: string): Promise<boolean> {
    const { data } = await supabase
      .from('audit_logs')
      .select('new_values')
      .eq('record_id', alertId)
      .eq('action', 'COMPLIANCE_ALERT_RESOLVED')
      .single();

    return !!data;
  }

  private async escalateAlert(alert: ComplianceAlert, contacts: string[]): Promise<void> {
    console.log('Escalating compliance alert:', alert.id, 'to:', contacts);
    
    // Log escalation
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'compliance_alerts',
      alert.id,
      'COMPLIANCE_ALERT_ESCALATED',
      null,
      {
        escalatedTo: contacts,
        originalSeverity: alert.severity,
        escalationTime: new Date().toISOString()
      }
    );
  }

  async resolveAlert(alertId: string, resolvedBy: string, resolution: string): Promise<void> {
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'compliance_alerts',
      alertId,
      'COMPLIANCE_ALERT_RESOLVED',
      null,
      {
        resolvedBy,
        resolution,
        resolvedAt: new Date().toISOString()
      }
    );
  }

  async getActiveAlerts(): Promise<ComplianceAlert[]> {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', 'compliance_alerts')
      .eq('action', 'COMPLIANCE_ALERT_CREATED')
      .order('created_at', { ascending: false });

    // Filter out resolved alerts
    const activeAlerts = [];
    for (const log of data || []) {
      const isResolved = await this.isAlertResolved(log.record_id);
      if (!isResolved && log.new_values && typeof log.new_values === 'object') {
        const alertData = log.new_values as Record<string, any>;
        if (alertData.alert_id) {
          activeAlerts.push({
            id: alertData.alert_id,
            type: alertData.type,
            severity: alertData.severity,
            title: alertData.title,
            description: alertData.description,
            timestamp: new Date(log.created_at),
            resolved: false,
            actionRequired: 'Review and resolve',
            affectedSystems: [],
            complianceStandard: 'HIPAA'
          } as ComplianceAlert);
        }
      }
    }

    return activeAlerts;
  }

  async updateAlertingConfig(config: Partial<AlertingConfig>): Promise<void> {
    this.alertingConfig = { ...this.alertingConfig, ...config };
    
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'system_config',
      'compliance_alerting',
      'CONFIG_UPDATED',
      null,
      {
        newConfig: this.alertingConfig,
        updatedAt: new Date().toISOString()
      }
    );
  }

  // Automated compliance monitoring
  async performAutomatedComplinceScan(): Promise<void> {
    console.log('Performing automated compliance scan...');

    // Check for unencrypted sensitive data
    await this.checkDataEncryptionCompliance();
    
    // Check for audit log gaps
    await this.checkAuditLogCoverage();
    
    // Check for access violations
    await this.checkAccessCompliance();
    
    // Check for configuration drift
    await this.checkConfigurationCompliance();
  }

  private async checkDataEncryptionCompliance(): Promise<void> {
    // Mock implementation - in production, scan for unencrypted PHI
    const unencryptedFields = 5; // Mock count
    
    if (unencryptedFields > 0) {
      await this.createComplianceAlert({
        type: 'encryption_failure',
        severity: 'high',
        title: 'Unencrypted Sensitive Data Detected',
        description: `${unencryptedFields} sensitive data fields are not encrypted`,
        actionRequired: 'Encrypt all PHI fields immediately',
        affectedSystems: ['patient_records', 'billing_system'],
        complianceStandard: 'HIPAA'
      });
    }
  }

  private async checkAuditLogCoverage(): Promise<void> {
    // Check for gaps in audit logging
    const { data } = await supabase
      .from('audit_logs')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at');

    // Look for gaps > 1 hour
    if (data && data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const gap = new Date(data[i].created_at).getTime() - new Date(data[i-1].created_at).getTime();
        if (gap > 60 * 60 * 1000) { // 1 hour gap
          await this.createComplianceAlert({
            type: 'audit_gap',
            severity: 'medium',
            title: 'Audit Log Gap Detected',
            description: `Gap in audit logging detected: ${Math.floor(gap / (60 * 1000))} minutes`,
            actionRequired: 'Investigate audit logging system',
            affectedSystems: ['audit_system'],
            complianceStandard: 'HIPAA'
          });
          break;
        }
      }
    }
  }

  private async checkAccessCompliance(): Promise<void> {
    // Check for unusual access patterns (simplified)
    const { data } = await supabase
      .from('audit_logs')
      .select('user_id, action')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()) // Last hour
      .ilike('action', '%PHI%');

    const userAccess = data?.reduce((acc, log) => {
      acc[log.user_id] = (acc[log.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Alert if any user accessed PHI more than 50 times in an hour
    for (const [userId, count] of Object.entries(userAccess)) {
      if (count > 50) {
        await this.createComplianceAlert({
          type: 'access_violation',
          severity: 'high',
          title: 'Excessive PHI Access Detected',
          description: `User ${userId} accessed PHI ${count} times in the last hour`,
          actionRequired: 'Review user access patterns and validate legitimate use',
          affectedSystems: ['ehr_system', 'patient_portal'],
          complianceStandard: 'HIPAA'
        });
      }
    }
  }

  private async checkConfigurationCompliance(): Promise<void> {
    // Mock configuration drift detection
    const configurationIssues = 0; // Mock count
    
    if (configurationIssues > 0) {
      await this.createComplianceAlert({
        type: 'configuration_drift',
        severity: 'medium',
        title: 'Configuration Drift Detected',
        description: 'Security configuration has drifted from approved baseline',
        actionRequired: 'Review and restore security configuration',
        affectedSystems: ['security_config'],
        complianceStandard: 'HIPAA'
      });
    }
  }
}

export const complianceAlerting = new ComplianceAlertingService();
