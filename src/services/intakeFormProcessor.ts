
import { supabase } from '@/integrations/supabase/client';
import { validateFields, calculateFormCompleteness, getRequiredFieldsStatus } from '@/components/intake/FormValidation';

interface FormSubmissionData {
  patient_name: string;
  patient_email: string;
  patient_phone?: string;
  form_data: Record<string, any>;
}

interface ProcessingResult {
  success: boolean;
  submissionId?: string;
  aiSummary?: string;
  priorityLevel?: string;
  errors?: string[];
  completeness?: number;
  missingFields?: string[];
}

export class IntakeFormProcessor {
  static async processFormSubmission(
    formId: string,
    formFields: any[],
    submissionData: FormSubmissionData
  ): Promise<ProcessingResult> {
    try {
      console.log('Processing form submission:', { formId, submissionData });

      // Validate form data
      const validationErrors = validateFields(formFields, submissionData.form_data);
      if (Object.keys(validationErrors).length > 0) {
        return {
          success: false,
          errors: Object.values(validationErrors)
        };
      }

      // Calculate form completeness
      const completeness = calculateFormCompleteness(formFields, submissionData.form_data);
      const requiredStatus = getRequiredFieldsStatus(formFields, submissionData.form_data);

      // Generate AI summary
      const aiSummary = this.generateAISummary(submissionData.form_data);
      
      // Determine priority level
      const priorityLevel = this.calculatePriorityLevel(submissionData.form_data);

      // Submit to database
      const { data: submission, error } = await supabase
        .from('intake_submissions')
        .insert({
          form_id: formId,
          patient_name: submissionData.patient_name,
          patient_email: submissionData.patient_email,
          patient_phone: submissionData.patient_phone,
          form_data: submissionData.form_data,
          ai_summary: aiSummary,
          priority_level: priorityLevel,
          status: completeness === 100 ? 'completed' : 'partial'
        })
        .select()
        .single();

      if (error) {
        console.error('Database submission error:', error);
        throw error;
      }

      // Track analytics
      await this.trackFormCompletion(formId, submission.id, completeness);

      // Send notifications if high priority
      if (priorityLevel === 'high') {
        await this.sendPriorityNotification(submission);
      }

      return {
        success: true,
        submissionId: submission.id,
        aiSummary,
        priorityLevel,
        completeness,
        missingFields: requiredStatus.missing.map(f => f.label)
      };

    } catch (error) {
      console.error('Form processing error:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      };
    }
  }

  static generateAISummary(formData: Record<string, any>): string {
    // Extract key information for summary
    const keyFields = [
      'chief_complaint',
      'symptoms',
      'pain_level',
      'medical_history',
      'current_medications',
      'allergies',
      'emergency_contact'
    ];

    const summary: string[] = [];

    if (formData.chief_complaint) {
      summary.push(`Chief Complaint: ${formData.chief_complaint}`);
    }

    if (formData.pain_level) {
      summary.push(`Pain Level: ${formData.pain_level}/10`);
    }

    if (formData.symptoms && Array.isArray(formData.symptoms)) {
      summary.push(`Symptoms: ${formData.symptoms.join(', ')}`);
    }

    if (formData.medical_history) {
      summary.push(`Medical History: ${formData.medical_history}`);
    }

    if (formData.current_medications) {
      summary.push(`Current Medications: ${formData.current_medications}`);
    }

    if (formData.allergies) {
      summary.push(`Allergies: ${formData.allergies}`);
    }

    // Add demographic info
    if (formData.age) {
      summary.push(`Age: ${formData.age}`);
    }

    if (formData.insurance_provider) {
      summary.push(`Insurance: ${formData.insurance_provider}`);
    }

    return summary.length > 0 ? summary.join('\n') : 'Patient intake form completed.';
  }

  static calculatePriorityLevel(formData: Record<string, any>): string {
    let priorityScore = 0;

    // High priority indicators
    if (formData.pain_level && parseInt(formData.pain_level) >= 8) {
      priorityScore += 3;
    }

    if (formData.symptoms && Array.isArray(formData.symptoms)) {
      const emergencySymptoms = ['severe pain', 'chest pain', 'difficulty breathing', 'severe bleeding'];
      const hasEmergencySymptoms = formData.symptoms.some((symptom: string) =>
        emergencySymptoms.some(emergency => symptom.toLowerCase().includes(emergency))
      );
      if (hasEmergencySymptoms) {
        priorityScore += 4;
      }
    }

    if (formData.urgent_care && formData.urgent_care === 'yes') {
      priorityScore += 2;
    }

    if (formData.referred_by && formData.referred_by.includes('Emergency')) {
      priorityScore += 3;
    }

    // Determine priority level
    if (priorityScore >= 4) {
      return 'high';
    } else if (priorityScore >= 2) {
      return 'medium';
    } else {
      return 'normal';
    }
  }

  static async trackFormCompletion(formId: string, submissionId: string, completeness: number) {
    try {
      await supabase
        .from('intake_analytics')
        .insert({
          form_id: formId,
          submission_id: submissionId,
          event_type: completeness === 100 ? 'form_completed' : 'form_partially_completed',
          tenant_type: 'default',
          metadata: {
            completeness_percentage: completeness,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  static async sendPriorityNotification(submission: any) {
    // This would integrate with your notification system
    console.log('High priority submission detected:', submission.id);
    
    // For now, just log - in production you'd send email/SMS/push notifications
    try {
      await supabase
        .from('intake_analytics')
        .insert({
          form_id: submission.form_id,
          submission_id: submission.id,
          event_type: 'priority_notification_sent',
          tenant_type: 'default',
          metadata: {
            priority_level: submission.priority_level,
            notification_type: 'high_priority_alert',
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Priority notification error:', error);
    }
  }

  static async getSubmissionAnalytics(formId?: string) {
    try {
      let query = supabase
        .from('intake_analytics')
        .select('*')
        .order('created_at', { ascending: false });

      if (formId) {
        query = query.eq('form_id', formId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        analytics: data
      };
    } catch (error) {
      console.error('Analytics fetch error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
