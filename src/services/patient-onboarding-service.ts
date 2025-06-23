
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
      address_line1: patientData.address.street,
      city: patientData.address.city,
      state: patientData.address.state,
      zip_code: patientData.address.zipCode,
      emergency_contact_name: patientData.emergencyContact.name,
      emergency_contact_relationship: patientData.emergencyContact.relationship,
      emergency_contact_phone: patientData.emergencyContact.phone,
      onboarding_completed_at: new Date().toISOString()
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
      patient_name: `${patientData.firstName} ${patientData.lastName}`,
      patient_email: patientData.email,
      patient_phone: patientData.phone,
      form_data: formDataJson,
      status: 'completed',
      ai_summary: `New patient onboarding completed for ${patientData.firstName} ${patientData.lastName}. Insurance: ${patientData.insurance.provider}. Emergency contact: ${patientData.emergencyContact.name}.`,
      patient_id: patient.id
    })
    .select()
    .single();

  if (submissionError) throw submissionError;

  // Update patient record with onboarding submission link
  await supabase
    .from('patients')
    .update({ onboarding_submission_id: submission.id })
    .eq('id', patient.id);

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

  return patient;
};
