
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  Smile, 
  Scissors, 
  Bone, 
  Activity, 
  Heart, 
  Sparkles,
  Moon,
  Calendar
} from "lucide-react";
import { PracticeType, SetupData } from "@/pages/PracticeSetup";

interface PracticeTypeStepProps {
  setupData: SetupData;
  updateSetupData: (updates: Partial<SetupData>) => void;
}

const practiceTypes = [
  {
    id: 'dental' as PracticeType,
    title: 'Dental Practice',
    description: 'General dentistry, cleanings, fillings, and oral health',
    icon: Smile,
    features: ['Appointment scheduling', 'Insurance billing', 'Patient records', 'Treatment plans']
  },
  {
    id: 'orthodontics' as PracticeType,
    title: 'Orthodontics Practice',
    description: 'Braces, aligners, and teeth straightening treatments',
    icon: Scissors,
    features: ['Treatment tracking', 'Progress photos', 'Adjustment scheduling', 'Payment plans']
  },
  {
    id: 'oral-surgery' as PracticeType,
    title: 'Oral Surgery Practice',
    description: 'Extractions, implants, and surgical procedures',
    icon: Stethoscope,
    features: ['Pre-op preparation', 'Surgical scheduling', 'Recovery tracking', 'Referral management']
  },
  {
    id: 'dental-sleep' as PracticeType,
    title: 'Dental Sleep Practice',
    description: 'Sleep apnea treatment, oral appliances, and sleep medicine',
    icon: Moon,
    features: ['Sleep studies', 'Oral appliance therapy', 'Titration tracking', 'Sleep disorder management']
  },
  {
    id: 'chiropractic' as PracticeType,
    title: 'Chiropractic Clinic',
    description: 'Spinal adjustments, pain management, and wellness',
    icon: Bone,
    features: ['Treatment plans', 'Progress tracking', 'Wellness coaching', 'Insurance claims']
  },
  {
    id: 'physical-therapy' as PracticeType,
    title: 'Physical Therapy',
    description: 'Rehabilitation, injury recovery, and movement therapy',
    icon: Activity,
    features: ['Exercise tracking', 'Progress monitoring', 'Home care plans', 'Goal setting']
  },
  {
    id: 'veterinary' as PracticeType,
    title: 'Veterinary Clinic',
    description: 'Animal healthcare, vaccinations, and treatments',
    icon: Heart,
    features: ['Pet records', 'Vaccination schedules', 'Emergency care', 'Owner communication']
  },
  {
    id: 'med-spa' as PracticeType,
    title: 'Med Spa / Aesthetic',
    description: 'Cosmetic treatments, skin care, and wellness services',
    icon: Sparkles,
    features: ['Treatment packages', 'Before/after photos', 'Consultation booking', 'Product sales']
  },
  {
    id: 'appointment-iq' as PracticeType,
    title: 'Appointment IQ',
    description: 'Standalone appointment scheduling and management system',
    icon: Calendar,
    features: ['Online booking', 'Automated reminders', 'Schedule optimization', 'Multi-provider support']
  }
];

export const PracticeTypeStep = ({ setupData, updateSetupData }: PracticeTypeStepProps) => {
  const handleSelect = (practiceType: PracticeType) => {
    updateSetupData({ practiceType });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">What type of practice do you run?</h2>
        <p className="text-gray-600">
          Choose your practice type to customize FlowIQ's AI agents for your specific needs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {practiceTypes.map((practice) => {
          const Icon = practice.icon;
          const isSelected = setupData.practiceType === practice.id;
          
          return (
            <Card 
              key={practice.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => handleSelect(practice.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{practice.title}</CardTitle>
                    {isSelected && <Badge className="mt-1 bg-blue-500">Selected</Badge>}
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {practice.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700 mb-2">Key Features:</p>
                  {practice.features.map((feature, index) => (
                    <div key={index} className="text-xs text-gray-600 flex items-center">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
