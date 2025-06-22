
-- Create communication_logs table
CREATE TABLE public.communication_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.intake_submissions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms')),
  recipient TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  template_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff_assignments table
CREATE TABLE public.staff_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID NOT NULL REFERENCES public.intake_submissions(id) ON DELETE CASCADE,
  staff_id TEXT NOT NULL,
  staff_name TEXT NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'transferred')),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at triggers
CREATE TRIGGER update_communication_logs_updated_at
  BEFORE UPDATE ON public.communication_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_assignments_updated_at
  BEFORE UPDATE ON public.staff_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for communication_logs
CREATE POLICY "Users can view communication logs" 
  ON public.communication_logs 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert communication logs" 
  ON public.communication_logs 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update communication logs" 
  ON public.communication_logs 
  FOR UPDATE 
  USING (true);

-- Create RLS policies for staff_assignments
CREATE POLICY "Users can view staff assignments" 
  ON public.staff_assignments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert staff assignments" 
  ON public.staff_assignments 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update staff assignments" 
  ON public.staff_assignments 
  FOR UPDATE 
  USING (true);

-- Create storage policies for patient-files bucket (only if bucket exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'patient-files') THEN
    -- Create storage policies for existing patient-files bucket
    CREATE POLICY "Anyone can upload patient files" 
      ON storage.objects 
      FOR INSERT 
      WITH CHECK (bucket_id = 'patient-files');

    CREATE POLICY "Anyone can view patient files" 
      ON storage.objects 
      FOR SELECT 
      USING (bucket_id = 'patient-files');

    CREATE POLICY "Anyone can update patient files" 
      ON storage.objects 
      FOR UPDATE 
      USING (bucket_id = 'patient-files');

    CREATE POLICY "Anyone can delete patient files" 
      ON storage.objects 
      FOR DELETE 
      USING (bucket_id = 'patient-files');
  END IF;
END
$$;

-- Add indexes for better performance
CREATE INDEX idx_communication_logs_submission_id ON public.communication_logs(submission_id);
CREATE INDEX idx_communication_logs_status ON public.communication_logs(status);
CREATE INDEX idx_staff_assignments_submission_id ON public.staff_assignments(submission_id);
CREATE INDEX idx_staff_assignments_status ON public.staff_assignments(status);
