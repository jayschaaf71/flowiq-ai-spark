-- Create dental sleep specific tables for pilot deployment

-- Sleep study results table
CREATE TABLE public.sleep_studies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  study_date DATE NOT NULL,
  study_type TEXT NOT NULL CHECK (study_type IN ('in_lab', 'home_sleep_test', 'split_night')),
  ahi_score DECIMAL(5,2), -- Apnea-Hypopnea Index
  rdi_score DECIMAL(5,2), -- Respiratory Disturbance Index
  oxygen_saturation DECIMAL(5,2),
  sleep_efficiency DECIMAL(5,2),
  total_sleep_time INTEGER, -- in minutes
  rem_sleep_time INTEGER, -- in minutes
  deep_sleep_time INTEGER, -- in minutes
  arousal_index DECIMAL(5,2),
  interpretation TEXT,
  recommendations TEXT,
  severity TEXT CHECK (severity IN ('normal', 'mild', 'moderate', 'severe')),
  study_file_path TEXT,
  technician_notes TEXT,
  physician_notes TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Oral appliances table
CREATE TABLE public.oral_appliances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appliance_type TEXT NOT NULL CHECK (appliance_type IN ('mandibular_advancement', 'tongue_retaining', 'combination')),
  manufacturer TEXT,
  model TEXT,
  serial_number TEXT,
  fitting_date DATE,
  delivery_date DATE,
  titration_range_min DECIMAL(4,1), -- in mm
  titration_range_max DECIMAL(4,1), -- in mm
  current_setting DECIMAL(4,1), -- in mm
  target_setting DECIMAL(4,1), -- in mm
  comfort_rating INTEGER CHECK (comfort_rating BETWEEN 1 AND 10),
  effectiveness_rating INTEGER CHECK (effectiveness_rating BETWEEN 1 AND 10),
  side_effects TEXT[],
  adjustment_history JSONB DEFAULT '[]'::jsonb,
  warranty_expiration DATE,
  replacement_due_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('fitting', 'active', 'adjustment', 'replacement_needed', 'discontinued')),
  notes TEXT,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- DME (Durable Medical Equipment) tracking table
CREATE TABLE public.dme_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  order_type TEXT NOT NULL CHECK (order_type IN ('cpap', 'bipap', 'oral_appliance', 'accessories', 'replacement_parts')),
  supplier_name TEXT,
  supplier_contact TEXT,
  order_date DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  prescription_details JSONB,
  insurance_authorization TEXT,
  authorization_number TEXT,
  denial_reason TEXT,
  appeal_status TEXT,
  tracking_number TEXT,
  cost_estimate DECIMAL(10,2),
  patient_responsibility DECIMAL(10,2),
  insurance_coverage DECIMAL(10,2),
  status TEXT DEFAULT 'ordered' CHECK (status IN ('pending_auth', 'authorized', 'ordered', 'shipped', 'delivered', 'denied', 'cancelled')),
  priority TEXT DEFAULT 'standard' CHECK (priority IN ('urgent', 'standard', 'routine')),
  notes TEXT,
  follow_up_date DATE,
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Titration sessions table
CREATE TABLE public.titration_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appliance_id UUID REFERENCES public.oral_appliances(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('initial_fitting', 'adjustment', 'follow_up', 'final_check')),
  previous_setting DECIMAL(4,1), -- in mm
  new_setting DECIMAL(4,1), -- in mm
  patient_comfort INTEGER CHECK (patient_comfort BETWEEN 1 AND 10),
  symptom_improvement INTEGER CHECK (symptom_improvement BETWEEN 1 AND 10),
  sleep_quality_rating INTEGER CHECK (sleep_quality_rating BETWEEN 1 AND 10),
  side_effects TEXT[],
  jaw_discomfort BOOLEAN DEFAULT false,
  teeth_movement BOOLEAN DEFAULT false,
  dry_mouth BOOLEAN DEFAULT false,
  excessive_salivation BOOLEAN DEFAULT false,
  next_appointment_date DATE,
  goals_met BOOLEAN DEFAULT false,
  provider_notes TEXT,
  patient_feedback TEXT,
  adjustment_reason TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  tenant_id UUID REFERENCES public.tenants(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.sleep_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oral_appliances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dme_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.titration_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sleep_studies
CREATE POLICY "Staff can manage all sleep studies" 
ON public.sleep_studies 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own sleep studies" 
ON public.sleep_studies 
FOR SELECT 
USING (auth.uid() = patient_id);

-- RLS Policies for oral_appliances
CREATE POLICY "Staff can manage all oral appliances" 
ON public.oral_appliances 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own oral appliances" 
ON public.oral_appliances 
FOR SELECT 
USING (auth.uid() = patient_id);

-- RLS Policies for dme_orders
CREATE POLICY "Staff can manage all DME orders" 
ON public.dme_orders 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own DME orders" 
ON public.dme_orders 
FOR SELECT 
USING (auth.uid() = patient_id);

-- RLS Policies for titration_sessions
CREATE POLICY "Staff can manage all titration sessions" 
ON public.titration_sessions 
FOR ALL 
USING (has_staff_access(auth.uid()));

CREATE POLICY "Patients can view their own titration sessions" 
ON public.titration_sessions 
FOR SELECT 
USING (auth.uid() = patient_id);

-- Create triggers for updated_at
CREATE TRIGGER update_sleep_studies_updated_at
BEFORE UPDATE ON public.sleep_studies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_oral_appliances_updated_at
BEFORE UPDATE ON public.oral_appliances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dme_orders_updated_at
BEFORE UPDATE ON public.dme_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_titration_sessions_updated_at
BEFORE UPDATE ON public.titration_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_sleep_studies_patient_id ON public.sleep_studies(patient_id);
CREATE INDEX idx_sleep_studies_study_date ON public.sleep_studies(study_date);
CREATE INDEX idx_sleep_studies_tenant_id ON public.sleep_studies(tenant_id);

CREATE INDEX idx_oral_appliances_patient_id ON public.oral_appliances(patient_id);
CREATE INDEX idx_oral_appliances_status ON public.oral_appliances(status);
CREATE INDEX idx_oral_appliances_tenant_id ON public.oral_appliances(tenant_id);

CREATE INDEX idx_dme_orders_patient_id ON public.dme_orders(patient_id);
CREATE INDEX idx_dme_orders_status ON public.dme_orders(status);
CREATE INDEX idx_dme_orders_order_date ON public.dme_orders(order_date);
CREATE INDEX idx_dme_orders_tenant_id ON public.dme_orders(tenant_id);

CREATE INDEX idx_titration_sessions_patient_id ON public.titration_sessions(patient_id);
CREATE INDEX idx_titration_sessions_appliance_id ON public.titration_sessions(appliance_id);
CREATE INDEX idx_titration_sessions_session_date ON public.titration_sessions(session_date);
CREATE INDEX idx_titration_sessions_tenant_id ON public.titration_sessions(tenant_id);