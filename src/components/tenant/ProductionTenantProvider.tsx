import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { parseTenantFromUrl, TenantRoute } from '@/utils/tenantRouting';
import { Loader2 } from 'lucide-react';

interface ProductionTenantProviderProps {
  children: React.ReactNode;
}

export const ProductionTenantProvider: React.FC<ProductionTenantProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [tenantRoute, setTenantRoute] = useState<TenantRoute | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTenant = async () => {
      try {
        setIsLoading(true);
        
        // Parse tenant from URL (subdomain or path)
        const parsedTenant = parseTenantFromUrl();
        setTenantRoute(parsedTenant);
        
        // If user is authenticated and we have a tenant, ensure they have access
        if (user && parsedTenant) {
          await ensureTenantAccess(parsedTenant.tenantId);
        }
        
      } catch (err) {
        console.error('Error initializing tenant:', err);
        setError('Failed to initialize practice configuration');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTenant();
  }, [user]);

  const ensureTenantAccess = async (tenantId: string) => {
    // Check if user has access to this tenant
    const { data: tenantUser, error } = await supabase
      .from('tenant_users')
      .select('id')
      .eq('user_id', user?.id)
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking tenant access:', error);
      return;
    }

    if (!tenantUser) {
      console.warn('User does not have access to this tenant');
      // Could redirect to access request page or show error
    }

    // Update user's current tenant if they have access
    if (tenantUser) {
      await supabase
        .from('profiles')
        .update({ current_tenant_id: tenantId })
        .eq('id', user?.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading practice configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Configuration Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Add tenant route context to children
  return (
    <div data-tenant-id={tenantRoute?.tenantId} data-tenant-subdomain={tenantRoute?.subdomain}>
      {children}
    </div>
  );
};