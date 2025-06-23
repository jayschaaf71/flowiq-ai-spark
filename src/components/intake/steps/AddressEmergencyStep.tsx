
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { PatientData } from "@/types/patient-onboarding";

interface AddressEmergencyStepProps {
  patientData: PatientData;
  setPatientData: (data: PatientData | ((prev: PatientData) => PatientData)) => void;
}

export const AddressEmergencyStep = ({ patientData, setPatientData }: AddressEmergencyStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Address & Emergency Contact</h3>
      </div>
      
      <div className="space-y-4">
        <h4 className="font-medium">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              value={patientData.address.street}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                address: { ...prev.address, street: e.target.value }
              }))}
              placeholder="123 Main St"
            />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={patientData.address.city}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                address: { ...prev.address, city: e.target.value }
              }))}
              placeholder="City"
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={patientData.address.state}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                address: { ...prev.address, state: e.target.value }
              }))}
              placeholder="State"
            />
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={patientData.address.zipCode}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                address: { ...prev.address, zipCode: e.target.value }
              }))}
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyName">Name *</Label>
            <Input
              id="emergencyName"
              value={patientData.emergencyContact.name}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, name: e.target.value }
              }))}
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Input
              id="emergencyRelationship"
              value={patientData.emergencyContact.relationship}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, relationship: e.target.value }
              }))}
              placeholder="Spouse,Parent,etc."
            />
          </div>
          <div>
            <Label htmlFor="emergencyPhone">Phone Number *</Label>
            <Input
              id="emergencyPhone"
              value={patientData.emergencyContact.phone}
              onChange={(e) => setPatientData(prev => ({ 
                ...prev, 
                emergencyContact: { ...prev.emergencyContact, phone: e.target.value }
              }))}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
