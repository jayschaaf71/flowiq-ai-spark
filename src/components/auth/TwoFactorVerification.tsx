import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { use2FA } from '@/hooks/use2FA';
import { Shield, Smartphone, Key, Loader2 } from 'lucide-react';

interface TwoFactorVerificationProps {
  onVerified: () => void;
  onCancel?: () => void;
}

export const TwoFactorVerification: React.FC<TwoFactorVerificationProps> = ({
  onVerified,
  onCancel
}) => {
  const { verify2FA } = use2FA();
  const [totpCode, setTotpCode] = useState('');
  const [backupCode, setBackupCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('totp');

  const handleVerifyTOTP = async () => {
    if (!totpCode || totpCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const isValid = await verify2FA(totpCode, 'totp');
      if (isValid) {
        onVerified();
      } else {
        setError('Invalid code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleVerifyBackupCode = async () => {
    if (!backupCode) {
      setError('Please enter a backup code');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const isValid = await verify2FA(backupCode.toUpperCase(), 'backup_code');
      if (isValid) {
        onVerified();
      } else {
        setError('Invalid backup code. Please try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'totp' | 'backup') => {
    if (e.key === 'Enter') {
      if (type === 'totp') {
        handleVerifyTOTP();
      } else {
        handleVerifyBackupCode();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Please verify your identity to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="totp" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Authenticator
              </TabsTrigger>
              <TabsTrigger value="backup" className="flex items-center gap-2">
                <Key className="w-4 h-4" />
                Backup Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="totp" className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <Smartphone className="w-8 h-8 mx-auto text-blue-600" />
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="totpCode">Authentication Code</Label>
                <Input
                  id="totpCode"
                  value={totpCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setTotpCode(value);
                    setError('');
                  }}
                  onKeyPress={(e) => handleKeyPress(e, 'totp')}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest"
                  maxLength={6}
                  autoComplete="one-time-code"
                />
              </div>

              <Button 
                onClick={handleVerifyTOTP}
                disabled={verifying || totpCode.length !== 6}
                className="w-full"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Verify Code
              </Button>
            </TabsContent>

            <TabsContent value="backup" className="space-y-4 mt-6">
              <div className="text-center space-y-2">
                <Key className="w-8 h-8 mx-auto text-blue-600" />
                <p className="text-sm text-muted-foreground">
                  Enter one of your backup codes
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="backupCode">Backup Code</Label>
                <Input
                  id="backupCode"
                  value={backupCode}
                  onChange={(e) => {
                    setBackupCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  onKeyPress={(e) => handleKeyPress(e, 'backup')}
                  placeholder="XXXXXXXX"
                  className="text-center font-mono"
                  autoComplete="one-time-code"
                />
              </div>

              <Alert>
                <AlertDescription>
                  Each backup code can only be used once. Make sure to generate new codes after using several.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleVerifyBackupCode}
                disabled={verifying || !backupCode}
                className="w-full"
              >
                {verifying ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : null}
                Verify Backup Code
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mt-6 text-center">
            {onCancel && (
              <Button 
                variant="ghost" 
                onClick={onCancel}
                disabled={verifying}
                className="text-sm"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};