
-- Create claim_denials table for denial management
CREATE TABLE public.claim_denials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID REFERENCES public.claims(id) NOT NULL,
  denial_date DATE NOT NULL,
  denial_amount NUMERIC NOT NULL,
  appeal_status TEXT NOT NULL DEFAULT 'not_appealed',
  notes TEXT,
  auto_correction_attempted BOOLEAN NOT NULL DEFAULT false,
  auto_correction_success BOOLEAN NOT NULL DEFAULT false,
  denial_reason TEXT,
  is_auto_correctable BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create revenue_metrics table for analytics
CREATE TABLE public.revenue_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_collections NUMERIC NOT NULL DEFAULT 0,
  total_charges NUMERIC NOT NULL DEFAULT 0,
  collection_rate NUMERIC NOT NULL DEFAULT 0,
  denial_rate NUMERIC NOT NULL DEFAULT 0,
  average_days_in_ar NUMERIC NOT NULL DEFAULT 0,
  claims_submitted INTEGER NOT NULL DEFAULT 0,
  claims_paid INTEGER NOT NULL DEFAULT 0,
  claims_denied INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payer_performance table for insurance analytics
CREATE TABLE public.payer_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payer_name TEXT NOT NULL,
  collection_rate NUMERIC NOT NULL DEFAULT 0,
  average_payment_days INTEGER NOT NULL DEFAULT 0,
  total_collected NUMERIC NOT NULL DEFAULT 0,
  claims_count INTEGER NOT NULL DEFAULT 0,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing fields to claims table for AI processing
ALTER TABLE public.claims 
ADD COLUMN IF NOT EXISTS ai_confidence_score INTEGER,
ADD COLUMN IF NOT EXISTS days_in_ar INTEGER,
ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'draft';

-- Enable RLS on new tables
ALTER TABLE public.claim_denials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payer_performance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for claim_denials
CREATE POLICY "Users can view claim denials" ON public.claim_denials FOR SELECT USING (true);
CREATE POLICY "Staff can manage claim denials" ON public.claim_denials FOR ALL USING (true);

-- Create RLS policies for revenue_metrics
CREATE POLICY "Users can view revenue metrics" ON public.revenue_metrics FOR SELECT USING (true);
CREATE POLICY "Staff can manage revenue metrics" ON public.revenue_metrics FOR ALL USING (true);

-- Create RLS policies for payer_performance
CREATE POLICY "Users can view payer performance" ON public.payer_performance FOR SELECT USING (true);
CREATE POLICY "Staff can manage payer performance" ON public.payer_performance FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_claim_denials_claim_id ON public.claim_denials(claim_id);
CREATE INDEX idx_claim_denials_denial_date ON public.claim_denials(denial_date);
CREATE INDEX idx_revenue_metrics_period ON public.revenue_metrics(period_start, period_end);
CREATE INDEX idx_payer_performance_period ON public.payer_performance(period_start, period_end);

-- Enable realtime for claims table
ALTER TABLE public.claims REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.claims;

-- Enable realtime for new tables
ALTER TABLE public.claim_denials REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.claim_denials;

ALTER TABLE public.revenue_metrics REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.revenue_metrics;

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_claim_denials_updated_at 
    BEFORE UPDATE ON public.claim_denials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate days in A/R
CREATE OR REPLACE FUNCTION calculate_days_in_ar()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'submitted' AND NEW.submitted_date IS NOT NULL THEN
        NEW.days_in_ar = EXTRACT(days FROM NOW() - NEW.submitted_date);
    ELSIF NEW.status = 'draft' AND NEW.service_date IS NOT NULL THEN
        NEW.days_in_ar = EXTRACT(days FROM NOW() - NEW.service_date);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_claims_days_in_ar
    BEFORE INSERT OR UPDATE ON public.claims
    FOR EACH ROW EXECUTE FUNCTION calculate_days_in_ar();
