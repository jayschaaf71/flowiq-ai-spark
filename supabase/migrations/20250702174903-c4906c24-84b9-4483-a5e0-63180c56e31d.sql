-- Insert sample data for development and testing

-- Insert sample providers
INSERT INTO public.providers (tenant_id, first_name, last_name, title, specialty, license_number, npi_number, phone, email) VALUES
('default', 'Dr. Sarah', 'Johnson', 'DC', 'Chiropractic', 'DC12345', '1234567890', '555-0101', 'dr.johnson@example.com'),
('default', 'Dr. Michael', 'Chen', 'DDS', 'Dental Sleep Medicine', 'DDS67890', '1234567891', '555-0102', 'dr.chen@example.com'),
('default', 'Dr. Emily', 'Williams', 'DC', 'Chiropractic', 'DC11111', '1234567892', '555-0103', 'dr.williams@example.com')
ON CONFLICT DO NOTHING;

-- Insert sample appointment types
INSERT INTO public.appointment_types (tenant_id, name, duration_minutes, color, description, specialty) VALUES
('default', 'Initial Consultation', 90, '#3b82f6', 'Comprehensive evaluation and treatment planning', 'chiropractic'),
('default', 'Adjustment Session', 30, '#22c55e', 'Spinal adjustment and therapy', 'chiropractic'),
('default', 'Follow-up Visit', 45, '#f59e0b', 'Progress evaluation and continued treatment', 'chiropractic'),
('default', 'Sleep Consultation', 120, '#8b5cf6', 'Sleep disorder evaluation and appliance fitting', 'dental-sleep'),
('default', 'Appliance Adjustment', 60, '#06b6d4', 'Sleep appliance modification and monitoring', 'dental-sleep'),
('default', 'Sleep Study Review', 90, '#ec4899', 'Review sleep study results and treatment planning', 'dental-sleep')
ON CONFLICT DO NOTHING;

-- Insert sample provider schedules (Monday-Friday, 9 AM - 5 PM)
INSERT INTO public.provider_schedules (provider_id, day_of_week, start_time, end_time, break_start_time, break_end_time) 
SELECT p.id, d.day_of_week, '09:00', '17:00', '12:00', '13:00'
FROM public.providers p
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(day_of_week)
WHERE p.email IN ('dr.johnson@example.com', 'dr.chen@example.com', 'dr.williams@example.com')
ON CONFLICT DO NOTHING;

-- Insert sample patients
INSERT INTO public.patients (
  tenant_id, first_name, last_name, email, phone, date_of_birth, gender,
  address_line1, city, state, zip_code, insurance_provider, medical_history
) VALUES
('default', 'John', 'Smith', 'john.smith@example.com', '555-1001', '1985-03-15', 'Male', 
 '123 Main St', 'Springfield', 'IL', '62701', 'Blue Cross Blue Shield',
 '{"conditions": ["Lower back pain"], "medications": ["Ibuprofen"], "allergies": []}'),
('default', 'Sarah', 'Davis', 'sarah.davis@example.com', '555-1002', '1978-07-22', 'Female', 
 '456 Oak Ave', 'Springfield', 'IL', '62702', 'Aetna',
 '{"conditions": ["Sleep apnea", "Neck strain"], "medications": [], "allergies": ["Penicillin"]}'),
('default', 'Michael', 'Brown', 'michael.brown@example.com', '555-1003', '1990-11-08', 'Male', 
 '789 Pine St', 'Springfield', 'IL', '62703', 'United Healthcare',
 '{"conditions": ["Sports injury"], "medications": ["Advil"], "allergies": []}')
ON CONFLICT DO NOTHING;

-- Insert sample appointments for today and this week
INSERT INTO public.appointments (
  patient_id, provider_id, title, appointment_type, date, time, duration, status, notes
) 
SELECT 
  p.id,
  pr.id,
  CASE 
    WHEN p.first_name = 'John' THEN 'Adjustment Session - John Smith'
    WHEN p.first_name = 'Sarah' THEN 'Sleep Consultation - Sarah Davis'
    ELSE 'Follow-up Visit - Michael Brown'
  END,
  CASE 
    WHEN p.first_name = 'John' THEN 'Adjustment Session'
    WHEN p.first_name = 'Sarah' THEN 'Sleep Consultation'
    ELSE 'Follow-up Visit'
  END,
  CURRENT_DATE + INTERVAL '0 days',
  CASE 
    WHEN p.first_name = 'John' THEN '10:00'
    WHEN p.first_name = 'Sarah' THEN '14:00'
    ELSE '16:00'
  END,
  CASE 
    WHEN p.first_name = 'Sarah' THEN 120
    ELSE 60
  END,
  'confirmed',
  'Regular appointment'
FROM public.patients p
JOIN public.providers pr ON (
  (p.first_name = 'John' AND pr.email = 'dr.johnson@example.com') OR
  (p.first_name = 'Sarah' AND pr.email = 'dr.chen@example.com') OR
  (p.first_name = 'Michael' AND pr.email = 'dr.williams@example.com')
)
WHERE p.email IN ('john.smith@example.com', 'sarah.davis@example.com', 'michael.brown@example.com')
ON CONFLICT DO NOTHING;