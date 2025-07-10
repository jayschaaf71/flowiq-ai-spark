-- Create app_role enum if it doesn't exist and fix the trigger
DO $$ 
BEGIN
    -- Create the enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM (
            'platform_admin',
            'practice_admin', 
            'practice_manager',
            'provider',
            'staff',
            'billing',
            'patient'
        );
    END IF;
END $$;

-- Fix the handle_new_user function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert with error handling for role conversion
  INSERT INTO public.profiles (id, first_name, last_name, contact_email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    CASE 
      WHEN (new.raw_user_meta_data ->> 'role') IS NOT NULL THEN 
        (new.raw_user_meta_data ->> 'role')::public.app_role
      ELSE 
        'patient'::public.app_role
    END
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error and use default role
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    INSERT INTO public.profiles (id, first_name, last_name, contact_email, role)
    VALUES (
      new.id,
      new.raw_user_meta_data ->> 'first_name',
      new.raw_user_meta_data ->> 'last_name',
      new.email,
      'patient'::public.app_role
    );
    RETURN new;
END;
$$;