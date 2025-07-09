
import { 
  Calendar, 
  ClipboardList, 
  Bell,
  CreditCard,
  Receipt,
  MessageSquare,
  Stethoscope,
  Package,
  Eye,
  Shield,
  GraduationCap,
  UserPlus,
  TrendingUp,
  Settings,
  FileText,
  BarChart3
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
    id: 'appointment-iq',
    name: 'Appointment iQ',
    description: 'Complete appointment lifecycle management with scheduling, reminders, and follow-up',
    icon: Calendar,
    color: 'blue',
    features: ['Smart scheduling', '24/7 booking', 'Automated reminders', 'Follow-up coordination', 'No-show reduction'],
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
    id: 'billing-iq',
    name: 'Billing iQ',
    description: 'Insurance verification, invoicing, and payment processing',
    icon: CreditCard,
    color: 'purple',
    features: ['Real-time insurance verification', 'Automated invoicing', 'Payment plan management', 'Revenue tracking'],
    recommended: false,
    category: 'Financial'
  },
  {
    id: 'claims-iq',
    name: 'Claims iQ',
    description: 'Insurance claims submission, tracking, and denial management',
    icon: Receipt,
    color: 'indigo',
    features: ['Faster claim processing', 'Denial tracking & resubmission', 'Revenue optimization', 'Compliance monitoring'],
    recommended: false,
    category: 'Financial'
  },
  {
    id: 'payments-iq',
    name: 'Payments iQ',
    description: 'Payment collection, processing, and automated billing workflows',
    icon: TrendingUp,
    color: 'emerald',
    features: ['Automated payment collection', 'Payment plan management', 'Revenue optimization', 'Financial reporting'],
    recommended: false,
    category: 'Financial'
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
  },
  {
    id: 'ehr-iq',
    name: 'EHR iQ',
    description: 'Electronic health records integration and management',
    icon: FileText,
    color: 'slate',
    features: ['EHR integration', 'Patient data synchronization', 'Clinical workflow automation', 'Record management'],
    recommended: false,
    category: 'Clinical'
  },
  {
    id: 'inventory-iq',
    name: 'Inventory iQ',
    description: 'Smart inventory management and automated ordering',
    icon: Package,
    color: 'amber',
    features: ['Automated reordering', 'Vendor management', 'Cost optimization', 'Stock tracking'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'insight-iq',
    name: 'Insight iQ',
    description: 'Business intelligence and practice analytics',
    icon: BarChart3,
    color: 'violet',
    features: ['Performance analytics', 'Predictive insights', 'Custom reporting', 'Data visualization'],
    recommended: false,
    category: 'Analytics'
  },
  {
    id: 'ops-iq',
    name: 'Ops iQ',
    description: 'Operational workflow automation and system monitoring',
    icon: Settings,
    color: 'neutral',
    features: ['Workflow automation', 'System monitoring', 'Process optimization', 'Performance tracking'],
    recommended: false,
    category: 'Operations'
  },
  {
    id: 'auth-iq',
    name: 'Auth iQ',
    description: 'Advanced authentication and security management',
    icon: Shield,
    color: 'rose',
    features: ['Multi-factor authentication', 'Security monitoring', 'Access control', 'Compliance tracking'],
    recommended: false,
    category: 'Security'
  },
  {
    id: 'education-iq',
    name: 'Education iQ',
    description: 'Patient education and engagement automation',
    icon: GraduationCap,
    color: 'sky',
    features: ['Automated patient education', 'Engagement tracking', 'Custom content delivery', 'Learning pathways'],
    recommended: false,
    category: 'Patient Experience'
  },
  {
    id: 'marketing-iq',
    name: 'Marketing iQ',
    description: 'Practice marketing automation and patient acquisition',
    icon: Eye,
    color: 'pink',
    features: ['Lead generation', 'Campaign automation', 'Social media management', 'Review management'],
    recommended: false,
    category: 'Growth'
  },
  {
    id: 'referral-iq',
    name: 'Referral iQ',
    description: 'Referral management and physician relationship automation',
    icon: UserPlus,
    color: 'teal',
    features: ['Referral tracking', 'Physician outreach', 'Relationship management', 'Communication automation'],
    recommended: false,
    category: 'Growth'
  }
];