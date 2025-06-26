
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface OnboardingHeaderProps {
  title: string;
  description: string;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ 
  title, 
  description 
}) => {
  return (
    <CardHeader className="py-4 px-6 border-b">
      <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};
