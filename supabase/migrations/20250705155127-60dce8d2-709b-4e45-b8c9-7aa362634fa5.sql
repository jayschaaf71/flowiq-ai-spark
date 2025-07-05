-- Create missing tables for scheduling features

-- Create appointment_waitlist table
CREATE TABLE IF NOT EXISTS public.appointment_waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  appointment_type TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TIME,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  specialty TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create provider_notifications table  
CREATE TABLE IF NOT EXISTS public.provider_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.appointment_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for appointment_waitlist
CREATE POLICY "Staff can manage waitlist" 
ON public.appointment_waitlist FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for team_members
CREATE POLICY "Staff can view team members" 
ON public.team_members FOR SELECT 
TO authenticated 
USING (auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage team members" 
ON public.team_members FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- RLS policies for provider_notifications
CREATE POLICY "Providers can view their notifications" 
ON public.provider_notifications FOR SELECT 
TO authenticated 
USING (provider_id = auth.uid()::text OR auth.role() = 'staff'::text);

CREATE POLICY "Staff can manage all notifications" 
ON public.provider_notifications FOR ALL 
TO authenticated 
USING (auth.role() = 'staff'::text);

-- Add triggers
CREATE TRIGGER update_appointment_waitlist_updated_at
  BEFORE UPDATE ON public.appointment_waitlist
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_provider_notifications_updated_at
  BEFORE UPDATE ON public.provider_notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample team members
INSERT INTO public.team_members (first_name, last_name, email, role, status, specialty) VALUES
('Dr. John', 'Smith', 'john.smith@clinic.com', 'provider', 'active', 'General Practice'),
('Sarah', 'Johnson', 'sarah.johnson@clinic.com', 'staff', 'active', 'Administration'),
('Mike', 'Wilson', 'mike.wilson@clinic.com', 'provider', 'active', 'Chiropractic');