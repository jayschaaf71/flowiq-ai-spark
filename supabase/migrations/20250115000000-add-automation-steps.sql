-- Create automation_steps table for tracking automated insurance processing
CREATE TABLE IF NOT EXISTS public.automation_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
  step TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  details JSONB,
  error TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add automation_status column to claims table
ALTER TABLE public.claims 
ADD COLUMN IF NOT EXISTS automation_status TEXT DEFAULT 'pending' CHECK (automation_status IN ('pending', 'processing', 'completed', 'failed')),
ADD COLUMN IF NOT EXISTS last_automation_step TEXT,
ADD COLUMN IF NOT EXISTS next_automation_step TEXT;

-- Enable RLS on automation_steps table
ALTER TABLE public.automation_steps ENABLE ROW LEVEL SECURITY;

-- RLS policies for automation_steps
CREATE POLICY "Staff can view automation steps" ON public.automation_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

CREATE POLICY "Staff can manage automation steps" ON public.automation_steps
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('staff', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_automation_steps_claim_id ON public.automation_steps(claim_id);
CREATE INDEX idx_automation_steps_status ON public.automation_steps(status);
CREATE INDEX idx_automation_steps_timestamp ON public.automation_steps(timestamp);
CREATE INDEX idx_claims_automation_status ON public.claims(automation_status);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_automation_steps_updated_at
  BEFORE UPDATE ON public.automation_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
