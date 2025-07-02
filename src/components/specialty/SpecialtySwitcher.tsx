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
    brandName: 'ChiropracticIQ',
    description: 'Optimizing spinal health and mobility',
    color: 'green',
    specialty: 'chiropractic-care'
  },
  {
    id: 'dental',
    name: 'Dental Care',
    brandName: 'DentalIQ',
    description: 'Complete oral health management',
    color: 'blue',
    specialty: 'dental-care'
  },
  {
    id: 'dental-sleep',
    name: 'Dental Sleep Medicine',
    brandName: 'DentalSleepIQ',
    description: 'Restoring quality sleep through dental solutions',
    color: 'purple',
    specialty: 'dental-sleep-medicine'
  },
  {
    id: 'appointment',
    name: 'Smart Scheduling',
    brandName: 'AppointmentIQ',
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

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          badge: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'purple':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          badge: 'bg-purple-100 text-purple-800 border-purple-200'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50',
          border: 'border-indigo-200',
          text: 'text-indigo-800',
          badge: 'bg-indigo-100 text-indigo-800 border-indigo-200'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const colors = getColorClasses(currentOption.color);

  return (
    <Card className={`${colors.bg} ${colors.border}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className={`text-xl font-bold ${colors.text}`}>
              {currentOption.brandName}
            </h2>
            <p className={`text-sm ${colors.text} opacity-80`}>
              {currentOption.description}
            </p>
          </div>
          <Badge className={colors.badge}>
            {currentOption.name}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">
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
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {specialtyOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{option.brandName}</span>
                    <span className="text-xs text-gray-500">- {option.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-xs">
            Demo Mode
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};