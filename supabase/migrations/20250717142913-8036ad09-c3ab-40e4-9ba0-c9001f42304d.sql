-- Check if intake forms already exist, if not add them
INSERT INTO public.intake_forms (title, description, form_fields, is_active, tenant_id) 
SELECT 'New Patient Intake', 'Comprehensive intake form for new patients', '[
  {"type": "text", "label": "Full Name", "required": true},
  {"type": "email", "label": "Email Address", "required": true},
  {"type": "phone", "label": "Phone Number", "required": true},
  {"type": "date", "label": "Date of Birth", "required": true},
  {"type": "textarea", "label": "Chief Complaint", "required": false},
  {"type": "select", "label": "Insurance Provider", "options": ["Aetna", "BlueCross", "Cigna", "Delta Dental", "Other"], "required": false}
]'::jsonb, true, 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
WHERE NOT EXISTS (
  SELECT 1 FROM public.intake_forms 
  WHERE title = 'New Patient Intake' AND tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
);

INSERT INTO public.intake_forms (title, description, form_fields, is_active, tenant_id)
SELECT 'Medical History Form', 'Medical history and health questionnaire', '[
  {"type": "checkbox", "label": "Do you have any allergies?", "required": false},
  {"type": "textarea", "label": "List any current medications", "required": false},
  {"type": "checkbox", "label": "Have you had dental work in the past year?", "required": false},
  {"type": "textarea", "label": "Any concerns or questions?", "required": false}
]'::jsonb, true, 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
WHERE NOT EXISTS (
  SELECT 1 FROM public.intake_forms 
  WHERE title = 'Medical History Form' AND tenant_id = 'd52278c3-bf0d-4731-bfa9-a40f032fa305'
);