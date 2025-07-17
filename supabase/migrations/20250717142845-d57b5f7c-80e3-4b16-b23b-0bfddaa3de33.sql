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
]'::jsonb, true, 'd52278c3-bf0d-4731-bfa9-a40f032fa305') 
ON CONFLICT (title, tenant_id) DO NOTHING;

-- Add some intake submissions for testing
INSERT INTO public.intake_submissions (form_id, submission_data, status, priority_level, ai_summary, tenant_id) 
SELECT 
  f.id,
  '{"Full Name": "Mike Wilson", "Email Address": "mike.wilson@email.com", "Phone Number": "555-0102", "Date of Birth": "1985-03-15", "Chief Complaint": "Tooth sensitivity", "Insurance Provider": "Delta Dental"}'::jsonb,
  'pending',
  'medium',
  'New patient with tooth sensitivity, has Delta Dental insurance',
  'd52278c3-bf0d-4731-bfa9-a40f032fa305'
FROM public.intake_forms f 
WHERE f.title = 'New Patient Intake' AND f.tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO public.intake_submissions (form_id, submission_data, status, priority_level, ai_summary, tenant_id)
SELECT 
  f.id,
  '{"Do you have any allergies?": true, "List any current medications": "Lisinopril 10mg daily", "Have you had dental work in the past year?": false, "Any concerns or questions?": "Concerned about gum bleeding"}'::jsonb,
  'review', 
  'high',
  'Patient has allergies and takes blood pressure medication, concerned about gum bleeding',
  'd52278c3-bf0d-4731-bfa9-a40f032fa305'
FROM public.intake_forms f 
WHERE f.title = 'Medical History Form' AND f.tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
LIMIT 1
ON CONFLICT DO NOTHING;