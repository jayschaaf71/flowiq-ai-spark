
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Phone, Mail, Globe, Users } from "lucide-react";

interface PracticeDetailsStepProps {
  practiceData: {
    practiceName: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    teamSize: string;
  };
  onUpdatePracticeData: (data: any) => void;
}

export const PracticeDetailsStep = ({ practiceData, onUpdatePracticeData }: PracticeDetailsStepProps) => {
  const handleInputChange = (field: string, value: string) => {
    onUpdatePracticeData({
      ...practiceData,
      [field]: value
    });
  };

  const teamSizeOptions = [
    { value: '1-5', label: '1-5 people', description: 'Small practice' },
    { value: '6-15', label: '6-15 people', description: 'Growing practice' },
    { value: '16-50', label: '16-50 people', description: 'Established practice' },
    { value: '50+', label: '50+ people', description: 'Large practice/clinic' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Tell Us About Your Practice</h2>
        <p className="text-gray-600 text-lg">
          We'll use this information to customize your FlowIQ experience and set up your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Practice Information
            </CardTitle>
            <CardDescription>
              Basic details about your practice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="practiceName">Practice Name *</Label>
              <Input
                id="practiceName"
                value={practiceData.practiceName}
                onChange={(e) => handleInputChange('practiceName', e.target.value)}
                placeholder="e.g., Wellness Chiropractic Center"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Practice Description</Label>
              <Textarea
                id="description"
                value={practiceData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your practice and services..."
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Team Size</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {teamSizeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={practiceData.teamSize === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange('teamSize', option.value)}
                    className="h-auto p-3 flex flex-col items-start"
                  >
                    <span className="font-medium">{option.label}</span>
                    <span className="text-xs opacity-70">{option.description}</span>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Contact Information
            </CardTitle>
            <CardDescription>
              Where patients can find and reach you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="addressLine1">Address Line 1 *</Label>
              <Input
                id="addressLine1"
                value={practiceData.addressLine1}
                onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                placeholder="123 Main Street"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="addressLine2">Address Line 2</Label>
              <Input
                id="addressLine2"
                value={practiceData.addressLine2}
                onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                placeholder="Suite 100 (optional)"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={practiceData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="City"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={practiceData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="State"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="zipCode">ZIP Code *</Label>
              <Input
                id="zipCode"
                value={practiceData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                placeholder="12345"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="phone" className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  value={practiceData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={practiceData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="contact@yourpractice.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="website" className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Website (Optional)
                </Label>
                <Input
                  id="website"
                  value={practiceData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="www.yourpractice.com"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Summary */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Setup Progress</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${practiceData.practiceName ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Practice Name</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${practiceData.addressLine1 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Address</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${practiceData.phone ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Phone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${practiceData.email ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Email</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
