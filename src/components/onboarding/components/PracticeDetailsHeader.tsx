
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface PracticeData {
  practiceName: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  description?: string;
}

interface PracticeDetailsHeaderProps {
  formData: PracticeData;
}

export const PracticeDetailsHeader: React.FC<PracticeDetailsHeaderProps> = ({
  formData
}) => {
  const completionPercentage = () => {
    const requiredFields = ['practiceName', 'email', 'phone'];
    const optionalFields = ['address', 'website', 'description'];
    
    const requiredCompleted = requiredFields.filter(field => 
      formData[field as keyof PracticeData] && String(formData[field as keyof PracticeData]).trim()
    ).length;
    
    const optionalCompleted = optionalFields.filter(field => 
      formData[field as keyof PracticeData] && String(formData[field as keyof PracticeData]).trim()
    ).length;
    
    return Math.round(((requiredCompleted / requiredFields.length) * 70) + ((optionalCompleted / optionalFields.length) * 30));
  };

  return (
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Tell us about your practice</h2>
      <p className="text-gray-600">
        This information helps us customize FlowIQ and set up your AI agents
      </p>
      <Badge variant="outline" className="mt-2">
        {completionPercentage()}% Complete
      </Badge>
    </div>
  );
};
