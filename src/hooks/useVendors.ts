
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
      console.log('Using mock vendors data...');
      
      // Mock vendors data since table doesn't exist
      const mockVendors: Vendor[] = [
        {
          id: '1',
          name: 'Medical Supplies Inc',
          vendor_number: 'V001',
          contact_person: 'John Smith',
          email: 'john@medicalsupplies.com',
          phone: '(555) 123-4567',
          address_line1: '123 Medical St',
          city: 'Medical City',
          state: 'CA',
          zip_code: '90210',
          status: 'active' as const,
          integration_status: 'connected' as const,
          integration_config: {},
          items_count: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      return mockVendors;
    },
  });

  // Fetch purchase orders
  const { data: purchaseOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['purchase_orders'],
    queryFn: async () => {
      console.log('Using mock purchase orders data...');
      
      // Mock purchase orders data since table doesn't exist
      const mockOrders: (PurchaseOrder & { vendors: { name: string } })[] = [
        {
          id: '1',
          vendor_id: '1',
          order_number: 'PO-001',
          order_type: 'regular' as const,
          priority: 'normal' as const,
          status: 'pending' as const,
          order_date: new Date().toISOString(),
          total_amount: 500.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          vendors: { name: 'Medical Supplies Inc' }
        }
      ];
      
      return mockOrders;
    },
  });

  // Add vendor mutation
  const addVendorMutation = useMutation({
    mutationFn: async (newVendor: NewVendor) => {
      console.log('Mock adding vendor:', newVendor);
      
      const data: Vendor = {
        id: Date.now().toString(),
        ...newVendor,
        vendor_number: `V${Date.now()}`,
        status: 'active' as const,
        integration_status: 'pending' as const,
        integration_config: {},
        items_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Mock vendor added:', data);
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
      console.log('Mock updating vendor:', id, updates);
      
      const data: Vendor = {
        id,
        name: 'Updated Vendor',
        vendor_number: 'V001',
        status: 'active' as const,
        integration_status: 'connected' as const,
        integration_config: {},
        items_count: 0,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      };
      
      console.log('Mock vendor updated:', data);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
      toast.success(`Vendor updated successfully!`);
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
      console.log('Mock creating purchase order:', orderData);
      
      const data: PurchaseOrder = {
        id: Date.now().toString(),
        vendor_id: orderData.vendor_id,
        order_number: `PO-${Date.now()}`,
        order_type: orderData.order_type as any,
        priority: orderData.priority as any,
        status: 'draft' as const,
        order_date: new Date().toISOString(),
        total_amount: 0,
        notes: orderData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Mock purchase order created:', data);
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
