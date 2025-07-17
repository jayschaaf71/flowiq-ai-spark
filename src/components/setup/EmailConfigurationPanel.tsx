import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Mail, Settings, CheckCircle, AlertCircle, TestTube, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmailConfiguration {
  provider: string;
  fromEmail: string;
  fromName: string;
  replyTo?: string;
  enabled: boolean;
  verified: boolean;
}

export const EmailConfigurationPanel: React.FC = () => {
  const [config, setConfig] = useState<EmailConfiguration>({
    provider: 'resend',
    fromEmail: '',
    fromName: '',
    replyTo: '',
    enabled: false,
    verified: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasResendKey, setHasResendKey] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadEmailConfiguration();
    checkResendKey();
  }, []);

  const loadEmailConfiguration = async () => {
    try {
      // Use direct query since TypeScript types haven't been updated yet
      const { data: integrations, error } = await (supabase as any)
        .from('integrations')
        .select('*')
        .eq('type', 'email')
        .single();

      if (!error && integrations) {
        setConfig({
          provider: integrations.settings?.provider || 'resend',
          fromEmail: integrations.settings?.fromEmail || '',
          fromName: integrations.settings?.fromName || '',
          replyTo: integrations.settings?.replyTo || '',
          enabled: integrations.enabled || false,
          verified: integrations.settings?.verified || false
        });
      }
    } catch (error) {
      console.error('Error loading email configuration:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkResendKey = async () => {
    try {
      // Check if RESEND_API_KEY secret exists by testing the edge function
      const { error } = await supabase.functions.invoke('send-scheduled-email', {
        body: { test: true }
      });
      
      // If we get a specific error about missing API key, we know it's not configured
      setHasResendKey(!error?.message?.includes('RESEND_API_KEY'));
    } catch (error) {
      console.error('Error checking Resend key:', error);
    }
  };

  const saveConfiguration = async () => {
    setSaving(true);
    try {
      // Use direct query since TypeScript types haven't been updated yet
      const { error } = await (supabase as any)
        .from('integrations')
        .upsert({
          type: 'email',
          name: 'Email Integration',
          settings: {
            provider: config.provider,
            fromEmail: config.fromEmail,
            fromName: config.fromName,
            replyTo: config.replyTo,
            verified: config.verified
          },
          enabled: config.enabled,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Configuration Saved",
        description: "Email configuration has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save email configuration",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const testEmailConfiguration = async () => {
    if (!config.fromEmail) {
      toast({
        title: "Missing Configuration",
        description: "Please enter a from email address",
        variant: "destructive",
      });
      return;
    }

    setTesting(true);
    try {
      const { error } = await supabase.functions.invoke('send-scheduled-email', {
        body: {
          templateId: 'test',
          recipient: config.fromEmail,
          variables: {
            test: 'This is a test email from your configuration'
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Test Email Sent",
        description: "Check your inbox for the test email",
      });

      // Update verified status
      setConfig(prev => ({ ...prev, verified: true }));
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Failed to send test email. Check your configuration.",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-center">Loading email configuration...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API Key Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              {hasResendKey ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              <div>
                <p className="font-medium">
                  {hasResendKey ? 'Resend API Key Configured' : 'Resend API Key Missing'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {hasResendKey 
                    ? 'API key is configured and ready to send emails'
                    : 'Please configure your Resend API key in Supabase secrets'
                  }
                </p>
              </div>
            </div>
            {!hasResendKey && (
              <Button variant="outline" size="sm" asChild>
                <a 
                  href="https://supabase.com/dashboard/project/jnpzabmqieceoqjypvve/settings/functions" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Configure
                </a>
              </Button>
            )}
          </div>

          {/* Email Provider Settings */}
          <div className="space-y-4">
            <div>
              <Label>Email Provider</Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">Resend</Badge>
                <span className="text-sm text-muted-foreground">
                  High-deliverability email service
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="fromEmail">From Email Address</Label>
              <Input
                id="fromEmail"
                value={config.fromEmail}
                onChange={(e) => setConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
                placeholder="noreply@yourdomain.com"
                type="email"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Must be a verified domain in your Resend account
              </p>
            </div>

            <div>
              <Label htmlFor="fromName">From Name</Label>
              <Input
                id="fromName"
                value={config.fromName}
                onChange={(e) => setConfig(prev => ({ ...prev, fromName: e.target.value }))}
                placeholder="Your Practice Name"
              />
            </div>

            <div>
              <Label htmlFor="replyTo">Reply-To Email (Optional)</Label>
              <Input
                id="replyTo"
                value={config.replyTo}
                onChange={(e) => setConfig(prev => ({ ...prev, replyTo: e.target.value }))}
                placeholder="support@yourdomain.com"
                type="email"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Email Sending</Label>
                <p className="text-sm text-muted-foreground">
                  Allow the system to send automated emails
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onCheckedChange={(enabled) => setConfig(prev => ({ ...prev, enabled }))}
              />
            </div>
          </div>

          {/* Verification Status */}
          {config.fromEmail && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Domain Verification Required:</strong> Make sure your sending domain is verified in your Resend account at{' '}
                <a 
                  href="https://resend.com/domains" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  resend.com/domains
                </a>
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button onClick={saveConfiguration} disabled={saving}>
              {saving ? 'Saving...' : 'Save Configuration'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={testEmailConfiguration}
              disabled={testing || !hasResendKey || !config.fromEmail}
            >
              {testing ? (
                <>Testing...</>
              ) : (
                <>
                  <TestTube className="w-4 h-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                hasResendKey ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {hasResendKey ? '✓' : '1'}
              </div>
              <div>
                <p className="font-medium">Configure Resend API Key</p>
                <p className="text-sm text-muted-foreground">
                  Add your Resend API key to Supabase Edge Functions secrets
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                config.fromEmail ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {config.fromEmail ? '✓' : '2'}
              </div>
              <div>
                <p className="font-medium">Set From Email Address</p>
                <p className="text-sm text-muted-foreground">
                  Configure your sending email address
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                config.verified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {config.verified ? '✓' : '3'}
              </div>
              <div>
                <p className="font-medium">Verify Domain in Resend</p>
                <p className="text-sm text-muted-foreground">
                  Verify your sending domain at resend.com/domains
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                config.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
              }`}>
                {config.enabled ? '✓' : '4'}
              </div>
              <div>
                <p className="font-medium">Enable Email Sending</p>
                <p className="text-sm text-muted-foreground">
                  Turn on automated email sending
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};