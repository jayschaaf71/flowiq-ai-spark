-- Create table for Sage AI interactions logging
CREATE TABLE IF NOT EXISTS public.sage_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID,
  question TEXT NOT NULL,
  response TEXT NOT NULL,
  action_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sage_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own Sage interactions" 
ON public.sage_interactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own Sage interactions" 
ON public.sage_interactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Staff can view all Sage interactions in their tenant" 
ON public.sage_interactions 
FOR SELECT 
USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_users 
    WHERE user_id = auth.uid() AND is_active = true
  ) 
  AND has_staff_access(auth.uid())
);

-- Add updated_at trigger
CREATE TRIGGER update_sage_interactions_updated_at
  BEFORE UPDATE ON public.sage_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_sage_interactions_user_id ON public.sage_interactions(user_id);
CREATE INDEX idx_sage_interactions_tenant_id ON public.sage_interactions(tenant_id);
CREATE INDEX idx_sage_interactions_created_at ON public.sage_interactions(created_at);