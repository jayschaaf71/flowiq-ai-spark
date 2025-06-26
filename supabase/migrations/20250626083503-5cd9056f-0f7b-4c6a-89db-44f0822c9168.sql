
-- Create vendors table to store vendor information
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  website TEXT,
  contact_person TEXT,
  payment_terms TEXT,
  tax_id TEXT,
  vendor_number TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_sync_date TIMESTAMP WITH TIME ZONE,
  integration_status TEXT DEFAULT 'pending' CHECK (integration_status IN ('connected', 'pending', 'disconnected', 'error')),
  integration_config JSONB DEFAULT '{}',
  items_count INTEGER DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  tenant_id UUID
);

-- Create vendor_items table to track items available from each vendor
CREATE TABLE public.vendor_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  vendor_sku TEXT,
  vendor_price NUMERIC(10,2),
  minimum_order_quantity INTEGER DEFAULT 1,
  lead_time_days INTEGER,
  is_available BOOLEAN DEFAULT true,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tenant_id UUID
);

-- Create purchase_orders table for tracking orders
CREATE TABLE public.purchase_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id),
  order_number TEXT UNIQUE NOT NULL,
  order_type TEXT NOT NULL DEFAULT 'regular' CHECK (order_type IN ('regular', 'emergency', 'bulk')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'ordered', 'received', 'cancelled')),
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  total_amount NUMERIC(10,2) DEFAULT 0,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create purchase_order_items table for order line items
CREATE TABLE public.purchase_order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  purchase_order_id UUID NOT NULL REFERENCES public.purchase_orders(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  vendor_sku TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2),
  total_price NUMERIC(10,2),
  received_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vendors in their tenant" ON public.vendors
  FOR SELECT USING (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

CREATE POLICY "Users can insert vendors in their tenant" ON public.vendors
  FOR INSERT WITH CHECK (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

CREATE POLICY "Users can update vendors in their tenant" ON public.vendors
  FOR UPDATE USING (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

-- Add RLS policies for vendor_items table
ALTER TABLE public.vendor_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vendor items in their tenant" ON public.vendor_items
  FOR SELECT USING (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

CREATE POLICY "Users can insert vendor items in their tenant" ON public.vendor_items
  FOR INSERT WITH CHECK (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

-- Add RLS policies for purchase_orders table
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase orders in their tenant" ON public.purchase_orders
  FOR SELECT USING (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

CREATE POLICY "Users can insert purchase orders in their tenant" ON public.purchase_orders
  FOR INSERT WITH CHECK (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

CREATE POLICY "Users can update purchase orders in their tenant" ON public.purchase_orders
  FOR UPDATE USING (tenant_id = (SELECT get_user_primary_tenant(auth.uid())));

-- Add RLS policies for purchase_order_items table
ALTER TABLE public.purchase_order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase order items through orders" ON public.purchase_order_items
  FOR SELECT USING (
    purchase_order_id IN (
      SELECT id FROM public.purchase_orders 
      WHERE tenant_id = (SELECT get_user_primary_tenant(auth.uid()))
    )
  );

CREATE POLICY "Users can insert purchase order items through orders" ON public.purchase_order_items
  FOR INSERT WITH CHECK (
    purchase_order_id IN (
      SELECT id FROM public.purchase_orders 
      WHERE tenant_id = (SELECT get_user_primary_tenant(auth.uid()))
    )
  );

-- Add triggers for updated_at timestamps
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- Create sequence for vendor numbers
CREATE SEQUENCE vendor_number_seq START WITH 1000;

-- Function to generate vendor number
CREATE OR REPLACE FUNCTION generate_vendor_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'VEN-' || LPAD(nextval('vendor_number_seq')::TEXT, 6, '0');
END;
$$;

-- Trigger to auto-generate vendor number
CREATE OR REPLACE FUNCTION set_vendor_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.vendor_number IS NULL THEN
    NEW.vendor_number := generate_vendor_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_vendor_number
  BEFORE INSERT ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION set_vendor_number();

-- Create sequence for order numbers
CREATE SEQUENCE purchase_order_number_seq START WITH 1000;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_purchase_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN 'PO-' || LPAD(nextval('purchase_order_number_seq')::TEXT, 6, '0');
END;
$$;

-- Trigger to auto-generate order number
CREATE OR REPLACE FUNCTION set_purchase_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := generate_purchase_order_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_purchase_order_number
  BEFORE INSERT ON public.purchase_orders
  FOR EACH ROW
  EXECUTE FUNCTION set_purchase_order_number();
