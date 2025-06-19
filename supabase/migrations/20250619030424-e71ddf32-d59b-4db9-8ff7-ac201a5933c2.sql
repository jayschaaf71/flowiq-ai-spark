
-- Enable RLS on intake_forms table (if not already enabled)
ALTER TABLE public.intake_forms ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to create intake forms
-- (Since this appears to be a practice management system, we'll allow authenticated users to create forms)
CREATE POLICY "Allow authenticated users to create intake forms" 
  ON public.intake_forms 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow anyone to read intake forms
CREATE POLICY "Allow authenticated users to read intake forms" 
  ON public.intake_forms 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to update intake forms
CREATE POLICY "Allow authenticated users to update intake forms" 
  ON public.intake_forms 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to delete intake forms
CREATE POLICY "Allow authenticated users to delete intake forms" 
  ON public.intake_forms 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Also add policies for intake_submissions table to handle form submissions
ALTER TABLE public.intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to submit intake forms" 
  ON public.intake_submissions 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read submissions" 
  ON public.intake_submissions 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Add policies for intake_analytics table
ALTER TABLE public.intake_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to create analytics" 
  ON public.intake_analytics 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read analytics" 
  ON public.intake_analytics 
  FOR SELECT 
  TO authenticated
  USING (true);
