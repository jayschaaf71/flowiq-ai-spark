-- Add role column to profiles table for proper role-based routing
ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'patient';

-- Update existing profiles to have staff role if they've been through onboarding
-- (This is a reasonable assumption for existing users)
UPDATE public.profiles SET role = 'staff' WHERE role IS NULL OR role = 'patient';