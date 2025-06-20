
-- Drop existing problematic policies
DROP POLICY IF EXISTS "Staff can view all team members" ON public.team_members;
DROP POLICY IF EXISTS "Admin can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Staff can view team performance" ON public.team_performance;
DROP POLICY IF EXISTS "Admin can manage team performance" ON public.team_performance;

-- Create simpler, non-recursive policies for team_members
CREATE POLICY "Allow authenticated users to view team members" 
  ON public.team_members 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage team members" 
  ON public.team_members 
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Create simpler, non-recursive policies for team_performance
CREATE POLICY "Allow authenticated users to view team performance" 
  ON public.team_performance 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage team performance" 
  ON public.team_performance 
  FOR ALL 
  USING (auth.role() = 'authenticated');
