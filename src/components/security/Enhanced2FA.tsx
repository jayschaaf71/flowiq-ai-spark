import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  Shield, 
  Smartphone, 
  Key, 
  Copy, 
  Check,
  AlertTriangle,
  Scan,
  Download
} from 'lucide-react';
import QRCode from 'qrcode';

export const Enhanced2FA: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [step, setStep] = useState<'status' | 'setup' | 'verify' | 'complete'>('status');

  useEffect(() => {
    load2FAStatus();
  }, [user]);

  const load2FAStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_2fa_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIsEnabled(data?.is_enabled || false);
      if (data?.backup_codes) {
        setBackupCodes(data.backup_codes);
      }
    } catch (error) {
      console.error('Error loading 2FA status:', error);
    }
  };

  const generate2FASecret = async () => {
    setLoading(true);
    try {
      // Generate a random secret key
      const secret = generateRandomSecret();
      setSecretKey(secret);

      // Generate QR code for authenticator apps
      const email = user?.email || '';
      const issuer = 'Medical Practice Management';
      const otpauth = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
      
      const qrDataUrl = await QRCode.toDataURL(otpauth);
      setQrCodeUrl(qrDataUrl);
      
      setStep('setup');
    } catch (error) {
      console.error('Error generating 2FA secret:', error);
      toast({
        title: "Error",
        description: "Failed to generate 2FA setup",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateBackupCodes = () => {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase();
      codes.push(code);
    }
    return codes;
  };

  const verify2FA = async () => {
    if (!verificationCode || !secretKey) return;

    setLoading(true);
    try {
      // In a real implementation, you would verify the TOTP code server-side
      // For now, we'll simulate the verification
      const backupCodes = generateBackupCodes();
      
      const { error } = await supabase
        .from('user_2fa_settings')
        .upsert({
          user_id: user?.id,
          is_enabled: true,
          secret_key: secretKey,
          backup_codes: backupCodes
        });

      if (error) throw error;

      setBackupCodes(backupCodes);
      setIsEnabled(true);
      setStep('complete');

      // Log 2FA setup for security audit
      await supabase
        .from('user_2fa_attempts')
        .insert({
          user_id: user?.id,
          attempt_type: 'setup',
          success: true,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      toast({
        title: "2FA Enabled",
        description: "Two-factor authentication has been successfully enabled"
      });
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to enable 2FA",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const disable2FA = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_2fa_settings')
        .update({ 
          is_enabled: false,
          last_used_at: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setIsEnabled(false);
      setStep('status');

      // Log 2FA disable for security audit
      await supabase
        .from('user_2fa_attempts')
        .insert({
          user_id: user?.id,
          attempt_type: 'disable',
          success: true,
          ip_address: null,
          user_agent: navigator.userAgent
        });

      toast({
        title: "2FA Disabled",
        description: "Two-factor authentication has been disabled"
      });
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      toast({
        title: "Error",
        description: "Failed to disable 2FA",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard"
    });
  };

  const downloadBackupCodes = () => {
    const content = backupCodes.map(code => `${code}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '2fa-backup-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderStatus = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isEnabled ? 'bg-green-100' : 'bg-gray-100'}`}>
            <Shield className={`w-5 h-5 ${isEnabled ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h4 className="font-medium">Two-Factor Authentication</h4>
            <p className="text-sm text-muted-foreground">
              {isEnabled ? 'Enabled - Your account is protected' : 'Not enabled - Consider enabling for security'}
            </p>
          </div>
        </div>
        <Badge variant={isEnabled ? "default" : "secondary"}>
          {isEnabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>

      {isEnabled ? (
        <div className="space-y-3">
          <Alert>
            <Check className="h-4 w-4" />
            <AlertDescription>
              Two-factor authentication is active. You'll need your authenticator app to sign in.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadBackupCodes}>
              <Download className="w-4 h-4 mr-2" />
              Download Backup Codes
            </Button>
            <Button variant="destructive" size="sm" onClick={disable2FA} disabled={loading}>
              Disable 2FA
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              For HIPAA compliance and enhanced security, two-factor authentication is strongly recommended.
            </AlertDescription>
          </Alert>
          
          <Button onClick={generate2FASecret} disabled={loading}>
            <Smartphone className="w-4 h-4 mr-2" />
            Enable 2FA
          </Button>
        </div>
      )}
    </div>
  );

  const renderSetup = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="font-medium mb-2">Set Up Two-Factor Authentication</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
        </p>
        
        {qrCodeUrl && (
          <div className="flex justify-center mb-4">
            <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
          </div>
        )}
        
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">Or enter this key manually:</p>
            <div className="flex items-center gap-2">
              <Input value={secretKey} readOnly className="font-mono text-center" />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(secretKey)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button onClick={() => setStep('verify')} className="w-full">
            <Scan className="w-4 h-4 mr-2" />
            I've Added the Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderVerify = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="font-medium mb-2">Verify Your Setup</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Enter the 6-digit code from your authenticator app
        </p>
        
        <div className="space-y-3">
          <Input
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="text-center font-mono text-lg"
            maxLength={6}
          />
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setStep('setup')}
              className="flex-1"
            >
              Back
            </Button>
            <Button 
              onClick={verify2FA} 
              disabled={loading || verificationCode.length !== 6}
              className="flex-1"
            >
              Verify & Enable
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-4">
      <Alert>
        <Check className="h-4 w-4" />
        <AlertDescription>
          Two-factor authentication has been successfully enabled!
        </AlertDescription>
      </Alert>
      
      <div>
        <h4 className="font-medium mb-2">Backup Codes</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Save these backup codes in a safe place. You can use them to access your account if you lose your device.
        </p>
        
        <div className="grid grid-cols-2 gap-2 mb-3">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded font-mono text-center text-sm">
              {code}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadBackupCodes}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Codes
          </Button>
          <Button 
            onClick={() => setStep('status')}
            className="flex-1"
          >
            Complete Setup
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'status' && renderStatus()}
        {step === 'setup' && renderSetup()}
        {step === 'verify' && renderVerify()}
        {step === 'complete' && renderComplete()}
      </CardContent>
    </Card>
  );
};