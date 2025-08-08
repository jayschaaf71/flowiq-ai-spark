/**
 * On-Premise EHR Integration Strategy
 * Handles integration with on-premise EHR systems like EasyBIS
 */

export interface OnPremiseConfig {
  system: 'easybis' | 'dental-rem' | 'dental-sleep-solutions';
  practiceId: string;
  specialty: 'chiropractic' | 'dental-sleep' | 'general-dentistry';
  integrationMethod: 'database-connection' | 'file-export' | 'api-gateway' | 'manual-import';
  serverDetails?: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
  fileExportPath?: string;
  apiGatewayUrl?: string;
}

export interface IntegrationMethod {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  implementationTime: string;
  cost: string;
}

export class OnPremiseIntegrationStrategy {
  private config: OnPremiseConfig;

  constructor(config: OnPremiseConfig) {
    this.config = config;
  }

  /**
   * Get available integration methods for on-premise systems
   */
  getIntegrationMethods(): IntegrationMethod[] {
    return [
      {
        name: 'Database Direct Connection',
        description: 'Direct connection to the on-premise database',
        pros: [
          'Real-time data access',
          'Bidirectional sync',
          'No manual intervention required',
          'Full data access'
        ],
        cons: [
          'Requires VPN or secure network access',
          'May require database schema changes',
          'Security considerations',
          'Network dependency'
        ],
        implementationTime: '2-4 weeks',
        cost: 'Medium'
      },
      {
        name: 'File Export/Import',
        description: 'Scheduled file exports from EHR, processed by FlowIQ',
        pros: [
          'No direct database access needed',
          'Can work with any EHR system',
          'Lower security risk',
          'Easier to implement'
        ],
        cons: [
          'Not real-time (batch processing)',
          'Requires manual setup on EHR side',
          'Limited to one-way sync initially',
          'File format dependencies'
        ],
        implementationTime: '1-2 weeks',
        cost: 'Low'
      },
      {
        name: 'API Gateway',
        description: 'Custom API gateway installed on-premise',
        pros: [
          'Real-time access',
          'Secure and controlled',
          'Can handle complex transformations',
          'Bidirectional sync possible'
        ],
        cons: [
          'Requires on-premise installation',
          'More complex setup',
          'Requires IT support',
          'Higher initial cost'
        ],
        implementationTime: '3-6 weeks',
        cost: 'High'
      },
      {
        name: 'Manual Import',
        description: 'Manual data export and import process',
        pros: [
          'No technical integration required',
          'Works with any system',
          'No security concerns',
          'Immediate implementation'
        ],
        cons: [
          'Manual process required',
          'Not real-time',
          'Prone to errors',
          'Limited scalability'
        ],
        implementationTime: '1 week',
        cost: 'Very Low'
      }
    ];
  }

  /**
   * Get recommended approach for EasyBIS (Chiropractic)
   */
  getEasyBISRecommendation(): IntegrationMethod {
    return {
      name: 'File Export/Import with API Gateway',
      description: 'Hybrid approach: File exports for initial data, API gateway for real-time updates',
      pros: [
        'Works with on-premise EasyBIS server',
        'Real-time appointment updates',
        'Batch patient data sync',
        'Secure and reliable',
        'Minimal disruption to existing workflow'
      ],
      cons: [
        'Requires IT support for setup',
        'Initial configuration time',
        'Ongoing maintenance'
      ],
      implementationTime: '2-3 weeks',
      cost: 'Medium'
    };
  }

  /**
   * Get recommended approach for Dental REM (Dental Sleep)
   */
  getDentalREMRecommendation(): IntegrationMethod {
    return {
      name: 'Database Direct Connection',
      description: 'Direct connection to Dental REM database for real-time sync',
      pros: [
        'Real-time data access',
        'Full bidirectional sync',
        'Sleep study results integration',
        'DME tracking integration',
        'Compliance monitoring'
      ],
      cons: [
        'Requires VPN access to practice network',
        'Database schema analysis needed',
        'Security configuration required'
      ],
      implementationTime: '3-4 weeks',
      cost: 'Medium'
    };
  }

  /**
   * Generate implementation plan
   */
  generateImplementationPlan(): string {
    let plan = `# EHR Integration Implementation Plan\n\n`;
    
    plan += `## EasyBIS (West County Spine & Joint)\n\n`;
    plan += `**Recommended Approach:** File Export/Import with API Gateway\n\n`;
    plan += `### Phase 1: File Export Setup (Week 1)\n`;
    plan += `1. Work with practice IT to set up automated file exports\n`;
    plan += `2. Configure export schedule (daily patient updates, hourly appointments)\n`;
    plan += `3. Set up secure file transfer to FlowIQ servers\n`;
    plan += `4. Implement file processing and data transformation\n\n`;
    
    plan += `### Phase 2: API Gateway Installation (Week 2-3)\n`;
    plan += `1. Install lightweight API gateway on EasyBIS server\n`;
    plan += `2. Configure secure communication with FlowIQ\n`;
    plan += `3. Implement real-time appointment sync\n`;
    plan += `4. Test bidirectional data flow\n\n`;
    
    plan += `### Phase 3: Advanced Features (Week 4)\n`;
    plan += `1. Treatment plan integration\n`;
    plan += `2. Chiropractic notes sync\n`;
    plan += `3. Insurance information sync\n`;
    plan += `4. Staff training and go-live\n\n`;
    
    plan += `## Dental REM (Midwest Dental Sleep Medicine Institute)\n\n`;
    plan += `**Recommended Approach:** Database Direct Connection\n\n`;
    plan += `### Phase 1: Network Setup (Week 1)\n`;
    plan += `1. Establish VPN connection to practice network\n`;
    plan += `2. Analyze Dental REM database schema\n`;
    plan += `3. Set up secure database connection\n`;
    plan += `4. Implement data mapping and transformation\n\n`;
    
    plan += `### Phase 2: Core Integration (Week 2-3)\n`;
    plan += `1. Patient data synchronization\n`;
    plan += `2. Appointment scheduling sync\n`;
    plan += `3. Sleep study results integration\n`;
    plan += `4. DME tracking integration\n\n`;
    
    plan += `### Phase 3: Advanced Features (Week 4)\n`;
    plan += `1. Compliance monitoring\n`;
    plan += `2. Dental notes integration\n`;
    plan += `3. Sleep medicine notes sync\n`;
    plan += `4. Staff training and go-live\n\n`;
    
    plan += `## Technical Requirements\n\n`;
    plan += `### EasyBIS Integration:\n`;
    plan += `- File export format: CSV/JSON\n`;
    plan += `- Export frequency: Daily (patients), Hourly (appointments)\n`;
    plan += `- API Gateway: Node.js/Express server\n`;
    plan += `- Security: HTTPS, API key authentication\n\n`;
    
    plan += `### Dental REM Integration:\n`;
    plan += `- Database: SQL Server/MySQL (TBD)\n`;
    plan += `- Connection: VPN + direct database connection\n`;
    plan += `- Sync frequency: Real-time for appointments, daily for patients\n`;
    plan += `- Security: Encrypted connection, read-only access initially\n\n`;
    
    plan += `## Timeline\n\n`;
    plan += `- **Week 1:** Setup and initial configuration\n`;
    plan += `- **Week 2:** Core integration development\n`;
    plan += `- **Week 3:** Testing and refinement\n`;
    plan += `- **Week 4:** Staff training and go-live\n\n`;
    
    plan += `## Success Metrics\n\n`;
    plan += `- Patient data sync accuracy: >99%\n`;
    plan += `- Appointment sync latency: <5 minutes\n`;
    plan += `- System uptime: >99.9%\n`;
    plan += `- Staff satisfaction: >90%\n`;
    
    return plan;
  }

  /**
   * Get technical requirements for each approach
   */
  getTechnicalRequirements(): any {
    return {
      easybis: {
        fileExport: {
          required: ['Automated file export setup', 'Secure file transfer', 'Data transformation'],
          optional: ['API gateway installation', 'Real-time sync']
        },
        databaseConnection: {
          required: ['VPN access', 'Database credentials', 'Schema analysis'],
          optional: ['Direct database access', 'Real-time sync']
        }
      },
      dentalRem: {
        databaseConnection: {
          required: ['VPN access', 'Database credentials', 'Schema analysis'],
          optional: ['Direct database access', 'Real-time sync']
        },
        apiGateway: {
          required: ['On-premise server', 'API gateway installation', 'Security configuration'],
          optional: ['Real-time sync', 'Bidirectional updates']
        }
      }
    };
  }
} 