
import { supabase } from '@/integrations/supabase/client';

export interface SystemMetrics {
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  responseTime: number;
  errorRate: number;
  throughput: number;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: keyof SystemMetrics;
  threshold: number;
  operator: '>' | '<' | '=' | '>=' | '<=';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  cooldownMinutes: number;
}

export interface MonitoringEvent {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'critical';
  service: string;
  message: string;
  metadata?: Record<string, any>;
}

export class MonitoringService {
  private metrics: SystemMetrics = {
    uptime: 99.9,
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    activeConnections: 0,
    responseTime: 0,
    errorRate: 0,
    throughput: 0
  };

  private alertRules: AlertRule[] = [
    {
      id: '1',
      name: 'High CPU Usage',
      metric: 'cpuUsage',
      threshold: 80,
      operator: '>',
      severity: 'high',
      enabled: true,
      cooldownMinutes: 15
    },
    {
      id: '2',
      name: 'High Error Rate',
      metric: 'errorRate',
      threshold: 5,
      operator: '>',
      severity: 'critical',
      enabled: true,
      cooldownMinutes: 5
    },
    {
      id: '3',
      name: 'Slow Response Time',
      metric: 'responseTime',
      threshold: 2000,
      operator: '>',
      severity: 'medium',
      enabled: true,
      cooldownMinutes: 10
    }
  ];

  async collectMetrics(): Promise<SystemMetrics> {
    // Simulate metric collection
    this.metrics = {
      uptime: 99.8 + Math.random() * 0.2,
      cpuUsage: Math.random() * 100,
      memoryUsage: 40 + Math.random() * 40,
      diskUsage: 30 + Math.random() * 20,
      activeConnections: Math.floor(Math.random() * 1000),
      responseTime: 100 + Math.random() * 500,
      errorRate: Math.random() * 2,
      throughput: 500 + Math.random() * 500
    };

    await this.evaluateAlerts();
    await this.logMetrics();

    return this.metrics;
  }

  private async evaluateAlerts(): Promise<void> {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      const currentValue = this.metrics[rule.metric];
      const shouldAlert = this.evaluateThreshold(currentValue, rule.threshold, rule.operator);

      if (shouldAlert) {
        await this.triggerAlert(rule, currentValue);
      }
    }
  }

  private evaluateThreshold(value: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case '>': return value > threshold;
      case '<': return value < threshold;
      case '>=': return value >= threshold;
      case '<=': return value <= threshold;
      case '=': return Math.abs(value - threshold) < 0.001;
      default: return false;
    }
  }

  private async triggerAlert(rule: AlertRule, currentValue: number): Promise<void> {
    const event: MonitoringEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level: rule.severity === 'critical' ? 'critical' : 'warning',
      service: 'system',
      message: `Alert: ${rule.name} - Current value: ${currentValue.toFixed(2)}, Threshold: ${rule.threshold}`,
      metadata: {
        rule: rule.name,
        metric: rule.metric,
        currentValue,
        threshold: rule.threshold
      }
    };

    await this.logEvent(event);
    
    // Send notifications based on severity
    if (rule.severity === 'critical') {
      await this.sendCriticalAlert(event);
    }
  }

  private async logMetrics(): Promise<void> {
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'system_metrics',
      'monitoring',
      'METRICS_COLLECTED',
      null,
      {
        ...this.metrics,
        timestamp: new Date().toISOString()
      }
    );
  }

  private async logEvent(event: MonitoringEvent): Promise<void> {
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'monitoring_events',
      event.id,
      'MONITORING_EVENT',
      null,
      {
        ...event,
        timestamp: event.timestamp.toISOString()
      }
    );
  }

  private async sendCriticalAlert(event: MonitoringEvent): Promise<void> {
    console.log('CRITICAL MONITORING ALERT:', event);
    // In production, integrate with PagerDuty, Slack, SMS, etc.
  }

  async getMetrics(): Promise<SystemMetrics> {
    return this.metrics;
  }

  async getRecentEvents(limit: number = 50): Promise<MonitoringEvent[]> {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', 'monitoring_events')
      .order('created_at', { ascending: false })
      .limit(limit);

    return (data || []).map(log => ({
      id: log.record_id,
      timestamp: new Date(log.created_at),
      level: log.new_values?.level || 'info',
      service: log.new_values?.service || 'unknown',
      message: log.new_values?.message || 'No message',
      metadata: log.new_values?.metadata
    }));
  }

  async updateAlertRule(ruleId: string, updates: Partial<AlertRule>): Promise<void> {
    const ruleIndex = this.alertRules.findIndex(rule => rule.id === ruleId);
    if (ruleIndex !== -1) {
      this.alertRules[ruleIndex] = { ...this.alertRules[ruleIndex], ...updates };
      
      const { logAuditAction } = await import("@/hooks/useAuditLog");
      await logAuditAction(
        'alert_rules',
        ruleId,
        'ALERT_RULE_UPDATED',
        null,
        {
          ruleId,
          updates,
          timestamp: new Date().toISOString()
        }
      );
    }
  }

  getAlertRules(): AlertRule[] {
    return this.alertRules;
  }
}

export const monitoringService = new MonitoringService();
