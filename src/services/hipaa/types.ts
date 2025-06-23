
// HIPAA Compliance Types and Interfaces
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

export interface AuditLogMetadata {
  containsPHI?: boolean;
  sensitivityLevel?: string;
  violation?: boolean;
  [key: string]: any;
}

export function isAuditLogMetadata(obj: any): obj is AuditLogMetadata {
  return obj && typeof obj === 'object';
}
