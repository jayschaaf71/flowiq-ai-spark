-- Create patient notifications table for in-app notifications
CREATE TABLE public.patient_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create billing communication logs table
CREATE TABLE public.billing_communication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  appointment_id UUID,
  bill_amount NUMERIC NOT NULL,
  bill_description TEXT NOT NULL,
  due_date DATE NOT NULL,
  notification_channels TEXT[] NOT NULL DEFAULT '{}',
  delivery_results JSONB NOT NULL DEFAULT '[]',
  total_sent INTEGER NOT NULL DEFAULT 0,
  total_failed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.patient_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_communication_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for patient notifications
CREATE POLICY "Patients can view their own notifications" 
  ON public.patient_notifications 
  FOR SELECT 
  USING (patient_id = auth.uid());

CREATE POLICY "Staff can manage all notifications" 
  ON public.patient_notifications 
  FOR ALL 
  USING (get_current_user_role() = ANY(ARRAY['staff', 'admin']));

CREATE POLICY "System can create notifications" 
  ON public.patient_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for billing communication logs
CREATE POLICY "Staff can view billing communication logs" 
  ON public.billing_communication_logs 
  FOR SELECT 
  USING (get_current_user_role() = ANY(ARRAY['staff', 'admin']));

CREATE POLICY "System can create billing logs" 
  ON public.billing_communication_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Add updated_at trigger for both tables
CREATE TRIGGER update_patient_notifications_updated_at
  BEFORE UPDATE ON public.patient_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_communication_logs_updated_at
  BEFORE UPDATE ON public.billing_communication_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_patient_notifications_patient_id ON public.patient_notifications(patient_id);
CREATE INDEX idx_patient_notifications_created_at ON public.patient_notifications(created_at DESC);
CREATE INDEX idx_patient_notifications_is_read ON public.patient_notifications(is_read);

CREATE INDEX idx_billing_communication_logs_patient_id ON public.billing_communication_logs(patient_id);
CREATE INDEX idx_billing_communication_logs_created_at ON public.billing_communication_logs(created_at DESC);