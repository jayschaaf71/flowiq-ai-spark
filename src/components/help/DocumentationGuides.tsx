import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  Play, 
  Settings, 
  Users, 
  MessageCircle, 
  Calendar,
  CreditCard,
  FileText,
  Smartphone,
  Shield,
  ArrowRight,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface GuideSection {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  content: string[];
  videoUrl?: string;
}

const documentationGuides: Record<string, GuideSection[]> = {
  'getting-started': [
    {
      id: 'setup-practice',
      title: 'Setting Up Your Practice',
      duration: '10 min',
      difficulty: 'Beginner',
      description: 'Complete walkthrough of initial practice setup and configuration',
      content: [
        '1. Complete the Practice Setup wizard during onboarding',
        '2. Configure your practice details, specialty, and basic information',
        '3. Select and configure AI agents that match your workflow needs',
        '4. Set up integrations with your existing calendar, EHR, and payment systems',
        '5. Invite team members and assign appropriate roles and permissions',
        '6. Customize your patient portal branding and communication preferences',
        '7. Test all integrations and review your setup before going live'
      ]
    },
    {
      id: 'user-roles',
      title: 'Understanding User Roles & Permissions',
      duration: '8 min',
      difficulty: 'Beginner',
      description: 'Learn about different user roles and their access levels',
      content: [
        'Administrator: Full access to all features, settings, and user management',
        'Provider: Access to patient records, scheduling, clinical features, and billing',
        'Staff: Access to scheduling, patient intake, basic billing, and communication tools',
        'Front Desk: Limited access to scheduling, check-in, and basic patient information',
        'Billing: Specialized access to claims, payments, and financial reporting',
        'Patient: Portal access to their own records, appointments, and communications'
      ]
    }
  ],
  'ai-agents': [
    {
      id: 'intake-iq',
      title: 'Intake IQ - Smart Patient Forms',
      duration: '15 min',
      difficulty: 'Beginner',
      description: 'Master voice-enabled forms and AI-powered patient intake',
      content: [
        '• Create custom intake forms with drag-and-drop builder',
        '• Enable voice input for hands-free form completion',
        '• Set up conditional logic and smart form branching',
        '• Configure automated follow-up and reminder sequences',
        '• Review and process AI-generated patient summaries',
        '• Integrate with your EHR for seamless data transfer',
        '• Monitor form completion rates and patient engagement analytics'
      ]
    },
    {
      id: 'schedule-iq',
      title: 'Schedule IQ - AI Scheduling Assistant',
      duration: '12 min',
      difficulty: 'Intermediate',
      description: 'Automate appointment booking with intelligent scheduling',
      content: [
        '• Configure provider availability and appointment types',
        '• Set up intelligent conflict detection and resolution',
        '• Enable automated appointment reminders via SMS and email',
        '• Use AI-powered scheduling suggestions and optimization',
        '• Handle patient rescheduling requests automatically',
        '• Manage waitlists and automatic appointment filling',
        '• Generate provider schedules and appointment summaries'
      ]
    },
    {
      id: 'scribe-iq',
      title: 'Scribe IQ - AI Clinical Documentation',
      duration: '18 min',
      difficulty: 'Advanced',
      description: 'Generate SOAP notes automatically from voice recordings',
      content: [
        '• Connect compatible recording devices for high-quality audio',
        '• Start voice recording during patient consultations',
        '• Review AI-generated SOAP notes and clinical summaries',
        '• Edit and approve documentation before finalizing',
        '• Set up templates for different appointment types',
        '• Configure billing code suggestions based on documentation',
        '• Integrate with EHR systems for seamless record keeping'
      ]
    },
    {
      id: 'claims-iq',
      title: 'Claims IQ - Automated Insurance Processing',
      duration: '20 min',
      difficulty: 'Advanced',
      description: 'Streamline insurance claims with AI validation',
      content: [
        '• Set up payer integrations and clearinghouse connections',
        '• Configure automated eligibility verification',
        '• Enable AI-powered claims validation and error detection',
        '• Process claims submissions and track status automatically',
        '• Handle denials with intelligent resubmission workflows',
        '• Monitor revenue cycle analytics and performance metrics',
        '• Generate compliance reports and audit trails'
      ]
    }
  ],
  'features': [
    {
      id: 'voice-features',
      title: 'Voice-Enabled Features',
      duration: '14 min',
      difficulty: 'Intermediate',
      description: 'Leverage voice technology across all FlowIQ features',
      content: [
        '• Voice-enabled patient intake forms for hands-free completion',
        '• AI voice recording and transcription for clinical documentation',
        '• Voice commands for navigation and quick actions',
        '• Multi-language voice support for diverse patient populations',
        '• Quality settings and noise reduction optimization',
        '• Privacy and security considerations for voice data',
        '• Troubleshooting common voice recognition issues'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Mobile Application Guide',
      duration: '16 min',
      difficulty: 'Beginner',
      description: 'Use FlowIQ effectively on mobile devices and tablets',
      content: [
        '• Download and install the FlowIQ mobile app',
        '• Mobile-optimized patient intake and registration',
        '• Provider mobile dashboard and patient management',
        '• Mobile appointment scheduling and calendar management',
        '• Secure messaging and communication features',
        '• Offline functionality and data synchronization',
        '• Push notifications and mobile alert preferences'
      ]
    },
    {
      id: 'patient-portal',
      title: 'Patient Portal Configuration',
      duration: '12 min',
      difficulty: 'Intermediate',
      description: 'Set up and customize the patient-facing portal',
      content: [
        '• Customize portal branding with your practice logo and colors',
        '• Configure patient registration and onboarding workflows',
        '• Set up appointment booking and rescheduling capabilities',
        '• Enable secure messaging between patients and staff',
        '• Configure document upload and sharing permissions',
        '• Set up payment processing and billing transparency',
        '• Monitor patient engagement and portal usage analytics'
      ]
    }
  ],
  'integrations': [
    {
      id: 'ehr-integration',
      title: 'EHR Integration Setup',
      duration: '25 min',
      difficulty: 'Advanced',
      description: 'Connect your existing EHR system with FlowIQ',
      content: [
        '• Supported EHR systems and integration capabilities',
        '• API configuration and authentication setup',
        '• Data mapping and field synchronization',
        '• Patient record synchronization and conflict resolution',
        '• Clinical workflow integration and data flow',
        '• Testing integration and troubleshooting common issues',
        '• Maintaining data integrity and HIPAA compliance'
      ]
    },
    {
      id: 'payment-systems',
      title: 'Payment System Integration',
      duration: '18 min',
      difficulty: 'Intermediate',
      description: 'Set up payment processing and billing workflows',
      content: [
        '• Configure credit card processing and payment gateways',
        '• Set up automated billing and payment schedules',
        '• Enable patient payment portal and online billing',
        '• Configure insurance claim processing and submissions',
        '• Set up payment plans and financial assistance programs',
        '• Generate financial reports and payment analytics',
        '• Handle payment disputes and refund processing'
      ]
    },
    {
      id: 'calendar-sync',
      title: 'Calendar Synchronization',
      duration: '10 min',
      difficulty: 'Beginner',
      description: 'Sync FlowIQ with Google Calendar, Outlook, and other systems',
      content: [
        '• Connect Google Calendar for two-way synchronization',
        '• Set up Outlook integration and calendar sharing',
        '• Configure calendar preferences and availability rules',
        '• Handle appointment conflicts and double-booking prevention',
        '• Set up automated calendar invites and updates',
        '• Manage multiple provider calendars and scheduling coordination'
      ]
    }
  ],
  'compliance': [
    {
      id: 'hipaa-compliance',
      title: 'HIPAA Compliance & Security',
      duration: '22 min',
      difficulty: 'Advanced',
      description: 'Ensure your practice meets all HIPAA requirements',
      content: [
        '• Understanding HIPAA requirements and FlowIQ compliance features',
        '• Configure user access controls and audit logging',
        '• Set up encrypted communication and data storage',
        '• Implement business associate agreements and documentation',
        '• Regular security assessments and compliance monitoring',
        '• Incident response procedures and breach notification',
        '• Staff training requirements and compliance documentation'
      ]
    },
    {
      id: 'data-backup',
      title: 'Data Backup & Recovery',
      duration: '15 min',
      difficulty: 'Intermediate',
      description: 'Protect your practice data with automated backups',
      content: [
        '• Automated daily backups and data protection policies',
        '• Understanding data retention and storage locations',
        '• Testing backup integrity and recovery procedures',
        '• Disaster recovery planning and business continuity',
        '• Data export options and practice transition planning',
        '• Compliance requirements for data backup and storage'
      ]
    }
  ]
};

export const DocumentationGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState<GuideSection | null>(null);
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started': return <Play className="w-4 h-4" />;
      case 'ai-agents': return <Settings className="w-4 h-4" />;
      case 'features': return <Star className="w-4 h-4" />;
      case 'integrations': return <ArrowRight className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (selectedGuide) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedGuide(null)}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Back to Guides
            </Button>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(selectedGuide.difficulty)}>
                {selectedGuide.difficulty}
              </Badge>
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {selectedGuide.duration}
              </Badge>
            </div>
          </div>
          <CardTitle className="text-xl">{selectedGuide.title}</CardTitle>
          <CardDescription>{selectedGuide.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="space-y-4">
              {selectedGuide.videoUrl && (
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <Play className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600">Video tutorial available</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Watch Video Guide
                  </Button>
                </div>
              )}
              
              <div className="space-y-3">
                {selectedGuide.content.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800 mb-3">
                  If you need assistance with this guide, our AI Assistant can provide real-time help.
                </p>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Documentation Center
        </CardTitle>
        <CardDescription>
          Comprehensive guides, tutorials, and reference materials for FlowIQ
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="getting-started" className="flex items-center gap-1 text-xs">
              <Play className="w-3 h-3" />
              Getting Started
            </TabsTrigger>
            <TabsTrigger value="ai-agents" className="flex items-center gap-1 text-xs">
              <Settings className="w-3 h-3" />
              AI Agents
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3" />
              Features
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-1 text-xs">
              <ArrowRight className="w-3 h-3" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-1 text-xs">
              <Shield className="w-3 h-3" />
              Compliance
            </TabsTrigger>
          </TabsList>

          {Object.entries(documentationGuides).map(([category, guides]) => (
            <TabsContent key={category} value={category} className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-4">
                  {guides.map((guide) => (
                    <Card 
                      key={guide.id} 
                      className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                      onClick={() => setSelectedGuide(guide)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-base">{guide.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getDifficultyColor(guide.difficulty)} variant="outline">
                              {guide.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              <Clock className="w-3 h-3 mr-1" />
                              {guide.duration}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <CheckCircle className="w-3 h-3" />
                            {guide.content.length} steps included
                          </div>
                          <Button variant="outline" size="sm">
                            View Guide
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};