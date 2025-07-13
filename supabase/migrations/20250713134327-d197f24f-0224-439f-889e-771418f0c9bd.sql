-- Production Database Setup - Step 2
-- Configure tenant settings and add production-ready data

-- Step 1: Update tenant settings with production-ready configurations
UPDATE public.tenants 
SET settings = jsonb_build_object(
  'features', jsonb_build_object(
    'appointments', true,
    'patients', true,
    'intake_forms', true,
    'communication', true,
    'analytics', true,
    'team_management', true
  ),
  'notifications', jsonb_build_object(
    'email_enabled', true,
    'sms_enabled', true,
    'appointment_reminders', true
  ),
  'branding', jsonb_build_object(
    'custom_logo', true,
    'custom_colors', true,
    'white_label', false
  ),
  'security', jsonb_build_object(
    'two_factor_required', false,
    'session_timeout_minutes', 480,
    'password_policy_enabled', true
  )
)
WHERE id IN (
  'd52278c3-bf0d-4731-bfa9-a40f032fa305', -- Midwest Dental Sleep
  '024e36c1-a1bc-44d0-8805-3162ba59a0c2'  -- West County Spine
);

-- Step 2: Ensure proper tenant user relationships
INSERT INTO public.tenant_users (tenant_id, user_id, role, is_active, joined_at)
VALUES 
-- Ensure platform admin has access to both tenants
('d52278c3-bf0d-4731-bfa9-a40f032fa305', '00463e37-5591-45c5-b8b9-03e31302cb62', 'owner', true, now()),
('024e36c1-a1bc-44d0-8805-3162ba59a0c2', '00463e37-5591-45c5-b8b9-03e31302cb62', 'owner', true, now())
ON CONFLICT (tenant_id, user_id) DO UPDATE SET
  is_active = true,
  updated_at = now();

-- Step 3: Add provider schedules for production readiness
INSERT INTO public.provider_schedules (
  provider_id, day_of_week, start_time, end_time, is_available, 
  break_start_time, break_end_time, tenant_id
)
SELECT 
  p.id,
  generate_series(1, 5) as day_of_week, -- Monday to Friday
  '08:00'::time as start_time,
  '17:00'::time as end_time,
  true as is_available,
  '12:00'::time as break_start_time,
  '13:00'::time as break_end_time,
  p.tenant_id
FROM public.providers p
WHERE p.tenant_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Step 4: Create default email templates for both practices
INSERT INTO public.email_templates (name, subject, body, tenant_id, variables)
VALUES 
-- Midwest Dental Sleep templates
('Appointment Confirmation', 'Appointment Confirmation - {{practice_name}}', 
 'Dear {{patient_name}},

Your appointment has been confirmed for {{appointment_date}} at {{appointment_time}}.

Please arrive 15 minutes early for check-in.

Best regards,
{{practice_name}}',
 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
 ARRAY['patient_name', 'appointment_date', 'appointment_time', 'practice_name']),
 
('Appointment Reminder', 'Appointment Reminder - {{practice_name}}', 
 'Dear {{patient_name}},

This is a reminder of your upcoming appointment tomorrow at {{appointment_time}}.

If you need to reschedule, please call us at {{practice_phone}}.

Best regards,
{{practice_name}}',
 'd52278c3-bf0d-4731-bfa9-a40f032fa305',
 ARRAY['patient_name', 'appointment_time', 'practice_phone', 'practice_name']),

-- West County Spine templates  
('Appointment Confirmation', 'Appointment Confirmation - {{practice_name}}', 
 'Dear {{patient_name}},

Your appointment has been confirmed for {{appointment_date}} at {{appointment_time}}.

Please arrive 15 minutes early for check-in.

Best regards,
{{practice_name}}',
 '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
 ARRAY['patient_name', 'appointment_date', 'appointment_time', 'practice_name']),
 
('Appointment Reminder', 'Appointment Reminder - {{practice_name}}', 
 'Dear {{patient_name}},

This is a reminder of your upcoming appointment tomorrow at {{appointment_time}}.

If you need to reschedule, please call us at {{practice_phone}}.

Best regards,
{{practice_name}}',
 '024e36c1-a1bc-44d0-8805-3162ba59a0c2',
 ARRAY['patient_name', 'appointment_time', 'practice_phone', 'practice_name']);