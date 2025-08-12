import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Shield, Lock, Eye, AlertTriangle, Users, Key, Activity, Settings } from 'lucide-react';

export const PlatformSecurity = () => {
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    passwordPolicy: true,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLogging: true,
    encryption: true
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAuditDialog, setShowAuditDialog] = useState(false);

  console.log('🔧 [PlatformSecurity] Component rendered');

  const handleToggleSetting = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    console.log('🔧 [PlatformSecurity] Toggled setting:', setting);
  };

  const handleSecurityScan = () => {
    console.log('🔧 [PlatformSecurity] Running security scan');
    alert('Running comprehensive security scan... (This would perform a full security audit in production)');
  };

  const handleViewAuditLog = () => {
    console.log('🔧 [PlatformSecurity] Viewing audit log');
    setShowAuditDialog(true);
  };

  const handleResetSecurity = () => {
    console.log('🔧 [PlatformSecurity] Resetting security settings');
    setShowResetDialog(true);
  };

  const confirmResetSecurity = () => {
    console.log('🔧 [PlatformSecurity] Confirming security reset');
    setSecuritySettings({
      twoFactorAuth: true,
      passwordPolicy: true,
      sessionTimeout: true,
      ipWhitelist: false,
      auditLogging: true,
      encryption: true
    });
    setShowResetDialog(false);
    alert('Security settings have been reset to defaults');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage platform security and access controls</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Two-Factor Authentication</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Require 2FA for all users</span>
              <Switch 
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={() => handleToggleSetting('twoFactorAuth')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Password Policy</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Strong password requirements</span>
              <Switch 
                checked={securitySettings.passwordPolicy}
                onCheckedChange={() => handleToggleSetting('passwordPolicy')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Timeout</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Auto-logout after inactivity</span>
              <Switch 
                checked={securitySettings.sessionTimeout}
                onCheckedChange={() => handleToggleSetting('sessionTimeout')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">IP Whitelist</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Restrict access by IP address</span>
              <Switch 
                checked={securitySettings.ipWhitelist}
                onCheckedChange={() => handleToggleSetting('ipWhitelist')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Logging</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Log all security events</span>
              <Switch 
                checked={securitySettings.auditLogging}
                onCheckedChange={() => handleToggleSetting('auditLogging')}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Encryption</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Encrypt data at rest</span>
              <Switch 
                checked={securitySettings.encryption}
                onCheckedChange={() => handleToggleSetting('encryption')}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Security Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" variant="outline" onClick={handleSecurityScan}>
              <Shield className="h-4 w-4 mr-2" />
              Run Security Scan
            </Button>
            <Button className="w-full" variant="outline" onClick={handleViewAuditLog}>
              <Eye className="h-4 w-4 mr-2" />
              View Audit Log
            </Button>
            <Button className="w-full" variant="outline" onClick={handleResetSecurity}>
              <Settings className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Last Security Scan</span>
              <Badge variant="default">2 hours ago</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Sessions</span>
              <Badge variant="secondary">12</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Failed Login Attempts</span>
              <Badge variant="destructive">3</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Security Score</span>
              <Badge variant="default">A+</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reset Security Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Security Settings</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset all security settings to their default values? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetSecurity}>Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Audit Log Dialog */}
      <AlertDialog open={showAuditDialog} onOpenChange={setShowAuditDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Audit Log</AlertDialogTitle>
            <AlertDialogDescription>
              Recent security events and access logs would be displayed here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction onClick={() => setShowAuditDialog(false)}>Export</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};