-- Insert sample data using existing table structures

-- Insert sample patients using existing table structure
INSERT INTO public.patients (
  first_name, last_name, email, phone, date_of_birth, gender,
  address_line1, city, state, zip_code, emergency_contact_name, emergency_contact_phone
) VALUES
('John', 'Smith', 'john.smith@example.com', '555-1001', '1985-03-15', 'Male', 
 '123 Main St', 'Springfield', 'IL', '62701', 'Jane Smith', '555-1011'),
('Sarah', 'Davis', 'sarah.davis@example.com', '555-1002', '1978-07-22', 'Female', 
 '456 Oak Ave', 'Springfield', 'IL', '62702', 'Tom Davis', '555-1012'),
('Michael', 'Brown', 'michael.brown@example.com', '555-1003', '1990-11-08', 'Male', 
 '789 Pine St', 'Springfield', 'IL', '62703', 'Lisa Brown', '555-1013')
ON CONFLICT (email) DO NOTHING;

-- Insert sample appointments using today's date
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
  CURRENT_DATE,
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
CROSS JOIN public.providers pr
WHERE p.email IN ('john.smith@example.com', 'sarah.davis@example.com', 'michael.brown@example.com')
AND pr.email IN ('dr.johnson@example.com', 'dr.chen@example.com', 'dr.williams@example.com')
LIMIT 3
ON CONFLICT DO NOTHING;