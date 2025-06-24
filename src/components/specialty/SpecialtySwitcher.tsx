
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { specialtyConfigs, SpecialtyType } from '@/utils/specialtyConfig';
import { 
  Activity, 
  Moon, 
  Sparkles, 
  Crown, 
  Zap,
  ChevronDown
} from "lucide-react";

const specialtyIcons = {
  chiropractic: Activity,
  dental_sleep: Moon,
  med_spa: Sparkles,
  concierge: Crown,
  hrt: Zap
};

export const SpecialtySwitcher = () => {
  const { currentSpecialty, config, switchSpecialty } = useSpecialty();
  const CurrentIcon = specialtyIcons[currentSpecialty];

  const handleSpecialtyChange = (specialty: SpecialtyType) => {
    switchSpecialty(specialty);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <CurrentIcon className="w-4 h-4" style={{ color: config.primaryColor }} />
          <span className="hidden sm:inline">{config.brandName}</span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Switch Specialty</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(specialtyConfigs).map(([key, specialty]) => {
          const Icon = specialtyIcons[key as SpecialtyType];
          const isActive = currentSpecialty === key;
          
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleSpecialtyChange(key as SpecialtyType)}
              className={`flex items-center gap-3 p-3 ${isActive ? 'bg-gray-50' : ''}`}
            >
              <Icon className="w-4 h-4" style={{ color: specialty.primaryColor }} />
              <div className="flex-1">
                <p className="font-medium">{specialty.brandName}</p>
                <p className="text-xs text-gray-500">{specialty.specialtyFocus}</p>
              </div>
              {isActive && (
                <Badge variant="secondary" className="text-xs">Active</Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
