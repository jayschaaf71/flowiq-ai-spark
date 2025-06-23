
import { HIPAAConfig, AIServiceEndpoint } from './types';

export class AIServiceConfigManager {
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

  getConfig(): HIPAAConfig {
    return this.config;
  }

  getApprovedService(serviceName: string): AIServiceEndpoint | undefined {
    return this.approvedAIServices.get(serviceName);
  }

  getAllApprovedServices(): Map<string, AIServiceEndpoint> {
    return this.approvedAIServices;
  }

  isServiceApproved(serviceName: string): boolean {
    const service = this.approvedAIServices.get(serviceName);
    return service ? service.hipaaCompliant : false;
  }
}
