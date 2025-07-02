-- Insert sample data for development and testing

-- Insert sample providers using correct table structure
INSERT INTO public.providers (first_name, last_name, specialty, phone, email, working_hours) VALUES
('Dr. Sarah', 'Johnson', 'Chiropractic', '555-0101', 'dr.johnson@example.com', 
 '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}}'),
('Dr. Michael', 'Chen', 'Dental Sleep Medicine', '555-0102', 'dr.chen@example.com',
 '{"monday": {"start": "08:00", "end": "16:00"}, "tuesday": {"start": "08:00", "end": "16:00"}, "wednesday": {"start": "08:00", "end": "16:00"}, "thursday": {"start": "08:00", "end": "16:00"}, "friday": {"start": "08:00", "end": "16:00"}}'),
('Dr. Emily', 'Williams', 'Chiropractic', '555-0103', 'dr.williams@example.com',
 '{"monday": {"start": "10:00", "end": "18:00"}, "tuesday": {"start": "10:00", "end": "18:00"}, "wednesday": {"start": "10:00", "end": "18:00"}, "thursday": {"start": "10:00", "end": "18:00"}, "friday": {"start": "10:00", "end": "18:00"}}')
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointment types
INSERT INTO public.appointment_types (name, duration_minutes, color, description, specialty) VALUES
('Initial Consultation', 90, '#3b82f6', 'Comprehensive evaluation and treatment planning', 'chiropractic'),
('Adjustment Session', 30, '#22c55e', 'Spinal adjustment and therapy', 'chiropractic'),
('Follow-up Visit', 45, '#f59e0b', 'Progress evaluation and continued treatment', 'chiropractic'),
('Sleep Consultation', 120, '#8b5cf6', 'Sleep disorder evaluation and appliance fitting', 'dental-sleep'),
('Appliance Adjustment', 60, '#06b6d4', 'Sleep appliance modification and monitoring', 'dental-sleep'),
('Sleep Study Review', 90, '#ec4899', 'Review sleep study results and treatment planning', 'dental-sleep')
ON CONFLICT DO NOTHING;

-- Insert sample patients
INSERT INTO public.patients (
  first_name, last_name, email, phone, date_of_birth, gender,
  address_line1, city, state, zip_code, insurance_provider, medical_history
) VALUES
('John', 'Smith', 'john.smith@example.com', '555-1001', '1985-03-15', 'Male', 
 '123 Main St', 'Springfield', 'IL', '62701', 'Blue Cross Blue Shield',
 '{"conditions": ["Lower back pain"], "medications": ["Ibuprofen"], "allergies": []}'),
('Sarah', 'Davis', 'sarah.davis@example.com', '555-1002', '1978-07-22', 'Female', 
 '456 Oak Ave', 'Springfield', 'IL', '62702', 'Aetna',
 '{"conditions": ["Sleep apnea", "Neck strain"], "medications": [], "allergies": ["Penicillin"]}'),
('Michael', 'Brown', 'michael.brown@example.com', '555-1003', '1990-11-08', 'Male', 
 '789 Pine St', 'Springfield', 'IL', '62703', 'United Healthcare',
 '{"conditions": ["Sports injury"], "medications": ["Advil"], "allergies": []}')
ON CONFLICT (email) DO NOTHING;