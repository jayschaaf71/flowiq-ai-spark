import { supabase } from '@/integrations/supabase/client';

export interface UnifiedCommunicationRequest {
    channel: 'email' | 'sms' | 'voice';
    recipient: string;
    template?: string;
    data?: Record<string, string>;
    meta?: {
        userId?: string;
        practiceId?: string;
        source?: string;
        direction?: 'outbound' | 'inbound';
        patientId?: string;
        appointmentId?: string;
    };
    customMessage?: string;
    subject?: string;
}

export interface UnifiedCommunicationResponse {
    success: boolean;
    channel: 'email' | 'sms' | 'voice';
    recipient: string;
    messageId?: string;
    status: 'sent' | 'failed';
    details?: any;
    error?: string;
}

export interface CommunicationTemplate {
    id: string;
    name: string;
    channel: 'email' | 'sms' | 'voice';
    subject?: string;
    content: string;
    variables: string[];
}

export class UnifiedCommunicationService {

    /**
     * Send a communication through the unified hub
     */
    static async sendCommunication(request: UnifiedCommunicationRequest): Promise<UnifiedCommunicationResponse> {
        try {
            const { data, error } = await supabase.functions.invoke('communications-hub', {
                body: request
            });

            if (error) {
                throw new Error(error.message);
            }

            return data as UnifiedCommunicationResponse;
        } catch (error: any) {
            console.error('Error sending communication:', error);
            return {
                success: false,
                channel: request.channel,
                recipient: request.recipient,
                status: 'failed',
                error: error.message
            };
        }
    }

    /**
     * Send SMS with template
     */
    static async sendSMSWithTemplate(
        recipient: string,
        template: string,
        data: Record<string, string>,
        meta?: any
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendCommunication({
            channel: 'sms',
            recipient,
            template,
            data,
            meta
        });
    }

    /**
     * Send SMS with custom message
     */
    static async sendSMSWithCustomMessage(
        recipient: string,
        message: string,
        meta?: any
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendCommunication({
            channel: 'sms',
            recipient,
            customMessage: message,
            meta
        });
    }

    /**
     * Send email with template
     */
    static async sendEmailWithTemplate(
        recipient: string,
        template: string,
        data: Record<string, string>,
        meta?: any
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendCommunication({
            channel: 'email',
            recipient,
            template,
            data,
            meta
        });
    }

    /**
     * Send email with custom message
     */
    static async sendEmailWithCustomMessage(
        recipient: string,
        subject: string,
        message: string,
        meta?: any
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendCommunication({
            channel: 'email',
            recipient,
            customMessage: message,
            subject,
            meta
        });
    }

    /**
     * Send voice call with template
     */
    static async sendVoiceWithTemplate(
        recipient: string,
        template: string,
        data: Record<string, string>,
        meta?: any
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendCommunication({
            channel: 'voice',
            recipient,
            template,
            data,
            meta
        });
    }

    /**
     * Send voice call with custom message
     */
    static async sendVoiceWithCustomMessage(
        recipient: string,
        message: string,
        meta?: any
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendCommunication({
            channel: 'voice',
            recipient,
            customMessage: message,
            meta
        });
    }

    /**
     * Get available templates
     */
    static async getTemplates(): Promise<CommunicationTemplate[]> {
        try {
            const { data, error } = await supabase
                .from('communication_templates')
                .select('*')
                .order('name');

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching templates:', error);
            return [];
        }
    }

    /**
     * Create a new template
     */
    static async createTemplate(template: Omit<CommunicationTemplate, 'id'>): Promise<CommunicationTemplate | null> {
        try {
            const { data, error } = await supabase
                .from('communication_templates')
                .insert(template)
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            console.error('Error creating template:', error);
            return null;
        }
    }

    /**
     * Get communication logs
     */
    static async getCommunicationLogs(filters?: {
        channel?: 'email' | 'sms' | 'voice';
        status?: 'sent' | 'failed' | 'pending';
        patientId?: string;
        limit?: number;
    }): Promise<any[]> {
        try {
            let query = supabase
                .from('communication_logs')
                .select('*')
                .order('sent_at', { ascending: false });

            if (filters?.channel) {
                query = query.eq('type', filters.channel);
            }

            if (filters?.status) {
                query = query.eq('status', filters.status);
            }

            if (filters?.patientId) {
                query = query.eq('patient_id', filters.patientId);
            }

            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error fetching communication logs:', error);
            return [];
        }
    }

    /**
     * Send appointment reminder
     */
    static async sendAppointmentReminder(
        patientName: string,
        patientEmail: string,
        patientPhone: string,
        appointmentDate: string,
        appointmentTime: string,
        providerName: string,
        practiceName: string,
        practicePhone: string
    ): Promise<{
        email?: UnifiedCommunicationResponse;
        sms?: UnifiedCommunicationResponse;
    }> {
        const data = {
            patient_name: patientName,
            date: appointmentDate,
            time: appointmentTime,
            provider_name: providerName,
            practice_name: practiceName,
            phone: practicePhone
        };

        const results: any = {};

        // Send email reminder
        if (patientEmail) {
            results.email = await this.sendEmailWithTemplate(
                patientEmail,
                'appointment_reminder_email',
                data,
                {
                    source: 'scheduler',
                    direction: 'outbound'
                }
            );
        }

        // Send SMS reminder
        if (patientPhone) {
            results.sms = await this.sendSMSWithTemplate(
                patientPhone,
                'appointment_reminder_sms',
                data,
                {
                    source: 'scheduler',
                    direction: 'outbound'
                }
            );
        }

        return results;
    }

    /**
     * Send welcome message
     */
    static async sendWelcomeMessage(
        patientName: string,
        patientEmail: string,
        practiceName: string,
        practicePhone: string
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendEmailWithTemplate(
            patientEmail,
            'welcome_email',
            {
                patient_name: patientName,
                practice_name: practiceName,
                phone: practicePhone
            },
            {
                source: 'onboarding',
                direction: 'outbound'
            }
        );
    }

    /**
     * Send follow-up call
     */
    static async sendFollowUpCall(
        patientName: string,
        patientPhone: string,
        practiceName: string,
        practicePhone: string
    ): Promise<UnifiedCommunicationResponse> {
        return this.sendVoiceWithTemplate(
            patientPhone,
            'follow_up_voice',
            {
                patient_name: patientName,
                practice_name: practiceName,
                phone: practicePhone
            },
            {
                source: 'follow_up',
                direction: 'outbound'
            }
        );
    }
} 