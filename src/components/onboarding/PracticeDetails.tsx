
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingFieldHelp } from './OnboardingFieldHelp';
import { validatePracticeDetails } from '@/utils/onboardingValidation';

interface PracticeData {
  practiceName: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
}

interface PracticeDetailsProps {
  practiceData: PracticeData;
  onPracticeDetailsUpdate: (data: PracticeData) => void;
}

export const PracticeDetails: React.FC<PracticeDetailsProps> = ({
  practiceData,
  onPracticeDetailsUpdate
}) => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof PracticeData, value: string) => {
    const updatedData = {
      ...practiceData,
      [field]: value
    };
    
    onPracticeDetailsUpdate(updatedData);
    
    // Clear error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate the specific field
    const validation = validatePracticeDetails(practiceData);
    const fieldError = validation.errors.find(error => error.field === field);
    
    if (fieldError) {
      setFieldErrors(prev => ({ ...prev, [field]: fieldError.message }));
    }
  };

  const getFieldClassName = (field: string) => {
    const baseClass = "transition-all duration-200 focus:ring-2 focus:ring-blue-500";
    if (fieldErrors[field] && touched[field]) {
      return `${baseClass} border-red-300 focus:border-red-500 focus:ring-red-200`;
    }
    return baseClass;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Practice Information</h2>
        <p className="text-gray-600">
          This information will be used across your forms and patient communications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Basic Information
            <span className="text-red-500">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="practiceName" className="flex items-center gap-2">
                Practice Name <span className="text-red-500">*</span>
                <OnboardingFieldHelp field="practiceName" />
              </Label>
              <Input
                id="practiceName"
                value={practiceData.practiceName}
                onChange={(e) => handleInputChange('practiceName', e.target.value)}
                onBlur={() => handleBlur('practiceName')}
                placeholder="e.g., Smith Family Chiropractic"
                className={getFieldClassName('practiceName')}
              />
              {fieldErrors.practiceName && touched.practiceName && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {fieldErrors.practiceName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                Email Address <span className="text-red-500">*</span>
                <OnboardingFieldHelp field="email" />
              </Label>
              <Input
                id="email"
                type="email"
                value={practiceData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="info@yourpractice.com"
                className={getFieldClassName('email')}
              />
              {fieldErrors.email && touched.email && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                Phone Number
                <OnboardingFieldHelp field="phone" />
              </Label>
              <Input
                id="phone"
                value={practiceData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="(555) 123-4567"
                className={getFieldClassName('phone')}
              />
              {fieldErrors.phone && touched.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                Practice Address
                <OnboardingFieldHelp field="address" />
              </Label>
              <Input
                id="address"
                value={practiceData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                onBlur={() => handleBlur('address')}
                placeholder="123 Main St, City, State 12345"
                className={getFieldClassName('address')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Practice Description <span className="text-sm text-gray-500">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              value={practiceData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your practice and services..."
              rows={3}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-blue-800">
          Use your official business information as it appears on your professional licenses. 
          This ensures consistency across all patient communications and legal documents.
        </p>
      </div>
    </div>
  );
};
