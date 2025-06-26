
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  website?: string;
  contact_person?: string;
  payment_terms?: string;
  tax_id?: string;
  vendor_number: string;
  status: 'active' | 'inactive' | 'pending';
  last_sync_date?: string;
  integration_status: 'connected' | 'pending' | 'disconnected' | 'error';
  integration_config: Record<string, any>;
  items_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  tenant_id?: string;
}

export interface NewVendor {
  name: string;
  email: string;
  phone: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  website?: string;
  contact_person?: string;
  payment_terms?: string;
  tax_id?: string;
}

export interface PurchaseOrder {
  id: string;
  vendor_id: string;
  order_number: string;
  order_type: 'regular' | 'emergency' | 'bulk';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  order_date: string;
  expected_delivery_date?: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useVendors = () => {
  const queryClient = useQueryClient();

  // Fetch all vendors
  const { data: vendors, isLoading: vendorsLoading, error: vendorsError } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      console.log('Fetching vendors...');
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching vendors:', error);
        throw error;
      }
      
      console.log('Vendors fetched:', data);
      return data as Vendor[];
    },
  });

  // Fetch purchase orders
  const { data: purchaseOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['purchase_orders'],
    queryFn: async () => {
      console.log('Fetching purchase orders...');
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendors!inner(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching purchase orders:', error);
        throw error;
      }
      
      console.log('Purchase orders fetched:', data);
      return data as (PurchaseOrder & { vendors: { name: string } })[];
    },
  });

  // Add vendor mutation
  const addVendorMutation = useMutation({
    mutationFn: async (newVendor: NewVendor) => {
      console.log('Adding vendor:', newVendor);
      
      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          ...newVendor,
          integration_status: 'pending',
          items_count: 0,
          tenant_id: null // Will be set by RLS
        }])
        .select()
        .single();
      
      if (error) {
        console.error('Error adding vendor:', error);
        throw error;
      }
      
      console.log('Vendor added:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success(`Vendor "${data.name}" added successfully!`);
    },
    onError: (error: Error) => {
      console.error('Add vendor error:', error);
      toast.error(`Failed to add vendor: ${error.message}`);
    },
  });

  // Update vendor mutation
  const updateVendorMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Vendor> }) => {
      console.log('Updating vendor:', id, updates);
      
      const { data, error } = await supabase
        .from('vendors')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating vendor:', error);
        throw error;
      }
      
      console.log('Vendor updated:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success(`Vendor "${data.name}" updated successfully!`);
    },
    onError: (error: Error) => {
      console.error('Update vendor error:', error);
      toast.error(`Failed to update vendor: ${error.message}`);
    },
  });

  // Create purchase order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      vendor_id: string;
      order_type: string;
      priority: string;
      notes?: string;
    }) => {
      console.log('Creating purchase order:', orderData);
      
      // Don't include order_number - let the database trigger generate it
      const { data, error } = await supabase
        .from('purchase_orders')
        .insert({
          vendor_id: orderData.vendor_id,
          order_type: orderData.order_type,
          priority: orderData.priority,
          notes: orderData.notes,
          status: 'draft',
          total_amount: 0,
          tenant_id: null // Will be set by RLS
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating purchase order:', error);
        throw error;
      }
      
      console.log('Purchase order created:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['purchase_orders'] });
      toast.success(`Purchase order ${data.order_number} created successfully!`);
    },
    onError: (error: Error) => {
      console.error('Create order error:', error);
      toast.error(`Failed to create order: ${error.message}`);
    },
  });

  // Sync vendor function
  const syncVendor = async (vendorId: string) => {
    console.log('Syncing vendor:', vendorId);
    
    try {
      await updateVendorMutation.mutateAsync({
        id: vendorId,
        updates: {
          last_sync_date: new Date().toISOString(),
          integration_status: 'connected'
        }
      });
      toast.success('Vendor synced successfully!');
    } catch (error) {
      console.error('Sync vendor error:', error);
      toast.error('Failed to sync vendor');
    }
  };

  return {
    vendors: vendors || [],
    purchaseOrders: purchaseOrders || [],
    vendorsLoading,
    ordersLoading,
    vendorsError,
    addVendor: addVendorMutation.mutate,
    updateVendor: updateVendorMutation.mutate,
    createOrder: createOrderMutation.mutate,
    syncVendor,
    isAddingVendor: addVendorMutation.isPending,
    isUpdatingVendor: updateVendorMutation.isPending,
    isCreatingOrder: createOrderMutation.isPending,
  };
};
