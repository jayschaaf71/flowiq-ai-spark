
-- Create providers table with enhanced fields for team management
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'hygienist', 'assistant', 'receptionist', 'admin')),
  specialty TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  hire_date DATE,
  avatar_url TEXT,
  working_hours JSONB DEFAULT '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "17:00"}, "saturday": null, "sunday": null}'::jsonb,
  hourly_rate DECIMAL(10,2),
  salary DECIMAL(10,2),
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create team performance metrics table
CREATE TABLE IF NOT EXISTS public.team_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_member_id UUID NOT NULL REFERENCES public.team_members(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  appointments_completed INTEGER DEFAULT 0,
  hours_worked DECIMAL(4,2) DEFAULT 0,
  patient_satisfaction_rating DECIMAL(3,2),
  revenue_generated DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(team_member_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_performance ENABLE ROW LEVEL SECURITY;

-- Create policies for team_members
CREATE POLICY "Staff can view all team members" 
  ON public.team_members 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Admin can manage team members" 
  ON public.team_members 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create policies for team_performance
CREATE POLICY "Staff can view team performance" 
  ON public.team_performance 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Admin can manage team performance" 
  ON public.team_performance 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for team_members
CREATE TRIGGER update_team_members_updated_at 
    BEFORE UPDATE ON public.team_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample team members
INSERT INTO public.team_members (first_name, last_name, email, phone, role, specialty, status, hire_date) VALUES
('Sarah', 'Johnson', 'sarah.johnson@practice.com', '(555) 123-4567', 'doctor', 'General Dentistry', 'active', '2023-01-15'),
('Maria', 'Rodriguez', 'maria.rodriguez@practice.com', '(555) 234-5678', 'hygienist', 'Dental Hygiene', 'active', '2023-03-10'),
('James', 'Wilson', 'james.wilson@practice.com', '(555) 345-6789', 'assistant', 'Dental Assistant', 'active', '2023-05-20'),
('Emily', 'Chen', 'emily.chen@practice.com', '(555) 456-7890', 'receptionist', 'Front Desk', 'active', '2023-02-01'),
('Michael', 'Brown', 'michael.brown@practice.com', '(555) 567-8901', 'doctor', 'Orthodontics', 'active', '2022-12-01')
ON CONFLICT (email) DO NOTHING;

-- Insert sample performance data
INSERT INTO public.team_performance (team_member_id, date, appointments_completed, hours_worked, patient_satisfaction_rating, revenue_generated)
SELECT 
  tm.id,
  CURRENT_DATE,
  CASE 
    WHEN tm.role = 'doctor' THEN 8
    WHEN tm.role = 'hygienist' THEN 6
    WHEN tm.role = 'assistant' THEN 12
    ELSE 0
  END,
  CASE 
    WHEN tm.role = 'receptionist' THEN 8.0
    ELSE 7.5
  END,
  4.7 + (RANDOM() * 0.3),
  CASE 
    WHEN tm.role = 'doctor' THEN 1200 + (RANDOM() * 800)
    WHEN tm.role = 'hygienist' THEN 600 + (RANDOM() * 200)
    ELSE 0
  END
FROM public.team_members tm
WHERE tm.status = 'active'
ON CONFLICT (team_member_id, date) DO NOTHING;
