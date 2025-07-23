
import React, { useState } from 'react';
import { BasicInformationCard } from './components/BasicInformationCard';
import { PracticeDetailsCard } from './components/PracticeDetailsCard';
import { PracticeDetailsHeader } from './components/PracticeDetailsHeader';
import { PracticeDetailsInfoBox } from './components/PracticeDetailsInfoBox';
import { PracticeDetailsValidation } from './components/PracticeDetailsValidation';

interface PracticeData {
  practiceName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
  businessHours?: {
    start: string;
    end: string;
  };
  teamSize?: number;
}

interface PracticeDetailsProps {
  practiceData: PracticeData | undefined;
  onPracticeDetailsUpdate: (data: PracticeData) => void;
}

export const PracticeDetails: React.FC<PracticeDetailsProps> = ({
  practiceData,
  onPracticeDetailsUpdate
}) => {
  const [formData, setFormData] = useState<PracticeData>({
    practiceName: practiceData?.practiceName || '',
    email: practiceData?.email || '',
    phone: practiceData?.phone || '',
    address: practiceData?.address || '',
    website: practiceData?.website || '',
    description: practiceData?.description || '',
    businessHours: practiceData?.businessHours || { start: '09:00', end: '17:00' },
    teamSize: practiceData?.teamSize || 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PracticeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Update parent component
    const updatedData = { ...formData, [field]: value };
    onPracticeDetailsUpdate(updatedData);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.practiceName.trim()) {
      newErrors.practiceName = 'Practice name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-6">
      <PracticeDetailsHeader formData={formData} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicInformationCard
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />

        <PracticeDetailsCard
          formData={formData}
          onInputChange={handleInputChange}
        />
      </div>

      <PracticeDetailsValidation errors={errors} />

      <PracticeDetailsInfoBox />
    </div>
  );
};
