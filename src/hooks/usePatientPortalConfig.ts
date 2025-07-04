import { useMemo } from 'react';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { getPatientPortalConfig, PatientPortalConfig } from '@/utils/patientPortalConfig';

export const usePatientPortalConfig = (): {
  config: PatientPortalConfig;
  isLoading: boolean;
  specialty: string;
} => {
  const { currentTenant, loading } = useCurrentTenant();
  
  const config = useMemo(() => {
    if (!currentTenant?.specialty) {
      return getPatientPortalConfig('chiropractic'); // Default fallback
    }
    return getPatientPortalConfig(currentTenant.specialty);
  }, [currentTenant?.specialty]);

  return {
    config,
    isLoading: loading,
    specialty: currentTenant?.specialty || 'chiropractic'
  };
};