-- Pilot Production: Add Patient Notifications System
-- This migration adds the missing patient notification tables for production pilot

-- Create patient notifications table
CREATE TABLE IF NOT EXISTS public.patient_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('appointment', 'reminder', 'billing', 'health', 'general')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notification preferences table
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  appointment_reminders BOOLEAN DEFAULT true,
  treatment_updates BOOLEAN DEFAULT true,
  educational_content BOOLEAN DEFAULT true,
  billing_notifications BOOLEAN DEFAULT true,
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT false,
  push_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, tenant_id)
);

-- Create two-factor authentication table
CREATE TABLE IF NOT EXISTS public.user_2fa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  backup_codes TEXT[],
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.patient_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_2fa ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patient_notifications
CREATE POLICY "Users can view notifications for their tenant" ON public.patient_notifications
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Users can update their own notifications" ON public.patient_notifications
  FOR UPDATE USING (
    patient_id = auth.uid() OR
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- RLS Policies for notification_preferences
CREATE POLICY "Users can view their own preferences" ON public.notification_preferences
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences" ON public.notification_preferences
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for user_2fa
CREATE POLICY "Users can view their own 2FA settings" ON public.user_2fa
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own 2FA settings" ON public.user_2fa
  FOR UPDATE USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patient_notifications_patient_id ON public.patient_notifications(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_notifications_tenant_id ON public.patient_notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_patient_notifications_type ON public.patient_notifications(type);
CREATE INDEX IF NOT EXISTS idx_patient_notifications_created_at ON public.patient_notifications(created_at);

-- Insert default notification preferences for existing users
INSERT INTO public.notification_preferences (user_id, tenant_id, appointment_reminders, treatment_updates, educational_content, billing_notifications)
SELECT 
  tu.user_id,
  tu.tenant_id,
  true,
  true,
  true,
  true
FROM public.tenant_users tu
WHERE tu.is_active = true
ON CONFLICT (user_id, tenant_id) DO NOTHING; 