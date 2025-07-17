-- Add sample appointments with valid status values
INSERT INTO public.appointments (date, time, duration, patient_name, email, phone, provider, appointment_type, status, tenant_id) VALUES
('2025-07-17', '09:00:00', 60, 'Sarah Johnson', 'sarah.johnson@email.com', '555-0101', 'Dr. Smith', 'Cleaning', 'scheduled', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('2025-07-17', '10:30:00', 30, 'Mike Wilson', 'mike.wilson@email.com', '555-0102', 'Dr. Jones', 'Consultation', 'scheduled', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('2025-07-17', '14:00:00', 45, 'Emma Davis', 'emma.davis@email.com', '555-0103', 'Dr. Smith', 'Follow-up', 'scheduled', 'd52278c3-bf0d-4731-bfa9-a40f032fa305');

-- Add sample waitlist entries  
INSERT INTO public.appointment_waitlist (patient_name, phone, email, appointment_type, preferred_date, preferred_time, priority, status, notes, tenant_id) VALUES
('Jimmy Jack', '765-345-8765', 'jimmy@test.com', 'Emergency', '2025-07-18', '10:00:00', 'high', 'active', 'Tooth pain, needs urgent care', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('Lisa Chen', '555-0106', 'lisa.chen@email.com', 'Consultation', '2025-07-19', '14:00:00', 'medium', 'active', 'New patient referral', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('Robert Brown', '555-0107', 'robert.brown@email.com', 'Cleaning', '2025-07-20', '09:00:00', 'low', 'contacted', 'Regular cleaning appointment', 'd52278c3-bf0d-4731-bfa9-a40f032fa305');