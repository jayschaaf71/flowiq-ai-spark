import { supabase } from '@/integrations/supabase/client';
import { CommunicationService } from './communicationService';

export interface BillNotificationRequest {
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  billAmount: number;
  billDescription: string;
  dueDate: string;
  appointmentId?: string;
  sendEmail?: boolean;
  sendSMS?: boolean;
  sendInApp?: boolean;
}

export interface BillTemplate {
  email: {
    subject: string;
    content: string;
  };
  sms: {
    message: string;
  };
  inApp: {
    title: string;
    message: string;
  };
}

export class BillingCommunicationService {
  static generateBillTemplate(request: BillNotificationRequest): BillTemplate {
    const { patientName, billAmount, billDescription, dueDate } = request;
    
    return {
      email: {
        subject: `Your Bill is Ready - Amount Due: $${billAmount.toFixed(2)}`,
        content: `
          <h2>Your Bill is Ready</h2>
          <p>Dear ${patientName},</p>
          <p>We hope you had a positive experience during your recent visit. Your bill is now available and ready for payment.</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #007bff;">
            <h3 style="margin: 0 0 10px 0; color: #333;">Bill Summary</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${billDescription}</p>
            <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${billAmount.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Due Date:</strong> ${new Date(dueDate).toLocaleDateString()}</p>
          </div>
          
          <p><strong>Payment Options:</strong></p>
          <ul>
            <li>Pay online through your patient portal</li>
            <li>Call our office at (555) 123-4567</li>
            <li>Pay in person during business hours</li>
          </ul>
          
          <p>If you have any questions about this bill or need to set up a payment plan, please don't hesitate to contact our billing department.</p>
          
          <p>Thank you for choosing our practice for your healthcare needs.</p>
          
          <br>
          <p>Best regards,<br>
          Your Healthcare Team<br>
          Billing Department</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            This is an automated message. Please do not reply to this email. 
            For billing inquiries, please contact our billing department directly.
          </p>
        `
      },
      sms: {
        message: `Hi ${patientName}, your bill of $${billAmount.toFixed(2)} for ${billDescription} is due ${new Date(dueDate).toLocaleDateString()}. Pay online via your patient portal or call (555) 123-4567. Reply STOP to opt out.`
      },
      inApp: {
        title: `New Bill Available - $${billAmount.toFixed(2)}`,
        message: `Your bill for ${billDescription} is ready. Amount due: $${billAmount.toFixed(2)} by ${new Date(dueDate).toLocaleDateString()}. Tap to view and pay.`
      }
    };
  }

  static async sendBillNotification(request: BillNotificationRequest) {
    const template = this.generateBillTemplate(request);
    const results = [];

    try {
      // Send email notification
      if (request.sendEmail !== false && request.patientEmail) {
        try {
          const emailResult = await CommunicationService.sendCommunication({
            submissionId: request.appointmentId || 'bill-notification',
            templateId: 'bill-notification-email',
            recipient: request.patientEmail,
            patientName: request.patientName,
            customMessage: template.email.content,
            type: 'email'
          });
          
          results.push({
            type: 'email',
            status: 'sent',
            result: emailResult
          });
        } catch (error) {
          console.error('Email sending failed:', error);
          results.push({
            type: 'email',
            status: 'failed',
            error: error.message
          });
        }
      }

      // Send SMS notification
      if (request.sendSMS && request.patientPhone) {
        try {
          const smsResult = await CommunicationService.sendCommunication({
            submissionId: request.appointmentId || 'bill-notification',
            templateId: 'bill-notification-sms',
            recipient: request.patientPhone,
            patientName: request.patientName,
            customMessage: template.sms.message,
            type: 'sms'
          });
          
          results.push({
            type: 'sms',
            status: 'sent',
            result: smsResult
          });
        } catch (error) {
          console.error('SMS sending failed:', error);
          results.push({
            type: 'sms',
            status: 'failed',
            error: error.message
          });
        }
      }

      // Create in-app notification
      if (request.sendInApp !== false) {
        try {
          const { data, error } = await supabase
            .from('patient_notifications')
            .insert({
              patient_id: request.patientId,
              type: 'billing',
              title: template.inApp.title,
              message: template.inApp.message,
              metadata: {
                bill_amount: request.billAmount,
                due_date: request.dueDate,
                appointment_id: request.appointmentId,
                bill_description: request.billDescription
              },
              priority: 'high',
              is_read: false
            });

          if (error) throw error;

          results.push({
            type: 'in_app',
            status: 'sent',
            result: data
          });
        } catch (error) {
          console.error('In-app notification failed:', error);
          results.push({
            type: 'in_app',
            status: 'failed',
            error: error.message
          });
        }
      }

      // Log the bill notification activity
      await this.logBillNotification(request, results);

      return {
        success: true,
        results,
        totalSent: results.filter(r => r.status === 'sent').length,
        totalFailed: results.filter(r => r.status === 'failed').length
      };

    } catch (error) {
      console.error('Bill notification error:', error);
      throw error;
    }
  }

  static async logBillNotification(request: BillNotificationRequest, results: any[]) {
    try {
      // Mock log bill notification since table doesn't exist yet
      console.log('Mock logging bill notification:', {
        patient_id: request.patientId,
        appointment_id: request.appointmentId,
        bill_amount: request.billAmount,
        bill_description: request.billDescription,
        due_date: request.dueDate,
          notification_channels: results.map(r => r.type),
          delivery_results: results,
          total_sent: results.filter(r => r.status === 'sent').length,
          total_failed: results.filter(r => r.status === 'failed').length
        });
    } catch (error) {
      console.error('Failed to log bill notification:', error);
      // Don't throw here as the main notification was successful
    }
  }

  static async sendBillReminder(request: BillNotificationRequest & { isReminder: boolean }) {
    const reminderTemplate = {
      email: {
        subject: `Payment Reminder - Bill Due: $${request.billAmount.toFixed(2)}`,
        content: `
          <h2>Payment Reminder</h2>
          <p>Dear ${request.patientName},</p>
          <p>This is a friendly reminder that you have an outstanding bill that requires your attention.</p>
          
          <div style="background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h3 style="margin: 0 0 10px 0; color: #856404;">Outstanding Bill</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${request.billDescription}</p>
            <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${request.billAmount.toFixed(2)}</p>
            <p style="margin: 5px 0;"><strong>Original Due Date:</strong> ${new Date(request.dueDate).toLocaleDateString()}</p>
          </div>
          
          <p>To avoid any late fees or account holds, please make your payment as soon as possible.</p>
          
          <p><strong>Quick Payment Options:</strong></p>
          <ul>
            <li><strong>Online:</strong> Log into your patient portal to pay instantly</li>
            <li><strong>Phone:</strong> Call (555) 123-4567 to pay over the phone</li>
            <li><strong>In Person:</strong> Visit our office during business hours</li>
          </ul>
          
          <p>If you're experiencing financial difficulties, please contact our billing department to discuss payment plan options.</p>
          
          <br>
          <p>Thank you for your prompt attention to this matter.</p>
          <p>Best regards,<br>
          Your Healthcare Team<br>
          Billing Department</p>
        `
      },
      sms: {
        message: `REMINDER: ${request.patientName}, your bill of $${request.billAmount.toFixed(2)} is overdue. Please pay via patient portal or call (555) 123-4567 to avoid late fees. Reply STOP to opt out.`
      },
      inApp: {
        title: `Payment Reminder - $${request.billAmount.toFixed(2)} Overdue`,
        message: `Your payment for ${request.billDescription} is past due. Please pay $${request.billAmount.toFixed(2)} to avoid late fees.`
      }
    };

    return await this.sendBillNotification({
      ...request,
      sendEmail: true,
      sendSMS: true,
      sendInApp: true
    });
  }

  static async getBillNotificationHistory(patientId: string) {
    try {
      // Mock get bill notification history since table doesn't exist yet
      console.log('Mock fetching bill notification history for patient:', patientId);
      return [];
    } catch (error) {
      console.error('Failed to get bill notification history:', error);
      return [];
    }
  }
}