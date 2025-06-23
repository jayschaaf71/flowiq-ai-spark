import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  FileText, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Phone,
  Mail
} from "lucide-react";

interface PatientData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  
  // Insurance Information
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    subscriberName: string;
    relationship: string;
  };
  
  // Medical History
  medicalHistory: {
    allergies: string[];
    medications: string[];
    conditions: string[];
    surgeries: string[];
  };
  
  // Consent and Agreements
  consents: {
    treatment: boolean;
    privacy: boolean;
    financial: boolean;
    communication: boolean;
  };
}

interface PatientOnboardingWorkflowProps {
  onComplete: (patientId: string) => void;
  onCancel: () => void;
}

export const PatientOnboardingWorkflow = ({ onComplete, onCancel }: PatientOnboardingWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientData, setPatientData] = useState<PatientData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      subscriberName: '',
      relationship: ''
    },
    medicalHistory: {
      allergies: [],
      medications: [],
      conditions: [],
      surgeries: []
    },
    consents: {
      treatment: false,
      privacy: false,
      financial: false,
      communication: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step: number): boolean => {
    const errors: string[] = [];
    
    switch (step) {
      case 1: // Personal Information
        if (!patientData.firstName) errors.push('First name is required');
        if (!patientData.lastName) errors.push('Last name is required');
        if (!patientData.dateOfBirth) errors.push('Date of birth is required');
        if (!patientData.phone) errors.push('Phone number is required');
        if (!patientData.email) errors.push('Email is required');
        break;
        
      case 2: // Address & Emergency Contact
        if (!patientData.address.street) errors.push('Street address is required');
        if (!patientData.address.city) errors.push('City is required');
        if (!patientData.address.state) errors.push('State is required');
        if (!patientData.address.zipCode) errors.push('ZIP code is required');
        if (!patientData.emergencyContact.name) errors.push('Emergency contact name is required');
        if (!patientData.emergencyContact.phone) errors.push('Emergency contact phone is required');
        break;
        
      case 3: // Insurance Information
        if (!patientData.insurance.provider) errors.push('Insurance provider is required');
        if (!patientData.insurance.policyNumber) errors.push('Policy number is required');
        break;
        
      case 4: // Medical History
        // Optional validation - can proceed without complete medical history
        break;
        
      case 5: // Consents
        if (!patientData.consents.treatment) errors.push('Treatment consent is required');
        if (!patientData.consents.privacy) errors.push('Privacy consent is required');
        if (!patientData.consents.financial) errors.push('Financial consent is required');
        break;
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const submitPatientData = async () => {
    if (!validateStep(currentStep)) return;
    
    setLoading(true);
    try {
      // Create patient record
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .insert({
          first_name: patientData.firstName,
          last_name: patientData.lastName,
          date_of_birth: patientData.dateOfBirth,
          gender: patientData.gender,
          phone: patientData.phone,
          email: patientData.email,
          address_line1: patientData.address.street,
          city: patientData.address.city,
          state: patientData.address.state,
          zip_code: patientData.address.zipCode,
          emergency_contact_name: patientData.emergencyContact.name,
          emergency_contact_relationship: patientData.emergencyContact.relationship,
          emergency_contact_phone: patientData.emergencyContact.phone
        })
        .select()
        .single();

      if (patientError) throw patientError;

      // Convert PatientData to JSON-serializable format for Supabase
      const formDataJson = JSON.parse(JSON.stringify(patientData));

      // Create intake submission record
      const { error: submissionError } = await supabase
        .from('intake_submissions')
        .insert({
          form_id: 'onboarding-workflow',
          patient_name: `${patientData.firstName} ${patientData.lastName}`,
          patient_email: patientData.email,
          patient_phone: patientData.phone,
          form_data: formDataJson,
          status: 'completed',
          ai_summary: `New patient onboarding completed for ${patientData.firstName} ${patientData.lastName}. Insurance: ${patientData.insurance.provider}. Emergency contact: ${patientData.emergencyContact.name}.`
        });

      if (submissionError) throw submissionError;

      // Create medical history records
      if (patientData.medicalHistory.allergies.length > 0) {
        const allergyRecords = patientData.medicalHistory.allergies.map(allergy => ({
          patient_id: patient.id,
          allergen: allergy,
          severity: 'Unknown'
        }));
        
        await supabase.from('allergies').insert(allergyRecords);
      }

      if (patientData.medicalHistory.medications.length > 0) {
        const medicationRecords = patientData.medicalHistory.medications.map(medication => ({
          patient_id: patient.id,
          medication_name: medication,
          status: 'active'
        }));
        
        await supabase.from('medications').insert(medicationRecords);
      }

      if (patientData.medicalHistory.conditions.length > 0) {
        const conditionRecords = patientData.medicalHistory.conditions.map(condition => ({
          patient_id: patient.id,
          condition_name: condition,
          status: 'active'
        }));
        
        await supabase.from('medical_history').insert(conditionRecords);
      }

      toast({
        title: "Patient Onboarding Complete",
        description: `Successfully created patient record for ${patientData.firstName} ${patientData.lastName}`,
      });

      onComplete(patient.id);
      
    } catch (error) {
      console.error('Error creating patient record:', error);
      toast({
        title: "Error",
        description: "Failed to complete patient onboarding",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
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

      case 2:
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

      case 3:
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

      case 4:
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

      case 5:
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

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="w-6 h-6" />
              Patient Onboarding
            </CardTitle>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
        
        <CardContent>
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h4 className="font-medium text-red-800">Please correct the following errors:</h4>
              </div>
              <ul className="list-disc list-inside text-sm text-red-700">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {renderStep()}

          <div className="flex justify-between mt-8">
            <div>
              {currentStep > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              )}
              <Button variant="ghost" onClick={onCancel} className="ml-2">
                Cancel
              </Button>
            </div>
            
            <div>
              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button onClick={submitPatientData} disabled={loading}>
                  {loading ? 'Completing...' : 'Complete Onboarding'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
