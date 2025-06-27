
-- Create a table for scribe settings
CREATE TABLE public.scribe_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.scribe_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own scribe settings" 
  ON public.scribe_settings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scribe settings" 
  ON public.scribe_settings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scribe settings" 
  ON public.scribe_settings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create a unique index to ensure one settings record per user
CREATE UNIQUE INDEX scribe_settings_user_id_idx ON public.scribe_settings(user_id);

-- Create function to handle upsert
CREATE OR REPLACE FUNCTION upsert_scribe_settings(user_uuid UUID, settings_data JSONB)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO public.scribe_settings (user_id, settings, updated_at)
  VALUES (user_uuid, settings_data, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    settings = EXCLUDED.settings,
    updated_at = now()
  RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
