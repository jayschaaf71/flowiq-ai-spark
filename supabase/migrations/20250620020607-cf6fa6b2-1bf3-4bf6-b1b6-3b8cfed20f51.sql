
-- Fix the infinite recursion in profiles table policies
-- First, drop all existing policies that might be causing recursion
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for users to their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- Create simple, non-recursive policies that don't call functions
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_policy" ON public.profiles  
FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Fix the get_current_user_role function to be more stable and prevent recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1),
    'patient'::text
  );
$$;

-- Create RLS policies for appointments table if they don't exist
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Staff can delete appointments" ON public.appointments;

CREATE POLICY "appointments_patient_select" ON public.appointments
FOR SELECT USING (
  auth.uid() = patient_id OR 
  public.get_current_user_role() IN ('staff', 'admin')
);

CREATE POLICY "appointments_staff_insert" ON public.appointments
FOR INSERT WITH CHECK (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "appointments_staff_update" ON public.appointments
FOR UPDATE USING (public.get_current_user_role() IN ('staff', 'admin'));

CREATE POLICY "appointments_staff_delete" ON public.appointments
FOR DELETE USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Enable RLS on providers table and add policies
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active providers" ON public.providers;
DROP POLICY IF EXISTS "Staff can manage providers" ON public.providers;

CREATE POLICY "providers_public_select" ON public.providers
FOR SELECT USING (is_active = true);

CREATE POLICY "providers_staff_all" ON public.providers
FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Create availability slots table for better scheduling
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on availability_slots
ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "availability_public_select" ON public.availability_slots
FOR SELECT USING (true);

CREATE POLICY "availability_staff_all" ON public.availability_slots
FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Create schedule_templates table for recurring availability
CREATE TABLE IF NOT EXISTS public.schedule_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration INTEGER NOT NULL DEFAULT 60,
  buffer_time INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on schedule_templates
ALTER TABLE public.schedule_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "schedule_templates_public_select" ON public.schedule_templates
FOR SELECT USING (is_active = true);

CREATE POLICY "schedule_templates_staff_all" ON public.schedule_templates
FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Create notification_queue table for managing reminders
CREATE TABLE IF NOT EXISTS public.notification_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('confirmation', 'reminder', 'cancellation', 'rescheduled')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  retry_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on notification_queue
ALTER TABLE public.notification_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notification_queue_staff_all" ON public.notification_queue
FOR ALL USING (public.get_current_user_role() IN ('staff', 'admin'));

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_availability_slots_provider_date ON public.availability_slots(provider_id, date);
CREATE INDEX IF NOT EXISTS idx_availability_slots_date_time ON public.availability_slots(date, start_time);
CREATE INDEX IF NOT EXISTS idx_schedule_templates_provider_day ON public.schedule_templates(provider_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled ON public.notification_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_appointments_patient_date ON public.appointments(patient_id, date);
CREATE INDEX IF NOT EXISTS idx_appointments_provider_date ON public.appointments(provider_id, date);
