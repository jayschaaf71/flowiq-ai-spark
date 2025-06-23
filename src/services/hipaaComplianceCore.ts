
import { DataClassificationService } from './hipaa/dataClassification';
import { DataAnonymizationService } from './hipaa/dataAnonymization';
import { AIServiceConfigManager } from './hipaa/aiServiceConfig';
import { ComplianceMonitoringService } from './hipaa/complianceMonitoring';
import { AIServiceRouter } from './hipaa/aiServiceRouter';

// Re-export types for backward compatibility
export type { 
  HIPAAConfig, 
  PHIDataClassification, 
  AIServiceEndpoint 
} from './hipaa/types';

class HIPAAComplianceCore {
  private dataClassifier = new DataClassificationService();
  private dataAnonymizer = new DataAnonymizationService();
  private configManager = new AIServiceConfigManager();
  private complianceMonitor = new ComplianceMonitoringService();
  private aiRouter = new AIServiceRouter();

  // 1. Data Classification and PHI Detection
  async classifyData(data: any) {
    return this.dataClassifier.classifyData(data);
  }

  // 2. Data Anonymization for AI Processing
  async anonymizeForAI(data: any) {
    return this.dataAnonymizer.anonymizeForAI(data);
  }

  // 3. HIPAA-Compliant AI Service Router
  async routeAIRequest(
    serviceName: string,
    data: any,
    userId: string,
    requestType: string
  ) {
    return this.aiRouter.routeAIRequest(serviceName, data, userId, requestType);
  }

  // 4. Compliance Monitoring
  async getComplianceMetrics() {
    return this.complianceMonitor.getComplianceMetrics();
  }

  // 5. Breach Detection
  async detectPotentialBreach(data: any, context: any) {
    return this.complianceMonitor.detectPotentialBreach(data, context);
  }
}

export const hipaaComplianceCore = new HIPAAComplianceCore();
