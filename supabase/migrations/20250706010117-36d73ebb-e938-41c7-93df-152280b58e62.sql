-- Create 2FA settings table
CREATE TABLE public.user_2fa_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  secret_key TEXT,
  backup_codes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE,
  last_used_backup_code_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Create 2FA attempts log table
CREATE TABLE public.user_2fa_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  attempt_type TEXT NOT NULL, -- 'totp', 'backup_code'
  success BOOLEAN NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_2fa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for 2FA settings
CREATE POLICY "Users can view their own 2FA settings" 
ON public.user_2fa_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own 2FA settings" 
ON public.user_2fa_settings 
FOR ALL 
USING (auth.uid() = user_id);

-- Create policies for 2FA attempts
CREATE POLICY "Users can view their own 2FA attempts" 
ON public.user_2fa_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can insert 2FA attempts" 
ON public.user_2fa_attempts 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_2fa_settings_updated_at
BEFORE UPDATE ON public.user_2fa_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();