
// Test utilities for development and testing
export const mockPatientData = {
  id: '1',
  patient_number: 'P000001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '555-0123',
  date_of_birth: '1985-06-15',
  gender: 'male',
  address_line1: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zip_code: '12345',
  is_active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const mockAppointmentData = {
  id: '1',
  patient_id: '1',
  title: 'Initial Consultation',
  appointment_type: 'consultation',
  date: new Date().toISOString().split('T')[0],
  time: '10:00',
  duration: 60,
  status: 'confirmed' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const generateMockId = () => Math.random().toString(36).substr(2, 9);

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
