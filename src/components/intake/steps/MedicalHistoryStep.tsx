
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface MedicalHistoryStepProps {
  initialData: any;
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export const MedicalHistoryStep: React.FC<MedicalHistoryStepProps> = ({ initialData, onComplete, onSkip }) => {
  const [medicalHistory, setMedicalHistory] = useState(initialData.medicalHistory || []);
  const [medications, setMedications] = useState(initialData.medications || []);
  const [allergies, setAllergies] = useState(initialData.allergies || []);

  const addMedicalCondition = () => {
    setMedicalHistory([...medicalHistory, { condition: '', date: '', notes: '' }]);
  };

  const updateMedicalCondition = (index: number, field: string, value: string) => {
    const updated = [...medicalHistory];
    updated[index] = { ...updated[index], [field]: value };
    setMedicalHistory(updated);
  };

  const removeMedicalCondition = (index: number) => {
    setMedicalHistory(medicalHistory.filter((_: any, i: number) => i !== index));
  };

  const addMedication = () => {
    setMedications([...medications, { name: '', dosage: '', frequency: '' }]);
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_: any, i: number) => i !== index));
  };

  const addAllergy = () => {
    setAllergies([...allergies, { allergen: '', reaction: '', severity: '' }]);
  };

  const updateAllergy = (index: number, field: string, value: string) => {
    const updated = [...allergies];
    updated[index] = { ...updated[index], [field]: value };
    setAllergies(updated);
  };

  const removeAllergy = (index: number) => {
    setAllergies(allergies.filter((_: any, i: number) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({ medicalHistory, medications, allergies });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Medical History */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Medical History</h3>
            <Button type="button" variant="outline" size="sm" onClick={addMedicalCondition}>
              <Plus className="w-4 h-4 mr-2" />
              Add Condition
            </Button>
          </div>
          {medicalHistory.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No medical conditions added yet</p>
          ) : (
            <div className="space-y-4">
              {medicalHistory.map((condition: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeMedicalCondition(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Condition</Label>
                      <Input
                        value={condition.condition}
                        onChange={(e) => updateMedicalCondition(index, 'condition', e.target.value)}
                        placeholder="e.g., Hypertension"
                      />
                    </div>
                    <div>
                      <Label>Date Diagnosed</Label>
                      <Input
                        type="date"
                        value={condition.date}
                        onChange={(e) => updateMedicalCondition(index, 'date', e.target.value)}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Notes</Label>
                      <Textarea
                        value={condition.notes}
                        onChange={(e) => updateMedicalCondition(index, 'notes', e.target.value)}
                        placeholder="Additional information about this condition"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Current Medications</h3>
            <Button type="button" variant="outline" size="sm" onClick={addMedication}>
              <Plus className="w-4 h-4 mr-2" />
              Add Medication
            </Button>
          </div>
          {medications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No medications added yet</p>
          ) : (
            <div className="space-y-4">
              {medications.map((medication: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeMedication(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Medication Name</Label>
                      <Input
                        value={medication.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        placeholder="e.g., Lisinopril"
                      />
                    </div>
                    <div>
                      <Label>Dosage</Label>
                      <Input
                        value={medication.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="e.g., 10mg"
                      />
                    </div>
                    <div>
                      <Label>Frequency</Label>
                      <Input
                        value={medication.frequency}
                        onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                        placeholder="e.g., Once daily"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Allergies</h3>
            <Button type="button" variant="outline" size="sm" onClick={addAllergy}>
              <Plus className="w-4 h-4 mr-2" />
              Add Allergy
            </Button>
          </div>
          {allergies.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No allergies added yet</p>
          ) : (
            <div className="space-y-4">
              {allergies.map((allergy: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeAllergy(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Allergen</Label>
                      <Input
                        value={allergy.allergen}
                        onChange={(e) => updateAllergy(index, 'allergen', e.target.value)}
                        placeholder="e.g., Penicillin"
                      />
                    </div>
                    <div>
                      <Label>Reaction</Label>
                      <Input
                        value={allergy.reaction}
                        onChange={(e) => updateAllergy(index, 'reaction', e.target.value)}
                        placeholder="e.g., Rash"
                      />
                    </div>
                    <div>
                      <Label>Severity</Label>
                      <Input
                        value={allergy.severity}
                        onChange={(e) => updateAllergy(index, 'severity', e.target.value)}
                        placeholder="e.g., Mild, Moderate, Severe"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onSkip}>
          Skip This Step
        </Button>
        <Button type="submit" size="lg">
          Continue to Insurance
        </Button>
      </div>
    </form>
  );
};
