import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';

interface FeatureFlag {
  key: string;
  enabled: boolean;
  rolloutPercentage?: number;
  userGroups?: string[];
  tenantId?: string;
}

interface FeatureFlagsContextType {
  isFeatureEnabled: (key: string) => boolean;
  getFeatureFlag: (key: string) => FeatureFlag | null;
  loading: boolean;
  refreshFlags: () => Promise<void>;
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType | null>(null);

// Default feature flags for development/fallback
const DEFAULT_FLAGS: FeatureFlag[] = [
  { key: 'new_ui_layout', enabled: false, rolloutPercentage: 10 },
  { key: 'advanced_analytics', enabled: true },
  { key: 'beta_features', enabled: false },
  { key: 'multi_tenant_dashboard', enabled: true },
  { key: 'ai_enhancements', enabled: true, rolloutPercentage: 50 },
];

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlag[]>(DEFAULT_FLAGS);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchFeatureFlags = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from a feature flags table
      // For now, we'll use the default flags with some dynamic logic
      const tenantId = profile?.tenant_id;
      const userRole = profile?.role;
      
      // Simulate fetching flags based on tenant and user role
      let updatedFlags = [...DEFAULT_FLAGS];
      
      // Example: Enable beta features for platform admins
      if (userRole === 'platform_admin') {
        updatedFlags = updatedFlags.map(flag => 
          flag.key === 'beta_features' ? { ...flag, enabled: true } : flag
        );
      }
      
      // Example: Tenant-specific features
      if (tenantId) {
        updatedFlags = updatedFlags.map(flag => 
          flag.key === 'multi_tenant_dashboard' ? { ...flag, enabled: true, tenantId } : flag
        );
      }
      
      setFlags(updatedFlags);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      // Fallback to default flags on error
      setFlags(DEFAULT_FLAGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeatureFlags();
    } else {
      setFlags(DEFAULT_FLAGS);
      setLoading(false);
    }
  }, [user, profile, fetchFeatureFlags]);

  const isFeatureEnabled = (key: string): boolean => {
    const flag = flags.find(f => f.key === key);
    if (!flag) return false;
    
    // If rollout percentage is specified, use deterministic logic
    if (flag.rolloutPercentage !== undefined && user) {
      const hash = hashUserId(user.id);
      return (hash % 100) < flag.rolloutPercentage && flag.enabled;
    }
    
    return flag.enabled;
  };

  const getFeatureFlag = (key: string): FeatureFlag | null => {
    return flags.find(f => f.key === key) || null;
  };

  const refreshFlags = async () => {
    await fetchFeatureFlags();
  };

  return (
    <FeatureFlagsContext.Provider value={{
      isFeatureEnabled,
      getFeatureFlag,
      loading,
      refreshFlags
    }}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider');
  }
  return context;
};

// Simple hash function for user ID to ensure consistent rollout
function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}