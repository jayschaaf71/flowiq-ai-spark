import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { cn } from '@/lib/utils';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  specialty: string;
  business_name?: string;
}

export function TenantSwitcher() {
  const [open, setOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { currentTenant, refetch } = useCurrentTenant();

  useEffect(() => {
    if (user) {
      loadUserTenants();
    }
  }, [user]);

  const loadUserTenants = async () => {
    try {
      setLoading(true);
      
      // Fetch tenants the user has access to
      const { data: tenantUsers, error } = await supabase
        .from('tenant_users')
        .select(`
          tenant:tenants(
            id,
            name,
            subdomain,
            specialty,
            business_name
          )
        `)
        .eq('user_id', user?.id)
        .eq('is_active', true);

      if (error) {
        console.error('Error loading tenants:', error);
        return;
      }

      const tenantList = tenantUsers
        .map(tu => tu.tenant)
        .filter(Boolean) as Tenant[];
      
      setTenants(tenantList);
    } catch (error) {
      console.error('Error loading tenants:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchTenant = async (tenantId: string) => {
    try {
      // Find the selected tenant to get its specialty
      const selectedTenant = tenants.find(t => t.id === tenantId);
      
      // Update user's current tenant
      const { error } = await supabase
        .from('profiles')
        .update({ current_tenant_id: tenantId })
        .eq('id', user?.id);

      if (error) {
        console.error('Error switching tenant:', error);
        return;
      }

      // Update localStorage with the new specialty
      if (selectedTenant?.specialty) {
        localStorage.setItem('currentSpecialty', selectedTenant.specialty);
      }

      // Refetch tenant config
      await refetch();
      setOpen(false);
      
      // Navigate to the appropriate specialty dashboard instead of reloading
      if (selectedTenant?.specialty) {
        const specialtyRoutes: Record<string, string> = {
          'chiropractic-care': '/chiropractic/dashboard',
          'chiropractic': '/chiropractic/dashboard',
          'dental-sleep-medicine': '/dental-sleep/dashboard',
          'dental-sleep': '/dental-sleep/dashboard',
          'dental': '/general-dentistry/dashboard',
          'med-spa': '/medspa/dashboard',
          'concierge': '/concierge-medicine/dashboard',
          'hrt': '/hrt/dashboard'
        };
        
        const targetRoute = specialtyRoutes[selectedTenant.specialty] || '/chiropractic/dashboard';
        window.location.href = targetRoute;
      } else {
        // Fallback to reload if no specialty found
        window.location.reload();
      }
    } catch (error) {
      console.error('Error switching tenant:', error);
    }
  };

  if (!user || tenants.length <= 1) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between h-10 px-3"
        >
          <div className="flex items-center min-w-0 flex-1">
            <Building2 className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate text-sm">
              {currentTenant?.brand_name || currentTenant?.name || "Select practice..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Search practices..." />
          <CommandEmpty>No practice found.</CommandEmpty>
          <CommandList>
            <CommandGroup heading="Your Practices">
              {tenants.map((tenant) => (
                <CommandItem
                  key={tenant.id}
                  value={tenant.name}
                  onSelect={() => switchTenant(tenant.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      currentTenant?.id === tenant.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {tenant.business_name || tenant.name}
                    </span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {tenant.specialty.replace('-', ' ')}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}