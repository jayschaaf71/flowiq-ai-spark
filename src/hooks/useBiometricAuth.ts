
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

// Mock biometric types for now since the plugin is not available
enum BiometryType {
  NONE = 0,
  FACE_ID = 1,
  FINGERPRINT = 2,
  TOUCH_ID = 3
}

interface BiometricCapabilities {
  isAvailable: boolean;
  biometryType: BiometryType;
  isEnabled: boolean;
}

export const useBiometricAuth = () => {
  const [capabilities, setCapabilities] = useState<BiometricCapabilities>({
    isAvailable: false,
    biometryType: BiometryType.NONE,
    isEnabled: false
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !user) return;

    const checkBiometricAvailability = async () => {
      try {
        // For now, simulate biometric availability check
        const isEnabled = await getBiometricPreference();
        
        setCapabilities({
          isAvailable: false, // Will be true once biometric plugin is properly installed
          biometryType: BiometryType.NONE,
          isEnabled
        });
      } catch (error) {
        console.error('Error checking biometric availability:', error);
      }
    };

    checkBiometricAvailability();
  }, [user]);

  const getBiometricPreference = async (): Promise<boolean> => {
    try {
      const { value } = await Preferences.get({ key: `biometric_enabled_${user?.id}` });
      return value === 'true';
    } catch (error) {
      return false;
    }
  };

  const setBiometricPreference = async (enabled: boolean) => {
    try {
      await Preferences.set({ 
        key: `biometric_enabled_${user?.id}`, 
        value: enabled.toString() 
      });
      setCapabilities(prev => ({ ...prev, isEnabled: enabled }));
    } catch (error) {
      console.error('Error setting biometric preference:', error);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    if (!capabilities.isAvailable || !capabilities.isEnabled) {
      return false;
    }

    try {
      // Simulate biometric authentication for now
      console.log('Simulating biometric authentication');
      
      // TODO: Replace with actual BiometricAuth.authenticate() when plugin is available
      return true;
    } catch (error) {
      console.error('Biometric authentication failed:', error);
      toast({
        title: "Authentication Failed",
        description: "Biometric authentication was unsuccessful. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  const enableBiometricAuth = async (): Promise<boolean> => {
    if (!capabilities.isAvailable) {
      toast({
        title: "Biometric Authentication Unavailable",
        description: "Your device doesn't support biometric authentication.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Test authentication first
      const success = await authenticateWithBiometrics();
      if (success) {
        await setBiometricPreference(true);
        toast({
          title: "Biometric Authentication Enabled",
          description: "You can now use biometric authentication to access the app."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error enabling biometric auth:', error);
      return false;
    }
  };

  const disableBiometricAuth = async () => {
    await setBiometricPreference(false);
    toast({
      title: "Biometric Authentication Disabled",
      description: "Biometric authentication has been turned off."
    });
  };

  return {
    capabilities,
    authenticateWithBiometrics,
    enableBiometricAuth,
    disableBiometricAuth
  };
};
