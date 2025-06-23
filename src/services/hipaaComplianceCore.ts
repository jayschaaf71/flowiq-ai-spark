import { supabase } from "@/integrations/supabase/client";
import { logAuditAction } from "@/hooks/useAuditLog";

// HIPAA Compliance Configuration
export interface HIPAAConfig {
  enableDataMinimization: boolean;
  requireBAA: boolean;
  encryptionRequired: boolean;
  auditAllAccess: boolean;
  dataRetentionDays: number;
  allowedAIServices: string[];
}

export interface PHIDataClassification {
  containsPHI: boolean;
  dataTypes: string[];
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  requiresEncryption: boolean;
  auditRequired: boolean;
}

export interface AIServiceEndpoint {
  serviceName: string;
  endpoint: string;
  hasBAA: boolean;
  hipaaCompliant: boolean;
  encryptionSupported: boolean;
  dataProcessingLocation: string;
}

// Type guard for audit log metadata
interface AuditLogMetadata {
  containsPHI?: boolean;
  sensitivityLevel?: string;
  violation?: boolean;
  [key: string]: any;
}

function isAuditLogMetadata(obj: any): obj is AuditLogMetadata {
  return obj && typeof obj === 'object';
}

class HIPAAComplianceCore {
  private config: HIPAAConfig = {
    enableDataMinimization: true,
    requireBAA: true,
    encryptionRequired: true,
    auditAllAccess: true,
    dataRetentionDays: 2555, // 7 years as per HIPAA
    allowedAIServices: ['openai-enterprise', 'azure-ai-health', 'google-cloud-healthcare']
  };

  private approvedAIServices: Map<string, AIServiceEndpoint> = new Map([
    ['openai-enterprise', {
      serviceName: 'OpenAI Enterprise',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      hasBAA: true,
      hipaaCompliant: true,
      encryptionSupported: true,
      dataProcessingLocation: 'US'
    }],
    ['azure-ai-health', {
      serviceName: 'Azure AI for Healthcare',
      endpoint: 'https://api.cognitive.microsoft.com/health',
      hasBAA: true,
      hipaaCompliant: true,
      encryptionSupported: true,
      dataProcessingLocation: 'US'
    }],
    ['google-cloud-healthcare', {
      serviceName: 'Google Cloud Healthcare AI',
      endpoint: 'https://healthcare.googleapis.com/v1/nlp',
      hasBAA: true,
      hipaaCompliant: true,
      encryptionSupported: true,
      dataProcessingLocation: 'US'
    }]
  ]);

  // 1. Data Classification and PHI Detection
  async classifyData(data: any): Promise<PHIDataClassification> {
    const phiIndicators = [
      'ssn', 'social_security', 'date_of_birth', 'dob', 'phone', 'email',
      'address', 'medical_record', 'patient_id', 'diagnosis', 'medication',
      'treatment', 'insurance', 'emergency_contact'
    ];

    const dataString = JSON.stringify(data).toLowerCase();
    const containsPHI = phiIndicators.some(indicator => 
      dataString.includes(indicator) || Object.keys(data).some(key => 
        key.toLowerCase().includes(indicator)
      )
    );

    const dataTypes: string[] = [];
    if (dataString.includes('medical') || dataString.includes('diagnosis')) dataTypes.push('medical');
    if (dataString.includes('financial') || dataString.includes('insurance')) dataTypes.push('financial');
    if (dataString.includes('demographic') || dataString.includes('address')) dataTypes.push('demographic');

    const sensitivityLevel = this.determineSensitivityLevel(data, containsPHI);

    return {
      containsPHI,
      dataTypes,
      sensitivityLevel,
      requiresEncryption: containsPHI || sensitivityLevel === 'high' || sensitivityLevel === 'critical',
      auditRequired: containsPHI || sensitivityLevel !== 'low'
    };
  }

  // 2. Data Anonymization for AI Processing
  async anonymizeForAI(data: any): Promise<{ anonymizedData: any; keyMap: Map<string, string> }> {
    const keyMap = new Map<string, string>();
    const anonymizedData = { ...data };

    // Replace PHI with tokens
    const phiFields = ['patient_name', 'email', 'phone', 'ssn', 'address', 'emergency_contact'];
    
    phiFields.forEach(field => {
      if (data[field]) {
        const token = `TOKEN_${field.toUpperCase()}_${this.generateSecureToken()}`;
        keyMap.set(token, data[field]);
        anonymizedData[field] = token;
      }
    });

    // Anonymize nested objects
    Object.keys(anonymizedData).forEach(key => {
      if (typeof anonymizedData[key] === 'object' && anonymizedData[key] !== null) {
        const nested = this.anonymizeNestedObject(anonymizedData[key], keyMap);
        anonymizedData[key] = nested;
      }
    });

    return { anonymizedData, keyMap };
  }

  // 3. HIPAA-Compliant AI Service Router
  async routeAIRequest(
    serviceName: string,
    data: any,
    userId: string,
    requestType: string
  ): Promise<any> {
    // Validate service is approved
    const service = this.approvedAIServices.get(serviceName);
    if (!service || !service.hipaaCompliant) {
      throw new Error(`AI service ${serviceName} is not HIPAA compliant or approved`);
    }

    // Classify data
    const classification = await this.classifyData(data);
    
    // Log access attempt
    await this.logHIPAAAccess(userId, requestType, classification, serviceName);

    // Anonymize if contains PHI
    let processedData = data;
    let keyMap: Map<string, string> | null = null;

    if (classification.containsPHI && this.config.enableDataMinimization) {
      const result = await this.anonymizeForAI(data);
      processedData = result.anonymizedData;
      keyMap = result.keyMap;
    }

    // Make encrypted request to AI service
    const response = await this.makeSecureAIRequest(service, processedData, classification);

    // De-anonymize response if needed
    if (keyMap) {
      response.data = this.deAnonymizeResponse(response.data, keyMap);
    }

    // Log successful processing
    await this.logHIPAAAccess(userId, `${requestType}_completed`, classification, serviceName);

    return response;
  }

  // 4. Compliance Monitoring
  async getComplianceMetrics(): Promise<any> {
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select('*')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours
      .order('created_at', { ascending: false });

    const aiInteractions = auditLogs?.filter(log => 
      log.action.includes('AI_') || log.action.includes('HIPAA_')
    ) || [];

    // Fixed: Properly handle Json type with type guards
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

  // 5. Breach Detection
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

  // Private helper methods
  private determineSensitivityLevel(data: any, containsPHI: boolean): 'low' | 'medium' | 'high' | 'critical' {
    if (containsPHI) {
      const criticalFields = ['ssn', 'medical_record', 'diagnosis', 'treatment'];
      const hasCritical = criticalFields.some(field => 
        JSON.stringify(data).toLowerCase().includes(field)
      );
      return hasCritical ? 'critical' : 'high';
    }
    return 'medium';
  }

  private generateSecureToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private anonymizeNestedObject(obj: any, keyMap: Map<string, string>): any {
    const anonymized = { ...obj };
    Object.keys(anonymized).forEach(key => {
      if (typeof anonymized[key] === 'string' && this.isPotentialPHI(anonymized[key])) {
        const token = `TOKEN_${key.toUpperCase()}_${this.generateSecureToken()}`;
        keyMap.set(token, anonymized[key]);
        anonymized[key] = token;
      }
    });
    return anonymized;
  }

  private isPotentialPHI(value: string): boolean {
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[\w._%+-]+@[\w.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
    ];
    return phiPatterns.some(pattern => pattern.test(value));
  }

  private async makeSecureAIRequest(service: AIServiceEndpoint, data: any, classification: PHIDataClassification) {
    // This would make the actual encrypted request to the AI service
    // For now, return a mock response
    return {
      data: { response: 'AI processed response', encrypted: classification.requiresEncryption },
      service: service.serviceName,
      timestamp: new Date().toISOString()
    };
  }

  private deAnonymizeResponse(response: any, keyMap: Map<string, string>): any {
    let responseStr = JSON.stringify(response);
    keyMap.forEach((originalValue, token) => {
      responseStr = responseStr.replace(new RegExp(token, 'g'), originalValue);
    });
    return JSON.parse(responseStr);
  }

  private async logHIPAAAccess(
    userId: string,
    action: string,
    classification: PHIDataClassification,
    serviceName: string
  ) {
    await logAuditAction(
      'ai_hipaa_access',
      userId,
      `HIPAA_${action}`,
      null,
      {
        containsPHI: classification.containsPHI,
        sensitivityLevel: classification.sensitivityLevel,
        aiService: serviceName,
        timestamp: new Date().toISOString(),
        complianceNote: 'AI access logged for HIPAA compliance'
      }
    );
  }

  private async logSecurityEvent(eventType: string, details: any) {
    await logAuditAction(
      'security_events',
      'system',
      eventType,
      null,
      {
        ...details,
        severity: 'high',
        requiresInvestigation: true
      }
    );
  }
}

export const hipaaComplianceCore = new HIPAAComplianceCore();
