import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { OnboardingData } from '@/hooks/usePatientOnboarding';
import { Users, Phone, Mail } from 'lucide-react';

interface EmergencyContactStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  specialty?: string;
}

export const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({
  data,
  onUpdate
}) => {
  const emergencyContact = data.emergency_contact || {};

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({
      emergency_contact: {
        ...emergencyContact,
        [field]: value
      }
    });
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">Emergency Contact Information</h3>
        <p className="text-gray-600">
          This person will be contacted in case of a medical emergency
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="emergencyName">Full Name *</Label>
          <Input
            id="emergencyName"
            value={emergencyContact.name || ''}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            placeholder="Emergency contact's full name"
            required
          />
        </div>

        <div>
          <Label htmlFor="emergencyRelationship">Relationship *</Label>
          <Select 
            value={emergencyContact.relationship || ''} 
            onValueChange={(value) => handleFieldChange('relationship', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="spouse">Spouse</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="child">Child</SelectItem>
              <SelectItem value="sibling">Sibling</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="partner">Partner</SelectItem>
              <SelectItem value="guardian">Guardian</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyPhone">Primary Phone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="emergencyPhone"
                value={emergencyContact.phone || ''}
                onChange={(e) => handleFieldChange('phone', formatPhoneNumber(e.target.value))}
                placeholder="(555) 123-4567"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emergencyEmail">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="emergencyEmail"
                type="email"
                value={emergencyContact.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="contact@email.com"
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="emergencyAddress">Address</Label>
          <Textarea
            id="emergencyAddress"
            value={emergencyContact.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            placeholder="Full address of emergency contact"
            rows={3}
          />
        </div>
      </div>

      <div className="bg-red-50 p-4 rounded-lg">
        <h4 className="font-medium text-red-800 mb-2">Emergency Contact Authorization</h4>
        <p className="text-sm text-red-700">
          By providing this information, you authorize us to contact this person in case of a medical emergency. 
          This person will also be authorized to receive information about your medical condition in emergency situations, 
          as permitted by HIPAA regulations.
        </p>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make sure your emergency contact is aware they are listed as your emergency contact</li>
          <li>• Keep their contact information up to date</li>
          <li>• Choose someone who is typically available and can make decisions on your behalf if needed</li>
          <li>• This person should be familiar with your medical history and preferences</li>
        </ul>
      </div>
    </div>
  );
};