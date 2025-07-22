import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { use2FA } from '@/hooks/use2FA';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  QrCode, 
  Copy, 
  Download,
  AlertTriangle,
  Key,
  Smartphone,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TwoFactorAuth: React.FC = () => {
  const { settings, loading, recentAttempts, setup2FA, verify2FASetup, disable2FA, generateBackupCodes } = use2FA();
  const { toast } = useToast();
  
  const [setupStep, setSetupStep] = useState<'initial' | 'verify' | 'backup'>('initial');
  const [qrData, setQrData] = useState<{ qr_code: string; secret: string; qrUrl: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [setupLoading, setSetupLoading] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [showDisableDialog, setShowDisableDialog] = useState(false);

  const handleSetup2FA = async () => {
    setSetupLoading(true);
    const data = await setup2FA();
    if (data) {
      setQrData(data);
      setSetupStep('verify');
    }
    setSetupLoading(false);
  };

  const handleVerifySetup = async () => {
    if (!verificationCode) return;
    
    setSetupLoading(true);
    const result = await verify2FASetup(verificationCode);
    if (result) {
      setBackupCodes(result.backup_codes || []);
      setSetupStep('backup');
    }
    setSetupLoading(false);
  };

  const handleDisable2FA = async () => {
    if (!disablePassword) return;
    
    const success = await disable2FA(disablePassword);
    if (success) {
      setShowDisableDialog(false);
      setDisablePassword('');
    }
  };

  const handleGenerateBackupCodes = async () => {
    const codes = await generateBackupCodes();
    setBackupCodes(codes);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Copied to clipboard",
    });
  };

  const downloadBackupCodes = () => {
    const content = `FlowIQ AI - 2FA Backup Codes\n\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.join('\n')}\n\nKeep these codes safe and secure. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flowiq-2fa-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main 2FA Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {settings?.is_enabled ? (
              <ShieldCheck className="w-5 h-5 text-green-600" />
            ) : (
              <ShieldX className="w-5 h-5 text-red-600" />
            )}
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Status</p>
              <p className="text-sm text-muted-foreground">
                {settings?.is_enabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
              </p>
            </div>
            <Badge variant={settings?.is_enabled ? "default" : "secondary"}>
              {settings?.is_enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          <Separator />

          {!settings?.is_enabled ? (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Enable 2FA to secure your account with an additional verification step during login.
                </AlertDescription>
              </Alert>
              
              <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
                <DialogTrigger asChild>
                  <Button onClick={() => setSetupStep('initial')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Enable Two-Factor Authentication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Set up Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                      Follow these steps to secure your account with 2FA
                    </DialogDescription>
                  </DialogHeader>

                  {setupStep === 'initial' && (
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <Smartphone className="w-12 h-12 mx-auto text-blue-600" />
                        <p className="text-sm">
                          You'll need an authenticator app like Google Authenticator, Authy, or 1Password.
                        </p>
                      </div>
                      <Button 
                        onClick={handleSetup2FA} 
                        disabled={setupLoading}
                        className="w-full"
                      >
                        {setupLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <QrCode className="w-4 h-4 mr-2" />
                        )}
                        Generate QR Code
                      </Button>
                    </div>
                  )}

                  {setupStep === 'verify' && qrData && (
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <p className="text-sm font-medium">Scan this QR code with your authenticator app:</p>
                        <div className="p-4 bg-white rounded-lg border">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData.qrUrl)}`}
                            alt="2FA QR Code"
                            className="mx-auto"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Or enter this key manually: 
                          <code className="bg-muted p-1 rounded text-xs">{qrData.secret}</code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(qrData.secret)}
                            className="ml-1 h-6 w-6 p-0"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode">Enter verification code</Label>
                        <Input
                          id="verificationCode"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="000000"
                          maxLength={6}
                        />
                      </div>
                      
                      <Button 
                        onClick={handleVerifySetup}
                        disabled={!verificationCode || setupLoading}
                        className="w-full"
                      >
                        {setupLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Verify & Enable 2FA
                      </Button>
                    </div>
                  )}

                  {setupStep === 'backup' && (
                    <div className="space-y-4">
                      <div className="text-center space-y-2">
                        <ShieldCheck className="w-12 h-12 mx-auto text-green-600" />
                        <p className="font-medium text-green-600">2FA Enabled Successfully!</p>
                      </div>
                      
                      <Alert>
                        <Key className="h-4 w-4" />
                        <AlertDescription>
                          Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
                        </AlertDescription>
                      </Alert>

                      <div className="bg-muted p-3 rounded-lg">
                        <div className="grid grid-cols-2 gap-1 text-sm font-mono">
                          {backupCodes.map((code, index) => (
                            <div key={index} className="text-center p-1">
                              {code}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={downloadBackupCodes}
                          className="flex-1"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => copyToClipboard(backupCodes.join('\n'))}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </Button>
                      </div>

                      <Button 
                        onClick={() => {
                          setShowSetupDialog(false);
                          setSetupStep('initial');
                          setVerificationCode('');
                          setQrData(null);
                        }}
                        className="w-full"
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Backup Codes</p>
                  <p className="text-xs text-muted-foreground">
                    Use these codes if you lose access to your authenticator
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleGenerateBackupCodes}>
                  Generate New Codes
                </Button>
              </div>

              <div className="flex gap-2">
                <Dialog open={showDisableDialog} onOpenChange={setShowDisableDialog}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <ShieldX className="w-4 h-4 mr-2" />
                      Disable 2FA
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
                      <DialogDescription>
                        This will remove the extra security layer from your account. Enter your password to confirm.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={disablePassword}
                          onChange={(e) => setDisablePassword(e.target.value)}
                          placeholder="Enter your password"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowDisableDialog(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleDisable2FA}
                          disabled={!disablePassword}
                          className="flex-1"
                        >
                          Disable 2FA
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent 2FA Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentAttempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="capitalize">{attempt.attempt_type.replace('_', ' ')}</span>
                    {attempt.success ? ' - Success' : ' - Failed'}
                  </div>
                  <div className="text-muted-foreground">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};