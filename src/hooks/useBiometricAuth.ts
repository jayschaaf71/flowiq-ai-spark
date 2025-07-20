
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { BiometricAuth, BiometryType } from '@capacitor-community/biometric-auth';
import { Preferences } from '@capacitor/preferences';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

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
        const result = await BiometricAuth.checkBiometry();
        const isEnabled = await getBiometricPreference();
        
        setCapabilities({
          isAvailable: result.isAvailable,
          biometryType: result.biometryType,
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
      await BiometricAuth.authenticate({
        reason: 'Authenticate to access FlowIQ Provider',
        title: 'Biometric Authentication',
        subtitle: 'Use your biometric credential to authenticate',
        description: 'Place your finger on the sensor or look at the camera'
      });
      
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
