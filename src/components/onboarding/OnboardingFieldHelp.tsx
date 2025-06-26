
import React from 'react';
import { OnboardingTooltip } from './OnboardingTooltip';

interface OnboardingFieldHelpProps {
  field: string;
  specialty?: string;
}

export const OnboardingFieldHelp: React.FC<OnboardingFieldHelpProps> = ({ 
  field, 
  specialty = 'chiropractic' 
}) => {
  const getFieldHelp = () => {
    const helpText: Record<string, string> = {
      'practiceName': 'Use your official business name as it appears on your license and insurance documents. This will appear on all patient forms and communications.',
      'email': 'Use a professional email address that your team can access. This becomes your primary contact for system notifications, patient inquiries, and team communications.',
      'phone': 'Enter your main reception number. This will be used for appointment confirmations, reminders, and patient communication workflows.',
      'address': 'Your complete practice address. This will appear on intake forms, appointment confirmations, and helps patients find your location.',
      'teamMemberName': 'Enter the full name as it should appear in the system. Team members will see this name in communications and workflows.',
      'teamMemberEmail': 'Use their work email address. They\'ll receive an invitation to join your FlowIQ practice at this email.',
      'teamMemberRole': 'Choose the role that best matches their responsibilities. This determines their access levels and available features.',
      'receptionistAgent': 'The AI Receptionist handles incoming calls, schedules appointments, answers common questions, and can even qualify leads automatically.',
      'schedulingAgent': 'This agent optimizes your calendar, reduces no-shows with smart reminders, and can handle rescheduling requests automatically.',
      'billingAgent': 'Automates insurance verification, claim submissions, payment posting, and can even handle denial management and appeals.',
      'enablePayments': 'Secure payment processing lets patients pay online, in-office, or through payment plans. All transactions are HIPAA compliant.',
      'subscriptionPlan': 'Choose based on your patient volume and feature needs. You can upgrade or downgrade anytime as your practice grows.',
      'ehrSystem': 'Connect your existing EHR to sync patient data, appointments, and clinical notes. Popular systems include Epic, Cerner, AllScripts.',
      'primaryColor': 'This color will appear on your patient forms, appointment confirmations, and other patient-facing materials to match your brand.',
      'brandName': 'How you want your practice to appear to patients. This could be your DBA name or a more patient-friendly version of your business name.'
    };

    return helpText[field] || 'Additional information to help you complete this field.';
  };

  return (
    <OnboardingTooltip 
      content={getFieldHelp()} 
      type="help"
    />
  );
};
