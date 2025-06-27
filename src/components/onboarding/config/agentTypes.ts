
import { 
  Calendar, 
  ClipboardList, 
  Bell,
  CreditCard,
  Receipt,
  MessageSquare,
  Stethoscope
} from 'lucide-react';

export interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  recommended: boolean;
  category: string;
}

export const agentTypes: AgentType[] = [
  {
    id: 'schedule-iq',
    name: 'Schedule iQ',
    description: 'Automate appointment booking, rescheduling, and calendar management',
    icon: Calendar,
    color: 'blue',
    features: ['Reduces double bookings', '24/7 online booking', 'Smart scheduling optimization', 'Calendar integration'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'intake-iq',
    name: 'Intake iQ',
    description: 'Digital intake forms, consent collection, and patient onboarding',
    icon: ClipboardList,
    color: 'green',
    features: ['Paperless intake process', 'E-signature collection', 'HIPAA compliant forms', 'Auto form pre-population'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'remind-iq',
    name: 'Reminders iQ',
    description: 'Automated appointment reminders and follow-up communications',
    icon: Bell,
    color: 'orange',
    features: ['Reduces no-shows by 40%', 'Customizable reminder templates', 'Multi-channel messaging', 'Smart timing'],
    recommended: true,
    category: 'Essential'
  },
  {
    id: 'billing-iq',
    name: 'Billing iQ',
    description: 'Insurance verification, invoicing, and payment processing',
    icon: CreditCard,
    color: 'purple',
    features: ['Real-time insurance verification', 'Automated invoicing', 'Payment plan management', 'Revenue tracking'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'claims-iq',
    name: 'Claims iQ',
    description: 'Insurance claims submission, tracking, and denial management',
    icon: Receipt,
    color: 'indigo',
    features: ['Faster claim processing', 'Denial tracking & resubmission', 'Revenue optimization', 'Compliance monitoring'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'assist-iq',
    name: 'Assist iQ',
    description: 'AI-powered staff assistant for questions and workflow guidance',
    icon: MessageSquare,
    color: 'cyan',
    features: ['Instant staff support', 'Workflow optimization tips', 'Best practice recommendations', '24/7 availability'],
    recommended: false,
    category: 'Support'
  },
  {
    id: 'scribe-iq',
    name: 'Scribe iQ',
    description: 'AI medical scribe for appointment notes and documentation',
    icon: Stethoscope,
    color: 'red',
    features: ['Automated documentation', 'Voice-to-text transcription', 'Template generation', 'SOAP note creation'],
    recommended: false,
    category: 'Clinical'
  }
];
