import { useFeatureFlags } from '@/contexts/FeatureFlagsContext';

/**
 * Hook to check if a feature flag is enabled
 * @param flagKey - The feature flag key to check
 * @returns boolean indicating if the feature is enabled
 */
export const useFeatureFlag = (flagKey: string): boolean => {
  const { isFeatureEnabled } = useFeatureFlags();
  return isFeatureEnabled(flagKey);
};

/**
 * Hook to get detailed feature flag information
 * @param flagKey - The feature flag key to get
 * @returns FeatureFlag object or null if not found
 */
export const useFeatureFlagDetails = (flagKey: string) => {
  const { getFeatureFlag } = useFeatureFlags();
  return getFeatureFlag(flagKey);
};