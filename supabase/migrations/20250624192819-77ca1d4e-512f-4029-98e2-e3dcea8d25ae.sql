
-- Create payer connections table for managing insurance payer integrations
CREATE TABLE IF NOT EXISTS public.payer_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payer_name TEXT NOT NULL,
  payer_id TEXT NOT NULL UNIQUE, -- Electronic payer ID
  connection_type TEXT NOT NULL DEFAULT 'edi', -- 'edi', 'api', 'ftp'
  endpoint_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  success_rate NUMERIC DEFAULT 0,
  avg_response_time NUMERIC DEFAULT 0,
  claims_submitted INTEGER DEFAULT 0,
  configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create EDI transactions table for tracking electronic submissions
CREATE TABLE IF NOT EXISTS public.edi_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES public.claims(id),
  payer_connection_id UUID NOT NULL REFERENCES public.payer_connections(id),
  transaction_type TEXT NOT NULL DEFAULT 'claim_submission', -- 'claim_submission', 'eligibility', 'status_inquiry'
  edi_format TEXT NOT NULL DEFAULT 'X12_837', -- EDI format used
  submission_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  acknowledgment_date TIMESTAMP WITH TIME ZONE,
  response_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'submitted', 'acknowledged', 'processed', 'rejected', 'paid'
  control_number TEXT, -- EDI control number
  batch_id TEXT, -- Batch identifier for grouped submissions
  edi_content TEXT, -- Raw EDI content
  response_content TEXT, -- Raw response from payer
  error_codes TEXT[], -- Array of error codes if any
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payer fee schedules table
CREATE TABLE IF NOT EXISTS public.payer_fee_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payer_connection_id UUID NOT NULL REFERENCES public.payer_connections(id),
  procedure_code TEXT NOT NULL,
  fee_amount NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  termination_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(payer_connection_id, procedure_code, effective_date)
);

-- Enable RLS on new tables only
ALTER TABLE public.payer_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.edi_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payer_fee_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for new tables only
CREATE POLICY "Staff can manage payer connections" ON public.payer_connections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage EDI transactions" ON public.edi_transactions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can view payer fee schedules" ON public.payer_fee_schedules
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Insert sample payer connections
INSERT INTO public.payer_connections (payer_name, payer_id, connection_type, endpoint_url, is_active, success_rate, avg_response_time, claims_submitted) VALUES
('Blue Cross Blue Shield', 'BCBS001', 'edi', 'https://edi.bcbs.com/submit', true, 94.5, 2.3, 247),
('Aetna', 'AETNA001', 'api', 'https://api.aetna.com/claims', true, 91.2, 3.1, 189),
('Cigna', 'CIGNA001', 'edi', 'https://edi.cigna.com/submit', true, 87.8, 4.2, 156),
('UnitedHealth', 'UHC001', 'edi', 'https://edi.unitedhealthcare.com/submit', false, 89.6, 5.1, 203)
ON CONFLICT (payer_id) DO NOTHING;

-- Create triggers for updated_at timestamps on new tables
CREATE TRIGGER update_payer_connections_updated_at BEFORE UPDATE ON public.payer_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_edi_transactions_updated_at BEFORE UPDATE ON public.edi_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
