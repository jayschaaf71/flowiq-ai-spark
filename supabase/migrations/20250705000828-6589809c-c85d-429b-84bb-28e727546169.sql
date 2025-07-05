-- Create table for 2FA settings and backup codes
CREATE TABLE public.user_2fa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  secret_key TEXT,
  backup_codes TEXT[], -- Encrypted backup codes
  last_used_backup_code_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.user_2fa_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own 2FA settings" 
ON public.user_2fa_settings FOR ALL 
TO authenticated 
USING (user_id = auth.uid());

-- Create table for 2FA verification attempts (security monitoring)
CREATE TABLE public.user_2fa_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  attempt_type TEXT NOT NULL, -- 'totp', 'backup_code'
  success BOOLEAN NOT NULL DEFAULT false,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.user_2fa_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own 2FA attempts" 
ON public.user_2fa_attempts FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

CREATE POLICY "System can log 2FA attempts" 
ON public.user_2fa_attempts FOR INSERT 
WITH CHECK (true);

-- Add trigger for updated_at timestamps
CREATE TRIGGER update_user_2fa_settings_updated_at
  BEFORE UPDATE ON public.user_2fa_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_user_2fa_settings_user_id ON public.user_2fa_settings(user_id);
CREATE INDEX idx_user_2fa_attempts_user_id ON public.user_2fa_attempts(user_id);
CREATE INDEX idx_user_2fa_attempts_created_at ON public.user_2fa_attempts(created_at);