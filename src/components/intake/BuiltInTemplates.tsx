
// Built-in template data separated into its own file for better organization
export interface Template {
  id: string;
  name: string;
  type: 'email' | 'sms';
  category: string;
  subject?: string;
  content: string;
  variables: string[];
  usageCount: number;
  lastUsed?: string;
  isBuiltIn: boolean;
}

export const builtInTemplates: Template[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    type: 'email',
    category: 'welcome',
    subject: 'Welcome to {{practiceName}}, {{patientName}}!',
    content: `Dear {{patientName}},

Welcome to {{practiceName}}! We're excited to provide you with excellent healthcare services.

Your upcoming appointment is scheduled for {{appointmentDate}} at {{appointmentTime}} with {{doctorName}}.

Please arrive 15 minutes early to complete any remaining paperwork. If you need to reschedule, please call us at {{phoneNumber}} or use this link: {{rescheduleLink}}

Access your patient portal: {{portalLink}}

Best regards,
The {{practiceName}} Team`,
    variables: ['patientName', 'practiceName', 'appointmentDate', 'appointmentTime', 'doctorName', 'phoneNumber', 'rescheduleLink', 'portalLink'],
    usageCount: 45,
    lastUsed: '2024-03-20',
    isBuiltIn: true
  },
  {
    id: 'reminder-sms',
    name: 'Appointment Reminder SMS',
    type: 'sms',
    category: 'reminder',
    content: 'Hi {{firstName}}, reminder: you have an appointment tomorrow at {{appointmentTime}} with {{doctorName}}. Reply CONFIRM to confirm or CANCEL to reschedule. {{practiceName}}',
    variables: ['firstName', 'appointmentTime', 'doctorName', 'practiceName'],
    usageCount: 128,
    lastUsed: '2024-03-22',
    isBuiltIn: true
  },
  {
    id: 'confirmation-email',
    name: 'Appointment Confirmation',
    type: 'email',
    category: 'confirmation',
    subject: 'Appointment Confirmed - {{appointmentDate}}',
    content: `Dear {{patientName}},

Your appointment has been confirmed!

📅 Date: {{appointmentDate}}
🕐 Time: {{appointmentTime}}
👨‍⚕️ Provider: {{doctorName}}
📍 Location: {{address}}

What to bring:
• Insurance card
• Photo ID
• List of current medications

If you need to make changes, please contact us at {{phoneNumber}} or click here: {{rescheduleLink}}

Thank you,
{{practiceName}}`,
    variables: ['patientName', 'appointmentDate', 'appointmentTime', 'doctorName', 'address', 'phoneNumber', 'rescheduleLink', 'practiceName'],
    usageCount: 67,
    lastUsed: '2024-03-21',
    isBuiltIn: true
  },
  {
    id: 'follow-up-email',
    name: 'Follow-up Care Instructions',
    type: 'email',
    category: 'follow-up',
    subject: 'Follow-up Instructions - {{patientName}}',
    content: `Dear {{patientName}},

Thank you for your visit to {{practiceName}} today with {{doctorName}}.

Please follow these important instructions:
• Take medications as prescribed
• Follow up in 2 weeks or as discussed
• Contact us immediately if you experience any concerning symptoms

Schedule your follow-up appointment: {{portalLink}}

Questions? Call us at {{phoneNumber}}

Best wishes for your recovery,
{{practiceName}} Team`,
    variables: ['patientName', 'practiceName', 'doctorName', 'portalLink', 'phoneNumber'],
    usageCount: 23,
    lastUsed: '2024-03-19',
    isBuiltIn: true
  }
];
