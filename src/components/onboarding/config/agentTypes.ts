
import { 
  CreditCard,
  MessageSquare,
  Stethoscope,
  Package,
  Shield,
  GraduationCap,
  TrendingUp,
  Settings,
  FileText,
  BarChart3,
  Database,
  DollarSign
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
    description: 'Seamless integration bridge with existing EHR and practice management systems',
    icon: Database,
    color: 'cyan',
    features: ['EHR Integration', 'Data Sync', 'Appointment Bridge', 'Clinical Documentation Hub'],
    recommended: false,
    category: 'Clinical'
  },
  {
    id: 'revenue-iq',
    name: 'Revenue iQ',
    description: 'Comprehensive payment processing, billing, and revenue management',
    icon: DollarSign,
    color: 'emerald',
    features: ['Payment Processing', 'Automated Billing', 'Revenue Analytics', 'Invoice Management'],
    recommended: false,
    category: 'Financial'
  },
  {
    id: 'insurance-iq',
    name: 'Insurance iQ',
    description: 'Complete insurance verification, claims processing, and authorization management',
    icon: Shield,
    color: 'indigo',
    features: ['Claims Processing', 'Prior Authorization', 'Eligibility Verification', 'Denial Management'],
    recommended: false,
    category: 'Financial'
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
    id: 'growth-iq',
    name: 'Growth iQ',
    description: 'Comprehensive marketing, patient acquisition, and practice growth platform',
    icon: TrendingUp,
    color: 'pink',
    features: ['Lead generation', 'Marketing campaigns', 'Referral tracking', 'Growth analytics'],
    recommended: false,
    category: 'Growth'
  }
];