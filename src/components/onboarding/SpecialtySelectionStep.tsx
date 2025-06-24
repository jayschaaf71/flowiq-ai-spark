
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Moon, 
  Sparkles, 
  Crown, 
  Zap,
  CheckCircle
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface SpecialtySelectionStepProps {
  selectedSpecialty: SpecialtyType | null;
  onSelectSpecialty: (specialty: SpecialtyType) => void;
}

const specialtyIcons = {
  chiropractic: Activity,
  dental_sleep: Moon,
  med_spa: Sparkles,
  concierge: Crown,
  hrt: Zap
};

export const SpecialtySelectionStep = ({ selectedSpecialty, onSelectSpecialty }: SpecialtySelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">What's Your Specialty?</h2>
        <p className="text-gray-600 text-lg">
          We'll customize FlowIQ's AI agents, forms, and workflows specifically for your practice type.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(specialtyConfigs).map(([key, config]) => {
          const Icon = specialtyIcons[key as SpecialtyType];
          const isSelected = selectedSpecialty === key;
          
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected 
                  ? 'ring-2 border-2' 
                  : 'border hover:border-gray-300'
              }`}
              style={{
                borderColor: isSelected ? config.primaryColor : undefined,
                backgroundColor: isSelected ? `${config.primaryColor}08` : undefined
              }}
              onClick={() => onSelectSpecialty(key as SpecialtyType)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`p-3 rounded-xl ${isSelected ? 'text-white' : 'text-gray-600'}`}
                      style={{ 
                        backgroundColor: isSelected ? config.primaryColor : '#f3f4f6' 
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{config.brandName}</CardTitle>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle 
                      className="w-6 h-6 text-white p-1 rounded-full" 
                      style={{ backgroundColor: config.primaryColor }}
                    />
                  )}
                </div>
                <CardDescription className="text-base">
                  {config.specialtyFocus}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium text-sm mb-2">What you'll get:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: config.primaryColor }}></div>
                      AI agents trained for {config.brandName.toLowerCase()}
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: config.primaryColor }}></div>
                      Pre-built intake forms
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: config.primaryColor }}></div>
                      Custom workflows & automation
                    </li>
                    <li className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: config.primaryColor }}></div>
                      Industry-specific analytics
                    </li>
                  </ul>
                </div>
                
                <div className="pt-2">
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${config.primaryColor}15`,
                      color: config.primaryColor 
                    }}
                  >
                    {config.tagline}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSpecialty && (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-green-700 font-medium">
            ✓ Perfect! We'll set up FlowIQ for {specialtyConfigs[selectedSpecialty].brandName}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Your specialty will be locked in during setup to ensure consistent branding and workflows.
          </p>
        </div>
      )}
    </div>
  );
};
