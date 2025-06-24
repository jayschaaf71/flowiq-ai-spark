
import React from 'react';
import { SpecialtySelectionStep } from './SpecialtySelectionStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface PracticeSpecialtyProps {
  specialty: SpecialtyType | null;
  onSpecialtySelect: (specialty: SpecialtyType) => void;
}

export const PracticeSpecialty: React.FC<PracticeSpecialtyProps> = ({ 
  specialty, 
  onSpecialtySelect 
}) => {
  return (
    <SpecialtySelectionStep
      selectedSpecialty={specialty}
      onSelectSpecialty={onSpecialtySelect}
    />
  );
};
