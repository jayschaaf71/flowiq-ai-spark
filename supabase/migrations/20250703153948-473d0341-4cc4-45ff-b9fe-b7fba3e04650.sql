-- Marketing Campaigns table
CREATE TABLE public.marketing_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  campaign_type TEXT NOT NULL CHECK (campaign_type IN ('email', 'sms', 'social_media', 'google_ads', 'facebook_ads', 'mixed')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  budget_amount DECIMAL(10,2),
  target_audience JSONB DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Campaign Performance Analytics
CREATE TABLE public.campaign_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.marketing_campaigns(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  spend_amount DECIMAL(10,2) DEFAULT 0.00,
  leads_generated INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  revenue_generated DECIMAL(10,2) DEFAULT 0.00,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Review Management
CREATE TABLE public.customer_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id UUID REFERENCES public.patients(id),
  platform TEXT NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook', 'internal', 'other')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  reviewer_name TEXT,
  reviewer_email TEXT,
  external_review_id TEXT,
  review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  response_text TEXT,
  response_date DATE,
  responded_by UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'responded', 'flagged', 'archived')),
  sentiment_score DECIMAL(3,2), -- AI-generated sentiment score
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Social Media Posts
CREATE TABLE public.social_media_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  campaign_id UUID REFERENCES public.marketing_campaigns(id),
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok')),
  post_type TEXT NOT NULL CHECK (post_type IN ('text', 'image', 'video', 'carousel', 'story')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  scheduled_date TIMESTAMP WITH TIME ZONE,
  published_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  external_post_id TEXT,
  engagement_stats JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead Sources tracking
CREATE TABLE public.lead_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  source_name TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('organic', 'paid_ads', 'social_media', 'referral', 'direct', 'email', 'sms')),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing Automation Rules
CREATE TABLE public.marketing_automation_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('new_patient', 'appointment_booked', 'appointment_completed', 'no_show', 'birthday', 'custom_date')),
  trigger_conditions JSONB DEFAULT '{}',
  action_type TEXT NOT NULL CHECK (action_type IN ('send_email', 'send_sms', 'create_task', 'update_field')),
  action_config JSONB DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update patients table to include marketing fields
ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS lead_source_id UUID REFERENCES public.lead_sources(id),
ADD COLUMN IF NOT EXISTS marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS email_marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_marketing_consent BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS first_contact_date DATE,
ADD COLUMN IF NOT EXISTS last_marketing_contact DATE,
ADD COLUMN IF NOT EXISTS lifetime_value DECIMAL(10,2) DEFAULT 0.00;

-- Enable RLS on all tables
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_automation_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_campaigns
CREATE POLICY "Users can view campaigns in their tenant" ON public.marketing_campaigns
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can manage campaigns in their tenant" ON public.marketing_campaigns
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() 
      AND role IN ('tenant_admin', 'staff', 'practice_manager')
      AND is_active = true
    )
  );

-- RLS Policies for campaign_analytics
CREATE POLICY "Users can view analytics in their tenant" ON public.campaign_analytics
  FOR SELECT USING (
    campaign_id IN (
      SELECT id FROM public.marketing_campaigns 
      WHERE tenant_id IN (
        SELECT tenant_id FROM public.tenant_users 
        WHERE user_id = auth.uid() AND is_active = true
      )
    )
  );

-- RLS Policies for customer_reviews
CREATE POLICY "Users can view reviews in their tenant" ON public.customer_reviews
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can manage reviews in their tenant" ON public.customer_reviews
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() 
      AND role IN ('tenant_admin', 'staff', 'practice_manager')
      AND is_active = true
    )
  );

-- RLS Policies for social_media_posts
CREATE POLICY "Users can view posts in their tenant" ON public.social_media_posts
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can manage posts in their tenant" ON public.social_media_posts
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() 
      AND role IN ('tenant_admin', 'staff', 'practice_manager')
      AND is_active = true
    )
  );

-- RLS Policies for lead_sources
CREATE POLICY "Users can view lead sources in their tenant" ON public.lead_sources
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can manage lead sources in their tenant" ON public.lead_sources
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() 
      AND role IN ('tenant_admin', 'staff', 'practice_manager')
      AND is_active = true
    )
  );

-- RLS Policies for marketing_automation_rules
CREATE POLICY "Users can view automation rules in their tenant" ON public.marketing_automation_rules
  FOR SELECT USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Staff can manage automation rules in their tenant" ON public.marketing_automation_rules
  FOR ALL USING (
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_users 
      WHERE user_id = auth.uid() 
      AND role IN ('tenant_admin', 'staff', 'practice_manager')
      AND is_active = true
    )
  );

-- Add indexes for performance
CREATE INDEX idx_marketing_campaigns_tenant_id ON public.marketing_campaigns(tenant_id);
CREATE INDEX idx_marketing_campaigns_status ON public.marketing_campaigns(status);
CREATE INDEX idx_campaign_analytics_campaign_id ON public.campaign_analytics(campaign_id);
CREATE INDEX idx_campaign_analytics_date ON public.campaign_analytics(metric_date);
CREATE INDEX idx_customer_reviews_tenant_id ON public.customer_reviews(tenant_id);
CREATE INDEX idx_customer_reviews_platform ON public.customer_reviews(platform);
CREATE INDEX idx_customer_reviews_rating ON public.customer_reviews(rating);
CREATE INDEX idx_social_media_posts_tenant_id ON public.social_media_posts(tenant_id);
CREATE INDEX idx_social_media_posts_status ON public.social_media_posts(status);
CREATE INDEX idx_lead_sources_tenant_id ON public.lead_sources(tenant_id);
CREATE INDEX idx_patients_lead_source ON public.patients(lead_source_id);

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_marketing_campaigns_updated_at
  BEFORE UPDATE ON public.marketing_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_reviews_updated_at
  BEFORE UPDATE ON public.customer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_media_posts_updated_at
  BEFORE UPDATE ON public.social_media_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lead_sources_updated_at
  BEFORE UPDATE ON public.lead_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_marketing_automation_rules_updated_at
  BEFORE UPDATE ON public.marketing_automation_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();