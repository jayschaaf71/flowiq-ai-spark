
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { InsuranceCardUpload } from '@/components/insurance/InsuranceCardUpload';

interface InsuranceStepProps {
  initialData: any;
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export const InsuranceStep: React.FC<InsuranceStepProps> = ({ initialData, onComplete, onSkip }) => {
  const [insurance, setInsurance] = useState({
    provider: initialData.insurance?.provider || '',
    policyNumber: initialData.insurance?.policyNumber || '',
    groupNumber: initialData.insurance?.groupNumber || '',
    subscriberName: initialData.insurance?.subscriberName || '',
    relationship: initialData.insurance?.relationship || 'self'
  });

  const [cardData, setCardData] = useState(initialData.insuranceCards || []);

  const updateField = (field: string, value: string) => {
    setInsurance(prev => ({ ...prev, [field]: value }));
  };

  const handleCardUpload = (uploadedCardData: any) => {
    setCardData(prev => [...prev, uploadedCardData]);
    
    // Auto-fill form fields if card data was extracted
    if (uploadedCardData.extractedData) {
      const extracted = uploadedCardData.extractedData;
      setInsurance(prev => ({
        ...prev,
        provider: extracted.insurance_provider_name || prev.provider,
        policyNumber: extracted.member_id || prev.policyNumber,
        groupNumber: extracted.group_number || prev.groupNumber
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ 
      insurance,
      insuranceCards: cardData
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Insurance Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="provider">Insurance Provider</Label>
              <Input
                id="provider"
                value={insurance.provider}
                onChange={(e) => updateField('provider', e.target.value)}
                placeholder="e.g., Blue Cross Blue Shield"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={insurance.policyNumber}
                  onChange={(e) => updateField('policyNumber', e.target.value)}
                  placeholder="Policy/Member ID"
                />
              </div>
              <div>
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  value={insurance.groupNumber}
                  onChange={(e) => updateField('groupNumber', e.target.value)}
                  placeholder="Group ID (if applicable)"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="subscriberName">Subscriber Name</Label>
              <Input
                id="subscriberName"
                value={insurance.subscriberName}
                onChange={(e) => updateField('subscriberName', e.target.value)}
                placeholder="Name on insurance card"
              />
            </div>
            <div>
              <Label htmlFor="relationship">Relationship to Subscriber</Label>
              <Select value={insurance.relationship} onValueChange={(value) => updateField('relationship', value)}>
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
        </CardContent>
      </Card>

      {/* Insurance Card Upload Section */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Insurance Card</h3>
          <p className="text-sm text-gray-600 mb-4">
            Take photos of both sides of your insurance card for verification and automatic data entry.
          </p>
          <InsuranceCardUpload
            patientId="current-patient" // Will be replaced with actual patient ID
            onUploadComplete={handleCardUpload}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onSkip}>
          Skip This Step
        </Button>
        <Button type="submit" size="lg">
          Continue to Symptom Assessment
        </Button>
      </div>
    </form>
  );
};
