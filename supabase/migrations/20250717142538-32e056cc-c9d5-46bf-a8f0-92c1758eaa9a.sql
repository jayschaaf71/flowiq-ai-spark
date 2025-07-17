-- Add some sample appointments for testing
INSERT INTO public.appointments (date, time, duration, patient_name, email, phone, provider, appointment_type, status, tenant_id) VALUES
('2025-07-17', '09:00:00', 60, 'Sarah Johnson', 'sarah.johnson@email.com', '555-0101', 'Dr. Smith', 'Cleaning', 'confirmed', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('2025-07-17', '10:30:00', 30, 'Mike Wilson', 'mike.wilson@email.com', '555-0102', 'Dr. Jones', 'Consultation', 'pending', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('2025-07-17', '14:00:00', 45, 'Emma Davis', 'emma.davis@email.com', '555-0103', 'Dr. Smith', 'Follow-up', 'confirmed', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('2025-07-17', '15:30:00', 60, 'Jennifer Smith', 'jennifer.smith@email.com', '555-0104', 'Dr. Johnson', 'Consultation', 'confirmed', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('2025-07-17', '16:15:00', 30, 'Mark Johnson', 'mark.johnson@email.com', '555-0105', 'Dr. Smith', 'Cleaning', 'pending', 'd52278c3-bf0d-4731-bfa9-a40f032fa305');

-- Add some sample waitlist entries for testing
INSERT INTO public.appointment_waitlist (patient_name, phone, email, appointment_type, preferred_date, preferred_time, priority, status, notes, tenant_id) VALUES
('Jimmy Jack', '765-345-8765', 'jimmy@test.com', 'Emergency', '2025-07-18', '10:00:00', 'high', 'active', 'Tooth pain, needs urgent care', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('Lisa Chen', '555-0106', 'lisa.chen@email.com', 'Consultation', '2025-07-19', '14:00:00', 'medium', 'active', 'New patient referral', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('Robert Brown', '555-0107', 'robert.brown@email.com', 'Cleaning', '2025-07-20', '09:00:00', 'low', 'contacted', 'Regular cleaning appointment', 'd52278c3-bf0d-4731-bfa9-a40f032fa305');

-- Add some intake forms for testing
INSERT INTO public.intake_forms (title, description, form_fields, is_active, tenant_id) VALUES
('New Patient Intake', 'Comprehensive intake form for new patients', '[
  {"type": "text", "label": "Full Name", "required": true},
  {"type": "email", "label": "Email Address", "required": true},
  {"type": "phone", "label": "Phone Number", "required": true},
  {"type": "date", "label": "Date of Birth", "required": true},
  {"type": "textarea", "label": "Chief Complaint", "required": false},
  {"type": "select", "label": "Insurance Provider", "options": ["Aetna", "BlueCross", "Cigna", "Delta Dental", "Other"], "required": false}
]'::jsonb, true, 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
('Medical History Form', 'Medical history and health questionnaire', '[
  {"type": "checkbox", "label": "Do you have any allergies?", "required": false},
  {"type": "textarea", "label": "List any current medications", "required": false},
  {"type": "checkbox", "label": "Have you had dental work in the past year?", "required": false},
  {"type": "textarea", "label": "Any concerns or questions?", "required": false}
]'::jsonb, true, 'd52278c3-bf0d-4731-bfa9-a40f032fa305');

-- Add some intake submissions for testing
INSERT INTO public.intake_submissions (form_id, submission_data, status, priority_level, ai_summary, tenant_id) VALUES
((SELECT id FROM public.intake_forms WHERE title = 'New Patient Intake' LIMIT 1), 
'{"Full Name": "Mike Wilson", "Email Address": "mike.wilson@email.com", "Phone Number": "555-0102", "Date of Birth": "1985-03-15", "Chief Complaint": "Tooth sensitivity", "Insurance Provider": "Delta Dental"}'::jsonb, 
'pending', 'medium', 'New patient with tooth sensitivity, has Delta Dental insurance', 'd52278c3-bf0d-4731-bfa9-a40f032fa305'),
((SELECT id FROM public.intake_forms WHERE title = 'Medical History Form' LIMIT 1), 
'{"Do you have any allergies?": true, "List any current medications": "Lisinopril 10mg daily", "Have you had dental work in the past year?": false, "Any concerns or questions?": "Concerned about gum bleeding"}'::jsonb, 
'review', 'high', 'Patient has allergies and takes blood pressure medication, concerned about gum bleeding', 'd52278c3-bf0d-4731-bfa9-a40f032fa305');