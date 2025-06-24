
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';
import { Stethoscope, Moon, Heart, Brain, Eye, Bone } from "lucide-react";

interface SpecialtySelectionStepProps {
  selectedSpecialty: SpecialtyType | null;
  onSelectSpecialty: (specialty: SpecialtyType) => void;
}

const specialtyIcons = {
  chiropractic: Bone,
  'dental-sleep': Moon,
  cardiology: Heart,
  neurology: Brain,
  ophthalmology: Eye,
  'general-medicine': Stethoscope
};

export const SpecialtySelectionStep: React.FC<SpecialtySelectionStepProps> = ({
  selectedSpecialty,
  onSelectSpecialty
}) => {
  const availableSpecialties = Object.keys(specialtyConfigs) as SpecialtyType[];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Select Your Practice Specialty</h2>
        <p className="text-gray-600 text-lg">
          Choose your medical specialty to customize your AI agents and templates
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableSpecialties.map((specialty) => {
          const config = specialtyConfigs[specialty];
          const Icon = specialtyIcons[specialty] || Stethoscope;
          const isSelected = selectedSpecialty === specialty;
          
          return (
            <Card 
              key={specialty}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:shadow-md hover:border-gray-300'
              }`}
              onClick={() => onSelectSpecialty(specialty)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div 
                    className={`p-3 rounded-lg ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{config.brandName}</CardTitle>
                    <CardDescription className="text-sm">
                      {config.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {config.commonProcedures?.slice(0, 3).map((procedure, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {procedure}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">AI Agents Included:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Intake IQ - Specialized intake forms</li>
                      <li>• Schedule IQ - Appointment management</li>
                      <li>• Scribe IQ - Clinical documentation</li>
                      <li>• Claims IQ - Insurance processing</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedSpecialty && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-medium text-green-900 mb-2">
            Great choice! {specialtyConfigs[selectedSpecialty].brandName} Setup
          </h3>
          <p className="text-sm text-green-800">
            We'll customize your AI agents and templates specifically for {specialtyConfigs[selectedSpecialty].brandName.toLowerCase()} practice needs.
          </p>
        </div>
      )}
    </div>
  );
};
