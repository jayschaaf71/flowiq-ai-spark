
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

interface PracticeData {
  practiceName: string;
  email: string;
  phone: string;
  website?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface BasicInformationCardProps {
  formData: PracticeData;
  errors: ValidationErrors;
  onInputChange: (field: keyof PracticeData, value: any) => void;
}

export const BasicInformationCard: React.FC<BasicInformationCardProps> = ({
  formData,
  errors,
  onInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Basic Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="practiceName" className="flex items-center gap-2">
            Practice Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="practiceName"
            value={formData.practiceName}
            onChange={(e) => onInputChange('practiceName', e.target.value)}
            placeholder="e.g., Smith Family Chiropractic"
            className={errors.practiceName ? 'border-red-500' : ''}
          />
          {errors.practiceName && (
            <p className="text-sm text-red-600 mt-1">{errors.practiceName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            placeholder="info@yourpractice.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="(555) 123-4567"
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Website (Optional)
          </Label>
          <Input
            id="website"
            type="url"
            value={formData.website}
            onChange={(e) => onInputChange('website', e.target.value)}
            placeholder="https://yourpractice.com"
          />
        </div>
      </CardContent>
    </Card>
  );
};
