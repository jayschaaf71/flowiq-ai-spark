-- Create tenant_payer_cred table for Availity integration
create table tenant_payer_cred (
  id uuid default gen_random_uuid() primary key,
  tenant_id uuid not null references public.tenants(id),
  payer text not null,
  submitter_id text not null,
  org_id text not null,
  creds jsonb,
  is_active boolean default true,
  last_used_at timestamptz,
  error_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add indexes for performance
create index idx_tenant_payer_cred_tenant_id on tenant_payer_cred(tenant_id);
create index idx_tenant_payer_cred_payer on tenant_payer_cred(payer);
create index idx_tenant_payer_cred_active on tenant_payer_cred(is_active);

-- Enable RLS on tenant_payer_cred table
alter table tenant_payer_cred enable row level security;

-- RLS policies for tenant_payer_cred
create policy "Tenants can view their own payer credentials" on tenant_payer_cred
  for select using (
    tenant_id = current_setting('app.current_tenant_id')::uuid
  );

create policy "Tenants can manage their own payer credentials" on tenant_payer_cred
  for all using (
    tenant_id = current_setting('app.current_tenant_id')::uuid
  );

-- Add trigger for updated_at timestamp
create trigger update_tenant_payer_cred_updated_at
  before update on tenant_payer_cred
  for each row
  execute function public.handle_updated_at();

-- Pre-seed default payers for all existing tenants
insert into tenant_payer_cred (tenant_id, payer, submitter_id, org_id, is_active)
select 
  t.id as tenant_id,
  p.payer,
  'FLOWIQ' as submitter_id, -- Will be updated with real submitter_id
  'FLOWIQ' as org_id, -- Will be updated with real org_id
  true as is_active
from public.tenants t
cross join (
  values 
    ('BCBS-IL', '00621'),
    ('Aetna', '60054'), 
    ('UHC', '87726'),
    ('AVTEST', 'AVTEST')
) as p(payer, payer_code);

-- Add transaction_id column to claims table for tracking
alter table public.claims 
add column if not exists transaction_id text,
add column if not exists needs_action boolean default false;
