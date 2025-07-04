import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OnboardingData } from '@/hooks/usePatientOnboarding';

interface PersonalInfoStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  specialty?: string;
}

export const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onUpdate,
  specialty
}) => {
  const personalInfo = data.personal_info || {};

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({
      personal_info: {
        ...personalInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName || ''}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={personalInfo.dateOfBirth || ''}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select 
            value={personalInfo.gender || ''} 
            onValueChange={(value) => handleFieldChange('gender', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="non-binary">Non-binary</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="maritalStatus">Marital Status</Label>
          <Select 
            value={personalInfo.maritalStatus || ''} 
            onValueChange={(value) => handleFieldChange('maritalStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
              <SelectItem value="separated">Separated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            value={personalInfo.occupation || ''}
            onChange={(e) => handleFieldChange('occupation', e.target.value)}
            placeholder="Your occupation"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="employer">Employer</Label>
        <Input
          id="employer"
          value={personalInfo.employer || ''}
          onChange={(e) => handleFieldChange('employer', e.target.value)}
          placeholder="Your employer"
        />
      </div>

      {specialty === 'chiropractic' && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h4 className="font-medium text-orange-800 mb-2">Chiropractic Care Information</h4>
          <p className="text-sm text-orange-700">
            We'll use this information to customize your chiropractic treatment plan and ensure 
            we provide the most effective care for your musculoskeletal health.
          </p>
        </div>
      )}

      {specialty === 'dental-sleep-medicine' && (
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="font-medium text-purple-800 mb-2">Sleep Medicine Information</h4>
          <p className="text-sm text-purple-700">
            This information helps us understand your sleep patterns and provide 
            personalized dental sleep medicine treatment.
          </p>
        </div>
      )}
    </div>
  );
};