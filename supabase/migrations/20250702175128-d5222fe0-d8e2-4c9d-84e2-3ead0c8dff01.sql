-- Insert sample data with correct gender values

-- Insert sample patients using correct gender values
INSERT INTO public.patients (
  first_name, last_name, email, phone, date_of_birth, gender,
  address_line1, city, state, zip_code, emergency_contact_name, emergency_contact_phone
) VALUES
('John', 'Smith', 'john.smith@flowiq.com', '555-1001', '1985-03-15', 'male', 
 '123 Main St', 'Springfield', 'IL', '62701', 'Jane Smith', '555-1011'),
('Sarah', 'Davis', 'sarah.davis@flowiq.com', '555-1002', '1978-07-22', 'female', 
 '456 Oak Ave', 'Springfield', 'IL', '62702', 'Tom Davis', '555-1012'),
('Michael', 'Brown', 'michael.brown@flowiq.com', '555-1003', '1990-11-08', 'male', 
 '789 Pine St', 'Springfield', 'IL', '62703', 'Lisa Brown', '555-1013');

-- Insert today's sample appointments
INSERT INTO public.appointments (
  patient_id, provider_id, title, appointment_type, date, time, duration, status, notes
) 
SELECT 
  (SELECT id FROM public.patients WHERE email = 'john.smith@flowiq.com' LIMIT 1),
  (SELECT id FROM public.providers WHERE email = 'dr.johnson@example.com' LIMIT 1),
  'Adjustment Session - John Smith',
  'Adjustment Session',
  CURRENT_DATE,
  '10:00',
  60,
  'confirmed',
  'Lower back pain follow-up'
WHERE EXISTS (SELECT 1 FROM public.patients WHERE email = 'john.smith@flowiq.com') 
AND EXISTS (SELECT 1 FROM public.providers WHERE email = 'dr.johnson@example.com');

INSERT INTO public.appointments (
  patient_id, provider_id, title, appointment_type, date, time, duration, status, notes
) 
SELECT 
  (SELECT id FROM public.patients WHERE email = 'sarah.davis@flowiq.com' LIMIT 1),
  (SELECT id FROM public.providers WHERE email = 'dr.chen@example.com' LIMIT 1),
  'Sleep Consultation - Sarah Davis',
  'Sleep Consultation',
  CURRENT_DATE,
  '14:00',
  120,
  'confirmed',
  'Sleep apnea evaluation'
WHERE EXISTS (SELECT 1 FROM public.patients WHERE email = 'sarah.davis@flowiq.com') 
AND EXISTS (SELECT 1 FROM public.providers WHERE email = 'dr.chen@example.com');