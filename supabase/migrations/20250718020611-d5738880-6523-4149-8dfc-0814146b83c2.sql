-- Create subscription plans table for client billing
CREATE TABLE public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  interval TEXT NOT NULL DEFAULT 'month',
  stripe_price_id TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client subscriptions table
CREATE TABLE public.client_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient payments table for healthcare billing
CREATE TABLE public.patient_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  appointment_id UUID,
  stripe_payment_intent_id TEXT,
  amount_cents INTEGER NOT NULL,
  payment_type TEXT NOT NULL, -- 'copay', 'balance', 'procedure'
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment links table for email/SMS billing
CREATE TABLE public.payment_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  payment_id UUID REFERENCES patient_payments(id),
  link_token TEXT NOT NULL UNIQUE,
  amount_cents INTEGER NOT NULL,
  description TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_links ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription plans (readable by all, manageable by platform admins)
CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Platform admins can manage subscription plans" 
ON public.subscription_plans 
FOR ALL 
USING (is_platform_admin(auth.uid()));

-- RLS Policies for client subscriptions
CREATE POLICY "Tenants can view their own subscription" 
ON public.client_subscriptions 
FOR SELECT 
USING (tenant_id IN (
  SELECT tenant_users.tenant_id 
  FROM tenant_users 
  WHERE tenant_users.user_id = auth.uid() AND tenant_users.is_active = true
));

CREATE POLICY "Platform admins can manage all subscriptions" 
ON public.client_subscriptions 
FOR ALL 
USING (is_platform_admin(auth.uid()));

-- RLS Policies for patient payments
CREATE POLICY "Patients can view their own payments" 
ON public.patient_payments 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Staff can manage payments in their tenant" 
ON public.patient_payments 
FOR ALL 
USING (tenant_id IN (
  SELECT tenant_users.tenant_id 
  FROM tenant_users 
  WHERE tenant_users.user_id = auth.uid() AND tenant_users.is_active = true
) AND has_staff_access(auth.uid()));

-- RLS Policies for payment links
CREATE POLICY "Anyone can view valid payment links" 
ON public.payment_links 
FOR SELECT 
USING (expires_at > now() AND used_at IS NULL);

CREATE POLICY "Staff can create payment links in their tenant" 
ON public.payment_links 
FOR INSERT 
WITH CHECK (tenant_id IN (
  SELECT tenant_users.tenant_id 
  FROM tenant_users 
  WHERE tenant_users.user_id = auth.uid() AND tenant_users.is_active = true
) AND has_staff_access(auth.uid()));

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_subscriptions_updated_at
BEFORE UPDATE ON public.client_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_payments_updated_at
BEFORE UPDATE ON public.patient_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price_cents, features) VALUES
('Basic', 9900, '["Up to 100 patients", "Basic reporting", "Email support"]'),
('Premium', 29900, '["Up to 500 patients", "Advanced analytics", "AI features", "Priority support"]'),
('Enterprise', 59900, '["Unlimited patients", "Custom integrations", "White label", "Dedicated support"]');