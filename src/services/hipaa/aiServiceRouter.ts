
import { AIServiceEndpoint, PHIDataClassification } from './types';
import { DataClassificationService } from './dataClassification';
import { DataAnonymizationService } from './dataAnonymization';
import { AIServiceConfigManager } from './aiServiceConfig';
import { logAuditAction } from "@/hooks/useAuditLog";

export class AIServiceRouter {
  private dataClassifier = new DataClassificationService();
  private dataAnonymizer = new DataAnonymizationService();
  private configManager = new AIServiceConfigManager();

  async routeAIRequest(
    serviceName: string,
    data: any,
    userId: string,
    requestType: string
  ): Promise<any> {
    // Validate service is approved
    const service = this.configManager.getApprovedService(serviceName);
    if (!service || !service.hipaaCompliant) {
      throw new Error(`AI service ${serviceName} is not HIPAA compliant or approved`);
    }

    // Classify data
    const classification = await this.dataClassifier.classifyData(data);
    
    // Log access attempt
    await this.logHIPAAAccess(userId, requestType, classification, serviceName);

    // Anonymize if contains PHI
    let processedData = data;
    let keyMap: Map<string, string> | null = null;

    const config = this.configManager.getConfig();
    if (classification.containsPHI && config.enableDataMinimization) {
      const result = await this.dataAnonymizer.anonymizeForAI(data);
      processedData = result.anonymizedData;
      keyMap = result.keyMap;
    }

    // Make encrypted request to AI service
    const response = await this.makeSecureAIRequest(service, processedData, classification);

    // De-anonymize response if needed
    if (keyMap) {
      response.data = this.dataAnonymizer.deAnonymizeResponse(response.data, keyMap);
    }

    // Log successful processing
    await this.logHIPAAAccess(userId, `${requestType}_completed`, classification, serviceName);

    return response;
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
}
