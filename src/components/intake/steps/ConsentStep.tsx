
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { PatientData } from "@/types/patient-onboarding";

interface ConsentStepProps {
  patientData: PatientData;
  setPatientData: (data: PatientData | ((prev: PatientData) => PatientData)) => void;
}

export const ConsentStep = ({ patientData, setPatientData }: ConsentStepProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Consent & Agreements</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="treatment"
            checked={patientData.consents.treatment}
            onCheckedChange={(checked) => setPatientData(prev => ({
              ...prev,
              consents: { ...prev.consents, treatment: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="treatment" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Treatment Consent *
            </Label>
            <p className="text-xs text-muted-foreground">
              I consent to medical treatment and procedures as deemed necessary by my healthcare provider.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="privacy"
            checked={patientData.consents.privacy}
            onCheckedChange={(checked) => setPatientData(prev => ({
              ...prev,
              consents: { ...prev.consents, privacy: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Privacy Notice *
            </Label>
            <p className="text-xs text-muted-foreground">
              I acknowledge receipt of the Notice of Privacy Practices and understand how my health information may be used and disclosed.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="financial"
            checked={patientData.consents.financial}
            onCheckedChange={(checked) => setPatientData(prev => ({
              ...prev,
              consents: { ...prev.consents, financial: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="financial" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Financial Responsibility *
            </Label>
            <p className="text-xs text-muted-foreground">
              I understand my financial responsibility for services rendered and agree to pay for services not covered by insurance.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="communication"
            checked={patientData.consents.communication}
            onCheckedChange={(checked) => setPatientData(prev => ({
              ...prev,
              consents: { ...prev.consents, communication: checked as boolean }
            }))}
          />
          <div className="grid gap-1.5 leading-none">
            <Label htmlFor="communication" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Communication Preferences
            </Label>
            <p className="text-xs text-muted-foreground">
              I consent to receive appointment reminders, health information, and other communications via phone, email, or text message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
