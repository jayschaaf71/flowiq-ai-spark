-- Fix the handle_new_user function to properly cast the role to app_role enum
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, contact_email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'patient'::app_role)
  );
  RETURN new;
END;
$$;