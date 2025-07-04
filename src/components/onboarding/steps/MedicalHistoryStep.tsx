import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OnboardingData } from '@/hooks/usePatientOnboarding';
import { X, Plus } from 'lucide-react';

interface MedicalHistoryStepProps {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  specialty?: string;
}

export const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({
  data,
  onUpdate,
  specialty
}) => {
  const medicalHistory = data.medical_history || {};
  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const handleFieldChange = (field: string, value: string) => {
    onUpdate({
      medical_history: {
        ...medicalHistory,
        [field]: value
      }
    });
  };

  const handleArrayAdd = (field: string, value: string, setter: (val: string) => void) => {
    if (value.trim()) {
      const currentArray = (medicalHistory as any)[field] || [];
      onUpdate({
        medical_history: {
          ...medicalHistory,
          [field]: [...currentArray, value.trim()]
        }
      });
      setter('');
    }
  };

  const handleArrayRemove = (field: string, index: number) => {
    const currentArray = (medicalHistory as any)[field] || [];
    const updatedArray = currentArray.filter((_: any, i: number) => i !== index);
    onUpdate({
      medical_history: {
        ...medicalHistory,
        [field]: updatedArray
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Medications */}
      <div className="space-y-3">
        <Label>Current Medications</Label>
        <div className="flex gap-2">
          <Input
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            placeholder="Enter medication name and dosage"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleArrayAdd('currentMedications', newMedication, setNewMedication);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd('currentMedications', newMedication, setNewMedication)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(medicalHistory.currentMedications || []).map((medication, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {medication}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleArrayRemove('currentMedications', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <Label>Allergies</Label>
        <div className="flex gap-2">
          <Input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            placeholder="Enter allergy (medication, food, environmental)"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleArrayAdd('allergies', newAllergy, setNewAllergy);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd('allergies', newAllergy, setNewAllergy)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(medicalHistory.allergies || []).map((allergy, index) => (
            <Badge key={index} variant="destructive" className="flex items-center gap-1">
              {allergy}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleArrayRemove('allergies', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Medical Conditions */}
      <div className="space-y-3">
        <Label>Current Medical Conditions</Label>
        <div className="flex gap-2">
          <Input
            value={newCondition}
            onChange={(e) => setNewCondition(e.target.value)}
            placeholder="Enter medical condition"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleArrayAdd('medicalConditions', newCondition, setNewCondition);
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleArrayAdd('medicalConditions', newCondition, setNewCondition)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(medicalHistory.medicalConditions || []).map((condition, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              {condition}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleArrayRemove('medicalConditions', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      {/* Lifestyle Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="smokingStatus">Smoking Status</Label>
          <Select 
            value={medicalHistory.smokingStatus || ''} 
            onValueChange={(value) => handleFieldChange('smokingStatus', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select smoking status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never smoked</SelectItem>
              <SelectItem value="former">Former smoker</SelectItem>
              <SelectItem value="current">Current smoker</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="alcoholConsumption">Alcohol Consumption</Label>
          <Select 
            value={medicalHistory.alcoholConsumption || ''} 
            onValueChange={(value) => handleFieldChange('alcoholConsumption', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alcohol consumption" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="occasional">Occasional (1-2 drinks/week)</SelectItem>
              <SelectItem value="moderate">Moderate (3-7 drinks/week)</SelectItem>
              <SelectItem value="frequent">Frequent (8+ drinks/week)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="exerciseFrequency">Exercise Frequency</Label>
        <Select 
          value={medicalHistory.exerciseFrequency || ''} 
          onValueChange={(value) => handleFieldChange('exerciseFrequency', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select exercise frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No regular exercise</SelectItem>
            <SelectItem value="light">Light (1-2 times/week)</SelectItem>
            <SelectItem value="moderate">Moderate (3-4 times/week)</SelectItem>
            <SelectItem value="frequent">Frequent (5+ times/week)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Specialty-specific sections */}
      {specialty === 'chiropractic' && (
        <div className="bg-orange-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-orange-800">Chiropractic History</h4>
          <p className="text-sm text-orange-700 mb-3">
            Any previous chiropractic care, injuries, or musculoskeletal issues?
          </p>
          <Textarea
            placeholder="Please describe any previous chiropractic treatment, back injuries, neck pain, headaches, or other musculoskeletal issues..."
            className="min-h-[80px]"
          />
        </div>
      )}

      {specialty === 'dental-sleep-medicine' && (
        <div className="bg-purple-50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium text-purple-800">Sleep History</h4>
          <p className="text-sm text-purple-700 mb-3">
            Any sleep-related issues or previous sleep studies?
          </p>
          <Textarea
            placeholder="Please describe any sleep apnea, snoring, insomnia, previous sleep studies, or dental appliance therapy..."
            className="min-h-[80px]"
          />
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Medical History Privacy</h4>
        <p className="text-sm text-blue-700">
          Your medical information is protected by HIPAA and will only be shared with your healthcare providers 
          as necessary for your treatment. All information is stored securely and encrypted.
        </p>
      </div>
    </div>
  );
};