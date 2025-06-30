
-- Create denial patterns table for AI pattern recognition
CREATE TABLE public.denial_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  denial_code TEXT NOT NULL,
  description TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 0,
  auto_correctable BOOLEAN NOT NULL DEFAULT false,
  correction_rules JSONB DEFAULT '[]',
  category TEXT NOT NULL CHECK (category IN ('coding', 'authorization', 'eligibility', 'documentation', 'billing')),
  success_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create denial analytics table for tracking metrics
CREATE TABLE public.denial_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_denials INTEGER NOT NULL DEFAULT 0,
  total_denied_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  auto_correctable_count INTEGER NOT NULL DEFAULT 0,
  auto_correction_success_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  top_denial_reasons JSONB DEFAULT '[]',
  denial_trends JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_denial_patterns_code ON public.denial_patterns(denial_code);
CREATE INDEX idx_denial_patterns_category ON public.denial_patterns(category);
CREATE INDEX idx_denial_patterns_auto_correctable ON public.denial_patterns(auto_correctable);
CREATE INDEX idx_denial_analytics_period ON public.denial_analytics(period_start, period_end);

-- Add trigger for updated_at timestamps
CREATE TRIGGER update_denial_patterns_updated_at
  BEFORE UPDATE ON public.denial_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Insert common denial patterns for AI training
INSERT INTO public.denial_patterns (denial_code, description, frequency, auto_correctable, correction_rules, category, success_rate) VALUES
('CO-97', 'Invalid/missing provider identifier', 25, true, '[{"type": "update_npi", "confidence": 95}]', 'coding', 92.5),
('CO-16', 'Claim lacks information', 18, true, '[{"type": "add_diagnosis", "confidence": 87}]', 'documentation', 87.3),
('CO-24', 'Charges exceed fee schedule', 15, false, '[]', 'billing', 35.2),
('CO-18', 'Duplicate claim/service', 12, true, '[{"type": "check_duplicate", "confidence": 98}]', 'billing', 95.8),
('CO-50', 'Prior authorization required', 10, false, '[{"type": "obtain_auth", "confidence": 65}]', 'authorization', 45.7),
('CO-11', 'Diagnosis inconsistent with procedure', 8, true, '[{"type": "match_diagnosis", "confidence": 78}]', 'coding', 76.4);

-- Insert sample denial analytics
INSERT INTO public.denial_analytics (period_start, period_end, total_denials, total_denied_amount, auto_correctable_count, auto_correction_success_rate, top_denial_reasons, denial_trends) VALUES
('2024-01-01', '2024-01-31', 89, 12450.75, 67, 85.2, 
'[{"reason": "CO-97", "count": 25}, {"reason": "CO-16", "count": 18}, {"reason": "CO-24", "count": 15}]',
'[{"month": "Jan 2024", "count": 89, "amount": 12450.75}]');
