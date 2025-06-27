
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Stethoscope, 
  Moon, 
  Sparkles, 
  Heart,
  Activity,
  CheckCircle
} from 'lucide-react';

export type SpecialtyType = 'chiropractic' | 'dental-sleep' | 'med-spa' | 'concierge' | 'hrt';

interface SpecialtyOption {
  id: SpecialtyType;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  features: string[];
  popular?: boolean;
}

interface SpecialtySelectionStepProps {
  selectedSpecialty: SpecialtyType | null;
  onSelectSpecialty: (specialty: SpecialtyType) => void;
}

const specialtyOptions: SpecialtyOption[] = [
  {
    id: 'chiropractic',
    title: 'Chiropractic Care',
    description: 'Comprehensive spine and musculoskeletal health management',
    icon: Activity,
    color: 'blue',
    features: ['SOAP Note Generation', 'Treatment Plans', 'Progress Tracking', 'Insurance Claims'],
    popular: true
  },
  {
    id: 'dental-sleep',
    title: 'Dental Sleep Medicine',
    description: 'Sleep apnea treatment and oral appliance therapy',
    icon: Moon,
    color: 'indigo',
    features: ['Sleep Study Integration', 'Appliance Tracking', 'Follow-up Automation', 'DME Billing']
  },
  {
    id: 'med-spa',
    title: 'Medical Spa',
    description: 'Aesthetic treatments and wellness services',
    icon: Sparkles,
    color: 'pink',
    features: ['Treatment Packages', 'Before/After Photos', 'Membership Management', 'Product Sales']
  },
  {
    id: 'concierge',
    title: 'Concierge Medicine',
    description: 'Personalized primary care and wellness',
    icon: Heart,
    color: 'green',
    features: ['24/7 Access', 'House Calls', 'Executive Physicals', 'Preventive Care']
  },
  {
    id: 'hrt',
    title: 'Hormone Replacement Therapy',
    description: 'Hormone optimization and anti-aging medicine',
    icon: Stethoscope,
    color: 'purple',
    features: ['Lab Integration', 'Treatment Monitoring', 'Compounding Pharmacy', 'Telehealth']
  }
];

export const SpecialtySelectionStep: React.FC<SpecialtySelectionStepProps> = ({
  selectedSpecialty,
  onSelectSpecialty
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">What type of practice do you run?</h2>
        <p className="text-gray-600">
          Select your specialty to customize FlowIQ for your specific needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specialtyOptions.map((specialty) => {
          const Icon = specialty.icon;
          const isSelected = selectedSpecialty === specialty.id;
          
          return (
            <Card
              key={specialty.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectSpecialty(specialty.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${specialty.color}-100`}>
                      <Icon className={`w-5 h-5 text-${specialty.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{specialty.title}</CardTitle>
                      {specialty.popular && (
                        <Badge variant="secondary" className="mt-1">
                          Most Popular
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">
                  {specialty.description}
                </CardDescription>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Key Features:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {specialty.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSpecialty && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="w-4 h-4" />
            <span className="font-medium">Great choice!</span>
          </div>
          <p className="text-sm text-green-700 mt-1">
            FlowIQ will be customized for your {specialtyOptions.find(s => s.id === selectedSpecialty)?.title.toLowerCase()} practice.
          </p>
        </div>
      )}
    </div>
  );
};
