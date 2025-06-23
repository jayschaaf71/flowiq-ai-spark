
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { PatientData } from "@/types/patient-onboarding";

interface PersonalInformationStepProps {
  patientData: PatientData;
  setPatientData: (data: PatientData | ((prev: PatientData) => PatientData)) => void;
}

export const PersonalInformationStep = ({ patientData, setPatientData }: PersonalInformationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={patientData.firstName}
            onChange={(e) => setPatientData(prev => ({ ...prev, firstName: e.target.value }))}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={patientData.lastName}
            onChange={(e) => setPatientData(prev => ({ ...prev, lastName: e.target.value }))}
            placeholder="Enter last name"
          />
        </div>
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={patientData.dateOfBirth}
            onChange={(e) => setPatientData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select value={patientData.gender} onValueChange={(value) => setPatientData(prev => ({ ...prev, gender: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={patientData.phone}
            onChange={(e) => setPatientData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="(555) 123-4567"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={patientData.email}
            onChange={(e) => setPatientData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@example.com"
          />
        </div>
      </div>
    </div>
  );
};
