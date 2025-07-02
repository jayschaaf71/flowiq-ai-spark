import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export interface SpecialtyOption {
  id: string;
  name: string;
  brandName: string;
  description: string;
  color: string;
  specialty: string;
}

const specialtyOptions: SpecialtyOption[] = [
  {
    id: 'chiropractic',
    name: 'Chiropractic Care',
    brandName: 'Chiropractic IQ',
    description: 'Optimizing spinal health and mobility',
    color: 'green',
    specialty: 'chiropractic-care'
  },
  {
    id: 'dental',
    name: 'Dental Care',
    brandName: 'Dental IQ',
    description: 'Complete oral health management',
    color: 'blue',
    specialty: 'dental-care'
  },
  {
    id: 'dental-sleep',
    name: 'Dental Sleep Medicine',
    brandName: 'Dental Sleep IQ',
    description: 'Restoring quality sleep through dental solutions',
    color: 'purple',
    specialty: 'dental-sleep-medicine'
  },
  {
    id: 'appointment',
    name: 'Smart Scheduling',
    brandName: 'Appointment IQ',
    description: 'AI-powered scheduling and booking',
    color: 'indigo',
    specialty: 'appointment-scheduling'
  }
];

interface SpecialtySwitcherProps {
  currentSpecialty: string;
  onSpecialtyChange: (specialty: SpecialtyOption) => void;
}

export const SpecialtySwitcher: React.FC<SpecialtySwitcherProps> = ({
  currentSpecialty,
  onSpecialtyChange
}) => {
  const currentOption = specialtyOptions.find(opt => opt.specialty === currentSpecialty) || specialtyOptions[0];

  const getBackgroundColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200';
      case 'blue': return 'bg-blue-50 border-blue-200';
      case 'purple': return 'bg-purple-50 border-purple-200';
      case 'indigo': return 'bg-indigo-50 border-indigo-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = (color: string) => {
    switch (color) {
      case 'green': return 'text-green-800';
      case 'blue': return 'text-blue-800';
      case 'purple': return 'text-purple-800';
      case 'indigo': return 'text-indigo-800';
      default: return 'text-gray-800';
    }
  };

  const getBadgeColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'blue': return 'bg-blue-100 text-blue-800';
      case 'purple': return 'bg-purple-100 text-purple-800';
      case 'indigo': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={getBackgroundColor(currentOption.color)}>
      <CardContent className="p-6">
        {/* Top Section - Brand Name and Badge */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2">
            <h1 className={`text-2xl font-bold ${getTextColor(currentOption.color)} mb-2`}>
              {currentOption.brandName}
            </h1>
            <p className={`text-sm ${getTextColor(currentOption.color)} opacity-75`}>
              {currentOption.description}
            </p>
          </div>
          <div className="flex justify-start md:justify-end items-start">
            <Badge className={getBadgeColor(currentOption.color)}>
              {currentOption.name}
            </Badge>
          </div>
        </div>

        {/* Bottom Section - Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Switch Specialty:
          </span>
          <Select
            value={currentOption.id}
            onValueChange={(value) => {
              const selected = specialtyOptions.find(opt => opt.id === value);
              if (selected) {
                onSpecialtyChange(selected);
              }
            }}
          >
            <SelectTrigger className="w-full sm:w-auto min-w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {specialtyOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.brandName} - {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            Demo Mode
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};