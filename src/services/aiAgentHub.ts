
import { getTenantConfig, TenantType } from '@/utils/tenantConfig';

export interface AgentRequest {
  agentType: 'schedule' | 'intake';
  action: string;
  payload: any;
  tenant?: TenantType;
  context?: {
    visitType?: string;
    patientHistory?: any;
    calendarConstraints?: any;
    formData?: any;
    visitContext?: any;
  };
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  recommendations?: string[];
}

class AIAgentHub {
  private getVerticalPrompt(agentType: 'schedule' | 'intake', tenant: TenantType): string {
    const config = getTenantConfig(tenant);
    
    const basePrompts = {
      schedule: {
        chiro: `You are Schedule iQ for ${config.brandName}, specialized in chiropractic appointment scheduling.
        
Key considerations for chiropractic scheduling:
- Initial consultations require 60-90 minutes
- Adjustment sessions are typically 30-45 minutes
- Consider patient's pain level and mobility when scheduling
- Allow buffer time between intensive treatments
- Factor in treatment frequency (some patients need multiple weekly visits)
- Consider provider specializations (sports injury, pediatric, elderly care)

Available visit types: ${config.visitTypes.join(', ')}

When recommending slots, consider:
1. Patient's current pain level and urgency
2. Treatment history and frequency
3. Provider availability and specialization
4. Time needed for specific treatments
5. Patient's work schedule and mobility constraints`,

        dental: `You are Schedule iQ for ${config.brandName}, specialized in dental appointment scheduling.

Key considerations for dental scheduling:
- Regular cleanings are 60 minutes
- Consultations are 30 minutes
- Complex procedures (root canals, crowns) need 90-120 minutes
- Consider patient anxiety levels
- Allow prep time for surgical procedures
- Factor in recovery time recommendations

Available visit types: ${config.visitTypes.join(', ')}

When recommending slots, consider:
1. Treatment complexity and duration required
2. Patient's dental history and risk factors
3. Provider specialization and availability
4. Preparation time needed for procedures
5. Patient's comfort level and scheduling preferences`,

        default: `You are Schedule iQ, an AI scheduling assistant.
        
Available visit types: ${config.visitTypes.join(', ')}
        
Consider patient needs, provider availability, and appointment requirements when scheduling.`
      },
      
      intake: {
        chiro: `You are Intake iQ for ${config.brandName}, specialized in chiropractic patient intake.

Focus areas for chiropractic intake:
- Pain assessment (location, intensity, duration, triggers)
- Injury history and mechanism of injury
- Previous chiropractic/physical therapy treatments
- Work-related activities and ergonomics
- Exercise habits and physical activities
- Current medications and supplements
- Insurance coverage for chiropractic care

When processing intake forms, prioritize:
1. Chief complaint and pain assessment
2. Red flag symptoms requiring immediate attention
3. Treatment history and previous responses
4. Lifestyle factors affecting recovery
5. Patient goals and expectations

Summarize key findings for the chiropractor's review.`,

        dental: `You are Intake iQ for ${config.brandName}, specialized in dental patient intake.

Focus areas for dental intake:
- Dental history and previous treatments
- Current dental concerns and symptoms
- Oral hygiene habits and frequency
- Dietary habits affecting oral health
- Medical conditions affecting dental treatment
- Medications that may impact procedures
- Insurance coverage and treatment authorization

When processing intake forms, prioritize:
1. Chief dental complaint and symptoms
2. Medical conditions requiring special considerations
3. Previous dental work and experiences
4. Risk factors for dental disease
5. Patient anxiety levels and comfort needs

Summarize key findings for the dentist's review.`,

        default: `You are Intake iQ, an AI patient intake assistant.
        
Process patient intake forms and provide summaries for healthcare provider review.
Focus on medical history, current concerns, and relevant patient information.`
      }
    };

    return basePrompts[agentType][tenant] || basePrompts[agentType].default;
  }

  async processRequest(request: AgentRequest): Promise<AgentResponse> {
    try {
      const tenant = request.tenant || 'default';
      const systemPrompt = this.getVerticalPrompt(request.agentType, tenant);
      
      // This would connect to your OpenAI/Claude API
      // For now, returning mock responses based on agent type and action
      
      if (request.agentType === 'schedule') {
        return this.handleScheduleRequest(request, systemPrompt);
      } else if (request.agentType === 'intake') {
        return this.handleIntakeRequest(request, systemPrompt);
      }
      
      throw new Error('Unknown agent type');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async handleScheduleRequest(request: AgentRequest, systemPrompt: string): Promise<AgentResponse> {
    const { action, payload, context } = request;
    
    switch (action) {
      case 'recommend_slots':
        // AI logic would go here using systemPrompt + context
        return {
          success: true,
          data: {
            recommendedSlots: [
              { date: '2024-01-15', time: '10:00', reasoning: 'Optimal for initial consultation' },
              { date: '2024-01-15', time: '14:00', reasoning: 'Alternative afternoon slot' },
              { date: '2024-01-16', time: '09:00', reasoning: 'Early morning availability' }
            ]
          },
          recommendations: [
            'Consider morning appointments for better pain management',
            'Allow extra time for initial consultation',
            'Book follow-up appointment 3-5 days after initial treatment'
          ]
        };
        
      case 'reschedule':
        return {
          success: true,
          data: { newSlot: payload.preferredSlot, confirmationId: 'SCH-' + Date.now() }
        };
        
      default:
        throw new Error('Unknown schedule action');
    }
  }

  private async handleIntakeRequest(request: AgentRequest, systemPrompt: string): Promise<AgentResponse> {
    const { action, payload, context } = request;
    
    switch (action) {
      case 'process_form':
        // AI processing would happen here
        const summary = this.generateFormSummary(payload.formData, request.tenant);
        return {
          success: true,
          data: {
            summary,
            flaggedItems: payload.formData.redFlags || [],
            completionScore: 95
          }
        };
        
      case 'generate_form':
        const config = getTenantConfig(request.tenant);
        return {
          success: true,
          data: {
            formTemplate: config.formTemplates[0],
            fields: this.getVerticalFormFields(request.tenant)
          }
        };
        
      default:
        throw new Error('Unknown intake action');
    }
  }

  private generateFormSummary(formData: any, tenant?: TenantType): string {
    // This would use AI to generate intelligent summaries
    // Mock implementation based on tenant type
    
    if (tenant === 'chiro') {
      return `Chief Complaint: ${formData.chiefComplaint || 'Lower back pain'}
Pain Level: ${formData.painLevel || '7/10'}
Duration: ${formData.duration || '3 weeks'}
Previous Treatment: ${formData.previousTreatment || 'None'}
Key Findings: Patient reports acute onset following lifting incident.`;
    } else if (tenant === 'dental') {
      return `Chief Complaint: ${formData.chiefComplaint || 'Tooth pain'}
Last Cleaning: ${formData.lastCleaning || '6 months ago'}
Medical Conditions: ${formData.medicalConditions || 'None reported'}
Medications: ${formData.medications || 'None'}
Key Findings: Patient reports sensitivity to cold and sweet foods.`;
    }
    
    return 'Patient intake completed successfully.';
  }

  private getVerticalFormFields(tenant?: TenantType): any[] {
    if (tenant === 'chiro') {
      return [
        { type: 'text', label: 'Chief Complaint', required: true },
        { type: 'range', label: 'Pain Level (1-10)', required: true },
        { type: 'select', label: 'Pain Location', options: ['Neck', 'Upper Back', 'Lower Back', 'Other'] },
        { type: 'date', label: 'When did pain start?', required: true },
        { type: 'textarea', label: 'How did the injury occur?' },
        { type: 'checkbox', label: 'Previous Treatments', options: ['Chiropractic', 'Physical Therapy', 'Massage', 'Medication'] }
      ];
    } else if (tenant === 'dental') {
      return [
        { type: 'text', label: 'Chief Complaint', required: true },
        { type: 'date', label: 'Last Dental Cleaning' },
        { type: 'select', label: 'Reason for Visit', options: ['Cleaning', 'Pain', 'Checkup', 'Cosmetic'] },
        { type: 'checkbox', label: 'Symptoms', options: ['Pain', 'Sensitivity', 'Bleeding Gums', 'Bad Breath'] },
        { type: 'textarea', label: 'Medical History' },
        { type: 'text', label: 'Current Medications' }
      ];
    }
    
    return [
      { type: 'text', label: 'Name', required: true },
      { type: 'email', label: 'Email', required: true },
      { type: 'textarea', label: 'Reason for Visit' }
    ];
  }
}

export const aiAgentHub = new AIAgentHub();
