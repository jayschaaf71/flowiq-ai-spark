import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

interface TwoFASettings {
  id?: string;
  is_enabled: boolean;
  secret_key?: string;
  backup_codes?: string[];
  created_at?: string;
  updated_at?: string;
}

interface TwoFAAttempt {
  id: string;
  attempt_type: string;
  success: boolean;
  created_at: string;
}

export const use2FA = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<TwoFASettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentAttempts, setRecentAttempts] = useState<TwoFAAttempt[]>([]);

  // Load 2FA settings
  useEffect(() => {
    if (user?.id) {
      load2FASettings();
      loadRecentAttempts();
    }
  }, [user?.id]);

  const load2FASettings = async () => {
    try {
      // Mock 2FA settings until user_2fa_settings table is created
      setSettings({ is_enabled: false });
    } catch (error) {
      console.error('Error loading 2FA settings:', error);
      toast({
        title: "Error",
        description: "Failed to load 2FA settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRecentAttempts = async () => {
    try {
      // Mock 2FA attempts until user_2fa_attempts table is created
      setRecentAttempts([]);
    } catch (error) {
      console.error('Error loading 2FA attempts:', error);
    }
  };

  const setup2FA = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: { action: 'setup' }
      });

      if (error) throw error;
      
      return data; // Contains QR code and secret
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast({
        title: "Setup Failed",
        description: "Failed to set up 2FA. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const verify2FASetup = async (token: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: { 
          action: 'verify_setup',
          token 
        }
      });

      if (error) throw error;

      // Reload settings after successful verification
      await load2FASettings();
      
      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled.",
      });

      return data; // Contains backup codes
    } catch (error) {
      console.error('Error verifying 2FA setup:', error);
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const disable2FA = async (password: string) => {
    try {
      const { error } = await supabase.functions.invoke('setup-2fa', {
        body: { 
          action: 'disable',
          password 
        }
      });

      if (error) throw error;

      await load2FASettings();
      
      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled.",
      });

      return true;
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Failed to Disable",
        description: "Failed to disable 2FA. Please check your password.",
        variant: "destructive",
      });
      return false;
    }
  };

  const verify2FA = async (token: string, type: 'totp' | 'backup_code' = 'totp') => {
    try {
      const { data, error } = await supabase.functions.invoke('verify-2fa', {
        body: { 
          token,
          type
        }
      });

      if (error) throw error;

      // Reload attempts after verification
      await loadRecentAttempts();

      return data?.valid || false;
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      return false;
    }
  };

  const generateBackupCodes = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('setup-2fa', {
        body: { action: 'generate_backup_codes' }
      });

      if (error) throw error;

      await load2FASettings();
      
      toast({
        title: "Backup Codes Generated",
        description: "New backup codes have been generated. Please save them securely.",
      });

      return data?.backup_codes || [];
    } catch (error) {
      console.error('Error generating backup codes:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate backup codes. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    settings,
    loading,
    recentAttempts,
    setup2FA,
    verify2FASetup,
    disable2FA,
    verify2FA,
    generateBackupCodes,
    reload: () => {
      load2FASettings();
      loadRecentAttempts();
    }
  };
};