
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard } from "lucide-react";
import { PatientData } from "@/types/patient-onboarding";

interface InsuranceStepProps {
  patientData: PatientData;
  setPatientData: (data: PatientData | ((prev: PatientData) => PatientData)) => void;
}

export const InsuranceStep = ({ patientData, setPatientData }: InsuranceStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Insurance Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="insuranceProvider">Insurance Provider *</Label>
          <Input
            id="insuranceProvider"
            value={patientData.insurance.provider}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, provider: e.target.value }
            }))}
            placeholder="Blue Cross Blue Shield"
          />
        </div>
        <div>
          <Label htmlFor="policyNumber">Policy Number *</Label>
          <Input
            id="policyNumber"
            value={patientData.insurance.policyNumber}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, policyNumber: e.target.value }
            }))}
            placeholder="Policy number"
          />
        </div>
        <div>
          <Label htmlFor="groupNumber">Group Number</Label>
          <Input
            id="groupNumber"
            value={patientData.insurance.groupNumber}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, groupNumber: e.target.value }
            }))}
            placeholder="Group number"
          />
        </div>
        <div>
          <Label htmlFor="subscriberName">Subscriber Name</Label>
          <Input
            id="subscriberName"
            value={patientData.insurance.subscriberName}
            onChange={(e) => setPatientData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, subscriberName: e.target.value }
            }))}
            placeholder="Primary insured person"
          />
        </div>
        <div>
          <Label htmlFor="relationship">Relationship to Subscriber</Label>
          <Select 
            value={patientData.insurance.relationship} 
            onValueChange={(value) => setPatientData(prev => ({
              ...prev,
              insurance: { ...prev.insurance, relationship: value }
            }))}
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
    </div>
  );
};
