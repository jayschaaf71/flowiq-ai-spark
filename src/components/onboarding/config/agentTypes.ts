
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
    id: 'communication-iq',
    name: 'Communication iQ',
    description: 'Complete patient communication platform including scheduling, intake, follow-up, and appointment management',
    icon: MessageSquare,
    color: 'blue',
    features: ['Multi-channel messaging', 'Smart scheduling', 'Digital intake', 'Automated follow-ups', 'Appointment management', 'No-show reduction'],
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
    description: 'Insurance authorization and prior approval management',
    icon: Shield,
    color: 'rose',
    features: ['Prior authorization tracking', 'Insurance verification', 'Approval workflows', 'Compliance monitoring'],
    recommended: false,
    category: 'Financial'
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
    id: 'go-to-market-iq',
    name: 'Go-To-Market iQ',
    description: 'Comprehensive marketing and sales automation for practice growth',
    icon: TrendingUp,
    color: 'pink',
    features: ['Lead generation', 'Sales automation', 'Campaign management', 'Social media', 'Review management', 'Patient acquisition'],
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