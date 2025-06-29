import { supabase } from "@/integrations/supabase/client";
import { isAuditLogMetadata } from './types';

export class ComplianceMonitoringService {
  async getComplianceMetrics(): Promise<any> {
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false });

    const aiInteractions = auditLogs?.filter(log => 
      log.action.includes('AI_') || log.action.includes('HIPAA_')
    ) || [];

    const phiAccessCount = aiInteractions.filter(log => {
      if (log.new_values && isAuditLogMetadata(log.new_values)) {
        return log.new_values.containsPHI === true;
      }
      return false;
    }).length;

    const violationCount = aiInteractions.filter(log => {
      if (log.new_values && isAuditLogMetadata(log.new_values)) {
        return log.new_values.violation === true;
      }
      return log.action.includes('VIOLATION');
    }).length;

    return {
      totalAIInteractions: aiInteractions.length,
      phiAccessed: phiAccessCount,
      complianceViolations: violationCount,
      auditCoverage: (aiInteractions.length / (auditLogs?.length || 1)) * 100,
      lastComplianceCheck: new Date().toISOString()
    };
  }

  async detectPotentialBreach(data: any, context: any): Promise<boolean> {
    const riskFactors = [
      context.unusualAccessPattern,
      context.offHoursAccess,
      context.bulkDataAccess,
      context.unauthorizedLocation,
      data.sensitivityLevel === 'critical'
    ];

    const riskScore = riskFactors.filter(Boolean).length;
    
    if (riskScore >= 3) {
      await this.logSecurityEvent('POTENTIAL_BREACH_DETECTED', {
        riskScore,
        riskFactors,
        timestamp: new Date().toISOString(),
        context
      });
      return true;
    }

    return false;
  }

  private async logSecurityEvent(eventType: string, details: any) {
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      eventType,
      'security_events',
      'system',
      {
        ...details,
        severity: 'high',
        requiresInvestigation: true
      }
    );
  }
}
