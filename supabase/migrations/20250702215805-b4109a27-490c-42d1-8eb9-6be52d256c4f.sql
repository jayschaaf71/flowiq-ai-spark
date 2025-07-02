-- First, add tenant_id columns to existing tables where needed
DO $$ 
BEGIN
  -- Add tenant_id to appointments if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.appointments ADD COLUMN tenant_id UUID;
  END IF;
  
  -- Add tenant_id to claims if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'claims' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.claims ADD COLUMN tenant_id UUID;
  END IF;
  
  -- Add tenant_id to profiles if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tenant_id') THEN
    ALTER TABLE public.profiles ADD COLUMN tenant_id UUID;
  END IF;
  
  -- Add primary_tenant_id to profiles if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'primary_tenant_id') THEN
    ALTER TABLE public.profiles ADD COLUMN primary_tenant_id UUID;
  END IF;
END $$;

-- Create core tables that are missing

-- 1. Enhanced patients table
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES auth.users(id),
  tenant_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  insurance_primary_provider TEXT,
  insurance_primary_id TEXT,
  insurance_secondary_provider TEXT,
  insurance_secondary_id TEXT,
  medical_history JSONB DEFAULT '{}',
  current_medications JSONB DEFAULT '[]',
  allergies JSONB DEFAULT '[]',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Enhanced providers table
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  tenant_id UUID,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialty TEXT,
  license_number TEXT,
  npi_number TEXT,
  is_active BOOLEAN DEFAULT true,
  working_hours JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Enhanced tenants table
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subdomain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  subscription_status TEXT DEFAULT 'trial',
  subscription_plan TEXT DEFAULT 'basic',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('patient', 'staff', 'provider', 'admin', 'tenant_admin', 'practice_manager');
    END IF;
END$$;

-- 4. Enhanced tenant_users table
CREATE TABLE IF NOT EXISTS public.tenant_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role user_role DEFAULT 'staff',
  is_active BOOLEAN DEFAULT true,
  invited_by UUID,
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Add foreign key constraints after tables exist
DO $$
BEGIN
    -- Add foreign key to tenant_users.tenant_id if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tenants') THEN
        ALTER TABLE public.tenant_users 
        DROP CONSTRAINT IF EXISTS tenant_users_tenant_id_fkey,
        ADD CONSTRAINT tenant_users_tenant_id_fkey 
        FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;
    END IF;
    
    -- Add foreign key to tenant_users.user_id
    ALTER TABLE public.tenant_users 
    DROP CONSTRAINT IF EXISTS tenant_users_user_id_fkey,
    ADD CONSTRAINT tenant_users_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    
    -- Add foreign key to tenant_users.invited_by
    ALTER TABLE public.tenant_users 
    DROP CONSTRAINT IF EXISTS tenant_users_invited_by_fkey,
    ADD CONSTRAINT tenant_users_invited_by_fkey 
    FOREIGN KEY (invited_by) REFERENCES auth.users(id);
END $$;