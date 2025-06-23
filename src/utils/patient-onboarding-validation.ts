
import { PatientData } from "@/types/patient-onboarding";

export const validatePatientStep = (step: number, patientData: PatientData): string[] => {
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
  
  return errors;
};
