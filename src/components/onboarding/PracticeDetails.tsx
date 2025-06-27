
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users,
  Clock,
  AlertCircle
} from 'lucide-react';

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

  const handleInputChange = (field: keyof PracticeData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Update parent component
    const updatedData = { ...formData, [field]: value };
    onPracticeDetailsUpdate(updatedData);
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

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

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
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Tell us about your practice</h2>
        <p className="text-gray-600">
          This information helps us customize FlowIQ and set up your AI agents
        </p>
        <Badge variant="outline" className="mt-2">
          {completionPercentage()}% Complete
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Basic Information */}
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
                onChange={(e) => handleInputChange('practiceName', e.target.value)}
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
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                onChange={(e) => handleInputChange('phone', e.target.value)}
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
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourpractice.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Practice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address">Practice Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="123 Main Street, City, State 12345"
                rows={3}
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for patient directions and local search optimization
              </p>
            </div>

            <div>
              <Label htmlFor="description">Practice Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your practice and services..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Business Hours
                </Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.businessHours?.start || '09:00'}
                    onChange={(e) => handleInputChange('businessHours', {
                      ...formData.businessHours,
                      start: e.target.value
                    })}
                  />
                  <span className="text-gray-500">to</span>
                  <Input
                    type="time"
                    value={formData.businessHours?.end || '17:00'}
                    onChange={(e) => handleInputChange('businessHours', {
                      ...formData.businessHours,
                      end: e.target.value
                    })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="teamSize" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team Size
                </Label>
                <Input
                  id="teamSize"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.teamSize || 1}
                  onChange={(e) => handleInputChange('teamSize', parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {Object.keys(errors).length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            Please fix the errors above to continue.
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Why do we need this information?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Practice Details:</strong> Personalizes patient communications and branding</li>
          <li>• <strong>Contact Info:</strong> Enables automated reminders and notifications</li>
          <li>• <strong>Business Hours:</strong> Optimizes scheduling and AI agent availability</li>
          <li>• <strong>Team Size:</strong> Configures user management and workflow templates</li>
        </ul>
      </div>
    </div>
  );
};
