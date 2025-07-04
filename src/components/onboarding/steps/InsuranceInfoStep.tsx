import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingData } from '@/hooks/usePatientOnboarding';
import { Upload, FileText, CheckCircle } from 'lucide-react';

interface InsuranceInfoStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  specialty?: string;
}

export const InsuranceInfoStep: React.FC<InsuranceInfoStepProps> = ({
  data,
  onUpdate
}) => {
  const insuranceInfo = data.insurance_info || {};
  const primaryInsurance = insuranceInfo.primaryInsurance || {};
  const secondaryInsurance = insuranceInfo.secondaryInsurance || {};
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleHasInsuranceChange = (hasInsurance: boolean) => {
    onUpdate({
      insurance_info: {
        ...insuranceInfo,
        hasInsurance
      }
    });
  };

  const handlePrimaryInsuranceChange = (field: string, value: string) => {
    onUpdate({
      insurance_info: {
        ...insuranceInfo,
        primaryInsurance: {
          ...primaryInsurance,
          [field]: value
        }
      }
    });
  };

  const handleSecondaryInsuranceChange = (field: string, value: string) => {
    onUpdate({
      insurance_info: {
        ...insuranceInfo,
        secondaryInsurance: {
          ...secondaryInsurance,
          [field]: value
        }
      }
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Insurance Coverage
          </CardTitle>
          <CardDescription>
            Help us verify your insurance benefits and process claims efficiently
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={insuranceInfo.hasInsurance || false}
              onCheckedChange={handleHasInsuranceChange}
            />
            <Label>I have health insurance coverage</Label>
          </div>

          {insuranceInfo.hasInsurance && (
            <div className="space-y-6">
              {/* Primary Insurance */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Primary Insurance</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryProvider">Insurance Provider *</Label>
                    <Input
                      id="primaryProvider"
                      value={primaryInsurance.provider || ''}
                      onChange={(e) => handlePrimaryInsuranceChange('provider', e.target.value)}
                      placeholder="e.g., Blue Cross Blue Shield"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="primaryPolicy">Policy Number *</Label>
                    <Input
                      id="primaryPolicy"
                      value={primaryInsurance.policyNumber || ''}
                      onChange={(e) => handlePrimaryInsuranceChange('policyNumber', e.target.value)}
                      placeholder="Policy number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryGroup">Group Number</Label>
                    <Input
                      id="primaryGroup"
                      value={primaryInsurance.groupNumber || ''}
                      onChange={(e) => handlePrimaryInsuranceChange('groupNumber', e.target.value)}
                      placeholder="Group number (if applicable)"
                    />
                  </div>

                  <div>
                    <Label htmlFor="relationship">Relationship to Subscriber</Label>
                    <Select 
                      value={primaryInsurance.relationship || ''} 
                      onValueChange={(value) => handlePrimaryInsuranceChange('relationship', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subscriberName">Subscriber Name</Label>
                    <Input
                      id="subscriberName"
                      value={primaryInsurance.subscriberName || ''}
                      onChange={(e) => handlePrimaryInsuranceChange('subscriberName', e.target.value)}
                      placeholder="Primary policy holder name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subscriberDOB">Subscriber Date of Birth</Label>
                    <Input
                      id="subscriberDOB"
                      type="date"
                      value={primaryInsurance.subscriberDOB || ''}
                      onChange={(e) => handlePrimaryInsuranceChange('subscriberDOB', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Secondary Insurance */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Secondary Insurance (Optional)</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="secondaryProvider">Insurance Provider</Label>
                    <Input
                      id="secondaryProvider"
                      value={secondaryInsurance.provider || ''}
                      onChange={(e) => handleSecondaryInsuranceChange('provider', e.target.value)}
                      placeholder="Secondary insurance provider"
                    />
                  </div>

                  <div>
                    <Label htmlFor="secondaryPolicy">Policy Number</Label>
                    <Input
                      id="secondaryPolicy"
                      value={secondaryInsurance.policyNumber || ''}
                      onChange={(e) => handleSecondaryInsuranceChange('policyNumber', e.target.value)}
                      placeholder="Secondary policy number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryGroup">Group Number</Label>
                  <Input
                    id="secondaryGroup"
                    value={secondaryInsurance.groupNumber || ''}
                    onChange={(e) => handleSecondaryInsuranceChange('groupNumber', e.target.value)}
                    placeholder="Secondary group number"
                  />
                </div>
              </div>
            </div>
          )}

          {!insuranceInfo.hasInsurance && (
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">No Insurance Coverage</h4>
              <p className="text-sm text-yellow-700">
                We offer various payment options and payment plans for patients without insurance. 
                Our staff will discuss these options with you during your visit.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Upload */}
      {insuranceInfo.hasInsurance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Insurance Card Upload
            </CardTitle>
            <CardDescription>
              Upload photos of your insurance cards for faster verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload front and back of your insurance card(s)
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="insurance-upload"
                />
                <Button 
                  variant="outline" 
                  onClick={() => document.getElementById('insurance-upload')?.click()}
                >
                  Choose Files
                </Button>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">Uploaded Files:</h5>
                  {uploadedFiles.map((fileName, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {fileName}
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, PDF. Maximum file size: 10MB per file.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};