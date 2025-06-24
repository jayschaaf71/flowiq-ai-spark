
-- Create table to store onboarding progress
CREATE TABLE public.onboarding_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  tenant_id UUID REFERENCES public.tenants NULL,
  current_step INTEGER NOT NULL DEFAULT 0,
  form_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see their own onboarding progress
CREATE POLICY "Users can view their own onboarding progress" 
  ON public.onboarding_progress 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own onboarding progress
CREATE POLICY "Users can create their own onboarding progress" 
  ON public.onboarding_progress 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own onboarding progress
CREATE POLICY "Users can update their own onboarding progress" 
  ON public.onboarding_progress 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own onboarding progress
CREATE POLICY "Users can delete their own onboarding progress" 
  ON public.onboarding_progress 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create table for team member invitations
CREATE TABLE public.team_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants NOT NULL,
  invited_by UUID REFERENCES auth.users NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  personal_message TEXT,
  invitation_token UUID NOT NULL DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'pending',
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS for team invitations
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- Users can view invitations for their tenant
CREATE POLICY "Users can view invitations for their tenant" 
  ON public.team_invitations 
  FOR SELECT 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Users can create invitations for their tenant
CREATE POLICY "Users can create invitations for their tenant" 
  ON public.team_invitations 
  FOR INSERT 
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
    AND invited_by = auth.uid()
  );

-- Users can update invitations for their tenant
CREATE POLICY "Users can update invitations for their tenant" 
  ON public.team_invitations 
  FOR UPDATE 
  USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_onboarding_progress_updated_at
  BEFORE UPDATE ON public.onboarding_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

CREATE TRIGGER update_team_invitations_updated_at
  BEFORE UPDATE ON public.team_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_set_timestamp();

-- Add indexes for better performance
CREATE INDEX idx_onboarding_progress_user_id ON public.onboarding_progress(user_id);
CREATE INDEX idx_onboarding_progress_tenant_id ON public.onboarding_progress(tenant_id);
CREATE INDEX idx_team_invitations_tenant_id ON public.team_invitations(tenant_id);
CREATE INDEX idx_team_invitations_token ON public.team_invitations(invitation_token);
CREATE INDEX idx_team_invitations_email ON public.team_invitations(email);
