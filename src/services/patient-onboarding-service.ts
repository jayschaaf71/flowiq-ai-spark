
import { supabase } from "@/integrations/supabase/client";
import { PatientData } from "@/types/patient-onboarding";

export const submitPatientOnboardingData = async (patientData: PatientData) => {
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
      address: patientData.address.street,
      city: patientData.address.city,
      state: patientData.address.state,
      zip_code: patientData.address.zipCode,
      emergency_contact_name: patientData.emergencyContact.name,
      emergency_contact_phone: patientData.emergencyContact.phone
    })
    .select()
    .single();

  if (patientError) throw patientError;

  // Convert PatientData to JSON-serializable format for Supabase
  const formDataJson = JSON.parse(JSON.stringify(patientData));

  // Create intake submission record with patient link
  const { data: submission, error: submissionError } = await supabase
    .from('intake_submissions')
    .insert({
      form_id: 'onboarding-workflow',
      patient_id: patient.id,
      submission_data: formDataJson,
      status: 'completed',
      ai_summary: `New patient onboarding completed for ${patientData.firstName} ${patientData.lastName}. Insurance: ${patientData.insurance.provider}. Emergency contact: ${patientData.emergencyContact.name}.`
    })
    .select()
    .single();

  if (submissionError) throw submissionError;

  // Mock create medical history records since tables don't exist
  console.log('Mock creating medical history records for patient:', patient.id);
  console.log('Allergies:', patientData.medicalHistory.allergies);
  console.log('Medications:', patientData.medicalHistory.medications);
  console.log('Conditions:', patientData.medicalHistory.conditions);

  return patient;
};
