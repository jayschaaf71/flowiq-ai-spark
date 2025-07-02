-- Continue with specialized tables for AI agents

-- 6. Referrals table for Referral iQ
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  referring_physician_id UUID,
  referring_physician_name TEXT NOT NULL,
  referring_physician_email TEXT,
  referring_practice TEXT,
  referral_date DATE NOT NULL DEFAULT CURRENT_DATE,
  referral_reason TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  outcome_summary TEXT,
  outcome_sent_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. Prior authorizations table
CREATE TABLE IF NOT EXISTS public.prior_authorizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  provider_id UUID REFERENCES public.providers(id),
  insurance_provider_id UUID REFERENCES public.insurance_providers(id),
  procedure_codes TEXT[],
  diagnosis_codes TEXT[],
  requested_date DATE NOT NULL DEFAULT CURRENT_DATE,
  authorization_number TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
  approval_date DATE,
  expiration_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. Eligibility verifications table
CREATE TABLE IF NOT EXISTS public.eligibility_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  insurance_provider_id UUID REFERENCES public.insurance_providers(id),
  verification_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_eligible BOOLEAN,
  coverage_details JSONB DEFAULT '{}',
  copay_amount NUMERIC,
  deductible_amount NUMERIC,
  out_of_pocket_max NUMERIC,
  status TEXT DEFAULT 'verified' CHECK (status IN ('pending', 'verified', 'failed')),
  response_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 9. Patient education tracking
CREATE TABLE IF NOT EXISTS public.patient_education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'article', 'brochure', 'interactive')),
  content_title TEXT NOT NULL,
  content_url TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completion_percentage INTEGER DEFAULT 0,
  quiz_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 10. Drip campaigns table
CREATE TABLE IF NOT EXISTS public.drip_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('appointment_scheduled', 'post_treatment', 'follow_up', 'manual')),
  target_audience JSONB DEFAULT '{}',
  steps JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 11. SOAP notes table for Scribe iQ
CREATE TABLE IF NOT EXISTS public.soap_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  patient_id UUID REFERENCES public.patients(id),
  provider_id UUID REFERENCES public.providers(id),
  appointment_id UUID REFERENCES public.appointments(id),
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  transcription_raw TEXT,
  ai_generated BOOLEAN DEFAULT false,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'finalized')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 12. Payer connections for Claims iQ
CREATE TABLE IF NOT EXISTS public.payer_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  payer_name TEXT NOT NULL,
  connection_type TEXT NOT NULL CHECK (connection_type IN ('clearinghouse', 'direct', 'api')),
  endpoint_url TEXT,
  api_credentials JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  test_mode BOOLEAN DEFAULT true,
  last_successful_connection TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prior_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eligibility_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drip_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payer_connections ENABLE ROW LEVEL SECURITY;