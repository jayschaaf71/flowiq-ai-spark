
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Star, Users, Zap, FileText } from 'lucide-react';

interface OnboardingStepGuideProps {
  step: string;
  specialty?: string;
}

export const OnboardingStepGuide: React.FC<OnboardingStepGuideProps> = ({ step, specialty = 'chiropractic' }) => {
  const getStepGuide = () => {
    switch (step) {
      case 'specialty':
        return {
          title: '🎯 Choose Your Practice Type',
          description: 'This helps us customize FlowIQ specifically for your needs',
          tips: [
            'Each specialty has pre-built templates and workflows',
            'You can always add additional specialties later',
            'Custom configurations are available for unique practices'
          ],
          examples: [
            { label: 'Chiropractic', desc: 'SOAP notes, treatment plans, billing codes' },
            { label: 'Med Spa', desc: 'Consent forms, treatment tracking, aftercare' },
            { label: 'Dental Sleep', desc: 'Sleep studies, appliance tracking, insurance' }
          ]
        };

      case 'practice':
        return {
          title: '🏢 Practice Information',
          description: 'We\'ll use this information across all your forms and communications',
          tips: [
            'Use your official business name for professional forms',
            'Phone number will be used for appointment reminders',
            'Email address becomes your primary contact for the system'
          ],
          examples: [
            { label: 'Practice Name', desc: '"Smith Family Chiropractic" or "Downtown Wellness Center"' },
            { label: 'Professional Email', desc: 'info@yourpractice.com (avoid personal emails)' },
            { label: 'Main Phone', desc: 'Your reception desk number for patient contact' }
          ]
        };

      case 'team':
        return {
          title: '👥 Team Setup',
          description: 'Add your team members to collaborate on patient care and operations',
          tips: [
            'Team members get instant access when they accept invitations',
            'Different roles have different permissions and access levels',
            'You can always add more team members later from settings'
          ],
          examples: [
            { label: 'Providers', desc: 'Doctors, nurses, therapists - full clinical access' },
            { label: 'Staff', desc: 'Receptionists, assistants - scheduling and admin' },
            { label: 'Admin', desc: 'Office managers - billing, reporting, settings' }
          ]
        };

      case 'agents':
        return {
          title: '🤖 AI Agents',
          description: 'Choose which AI agents will help automate your practice operations',
          tips: [
            'Start with one or two agents and add more as you get comfortable',
            'Each agent can be customized for your specific workflows',
            'AI agents learn from your practice patterns over time'
          ],
          examples: [
            { label: 'Receptionist Agent', desc: 'Handles calls, schedules appointments, answers FAQs' },
            { label: 'Billing Agent', desc: 'Automates claims, tracks payments, handles insurance' },
            { label: 'Scheduling Agent', desc: 'Optimizes appointments, reduces no-shows' }
          ]
        };

      case 'payment':
        return {
          title: '💳 Payment Processing',
          description: 'Enable secure payment processing for seamless patient transactions',
          tips: [
            'Choose a plan that fits your current patient volume',
            'You can upgrade or downgrade anytime based on your needs',
            'All payment processing is HIPAA compliant and secure'
          ],
          examples: [
            { label: 'Starter Plan', desc: 'Perfect for solo practitioners or small clinics' },
            { label: 'Professional Plan', desc: 'Ideal for growing practices with multiple providers' },
            { label: 'Enterprise Plan', desc: 'Full-featured for large practices and clinics' }
          ]
        };

      default:
        return {
          title: '✨ Setup Progress',
          description: 'You\'re building your intelligent practice management system',
          tips: [
            'Each step builds on the previous one',
            'Your progress is automatically saved',
            'You can always go back and make changes'
          ],
          examples: []
        };
    }
  };

  const guide = getStepGuide();

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">{guide.title}</h3>
            <p className="text-blue-700 text-sm leading-relaxed">{guide.description}</p>
          </div>

          {guide.tips.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <Star className="w-4 h-4 mr-1" />
                Quick Tips
              </h4>
              <ul className="space-y-1">
                {guide.tips.map((tip, index) => (
                  <li key={index} className="text-xs text-blue-600 flex items-start">
                    <CheckCircle className="w-3 h-3 mr-2 mt-0.5 flex-shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guide.examples.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Examples
              </h4>
              <div className="space-y-2">
                {guide.examples.map((example, index) => (
                  <div key={index} className="bg-white/50 rounded-lg p-2">
                    <div className="text-xs font-medium text-blue-800">{example.label}</div>
                    <div className="text-xs text-blue-600">{example.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
