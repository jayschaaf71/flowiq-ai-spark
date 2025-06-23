
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { PatientData } from "@/types/patient-onboarding";

interface MedicalHistoryStepProps {
  patientData: PatientData;
  setPatientData: (data: PatientData | ((prev: PatientData) => PatientData)) => void;
}

export const MedicalHistoryStep = ({ patientData, setPatientData }: MedicalHistoryStepProps) => {
  const addToList = (field: keyof PatientData['medicalHistory'], value: string) => {
    if (value.trim()) {
      setPatientData(prev => ({
        ...prev,
        medicalHistory: {
          ...prev.medicalHistory,
          [field]: [...prev.medicalHistory[field], value.trim()]
        }
      }));
    }
  };

  const removeFromList = (field: keyof PatientData['medicalHistory'], index: number) => {
    setPatientData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: prev.medicalHistory[field].filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Medical History</h3>
      </div>
      
      <div className="space-y-6">
        {/* Allergies */}
        <div>
          <Label>Allergies</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Add allergy"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToList('allergies', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addToList('allergies', input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {patientData.medicalHistory.allergies.map((allergy, index) => (
              <Badge key={index} variant="secondary">
                {allergy}
                <button
                  onClick={() => removeFromList('allergies', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div>
          <Label>Current Medications</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Add medication"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToList('medications', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addToList('medications', input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {patientData.medicalHistory.medications.map((medication, index) => (
              <Badge key={index} variant="secondary">
                {medication}
                <button
                  onClick={() => removeFromList('medications', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Medical Conditions */}
        <div>
          <Label>Medical Conditions</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Add condition"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToList('conditions', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addToList('conditions', input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {patientData.medicalHistory.conditions.map((condition, index) => (
              <Badge key={index} variant="secondary">
                {condition}
                <button
                  onClick={() => removeFromList('conditions', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Previous Surgeries */}
        <div>
          <Label>Previous Surgeries</Label>
          <div className="flex gap-2 mt-1">
            <Input
              placeholder="Add surgery"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addToList('surgeries', e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <Button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                addToList('surgeries', input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {patientData.medicalHistory.surgeries.map((surgery, index) => (
              <Badge key={index} variant="secondary">
                {surgery}
                <button
                  onClick={() => removeFromList('surgeries', index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
