import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Database,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lock,
  Settings as SettingsIcon
} from 'lucide-react';
import { HIPAACredentialManagerService } from '@/services/integrations/security/hipaaCredentialManager';
import { useState } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showPasswords, setShowPasswords] = useState(false);
  const [credentials, setCredentials] = useState({
    sleepImpressions: {
      username: '',
      password: '',
      endpoint: ''
    },
    ds3: {
      username: '',
      password: '',
      endpoint: ''
    }
  });
  const [connectionStatus, setConnectionStatus] = useState({
    sleepImpressions: { connected: false, testing: false },
    ds3: { connected: false, testing: false }
  });

  const credentialManager = new HIPAACredentialManagerService();

  const handleCredentialChange = (system: 'sleepImpressions' | 'ds3', field: string, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [system]: {
        ...prev[system],
        [field]: value
      }
    }));
  };

  const handleSaveCredentials = async () => {
    try {
      await credentialManager.storeCredentialsSecurely(credentials);
      console.log('✅ Credentials saved securely');
    } catch (error) {
      console.error('❌ Error saving credentials:', error);
    }
  };

  const testConnection = async (system: 'sleepImpressions' | 'ds3') => {
    setConnectionStatus(prev => ({
      ...prev,
      [system]: { ...prev[system], testing: true }
    }));

    try {
      const result = system === 'sleepImpressions'
        ? await credentialManager.testSleepImpressionsConnection()
        : await credentialManager.testDS3Connection();

      setConnectionStatus(prev => ({
        ...prev,
        [system]: {
          connected: result.success,
          testing: false
        }
      }));
    } catch (error) {
      console.error(`❌ Error testing ${system} connection:`, error);
      setConnectionStatus(prev => ({
        ...prev,
        [system]: { connected: false, testing: false }
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings and integrations</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="practice-name">Practice Name</Label>
                  <Input
                    id="practice-name"
                    placeholder="Your Practice Name"
                    defaultValue="Midwest Dental Sleep"
                  />
                </div>
                <div>
                  <Label htmlFor="practice-url">Practice URL</Label>
                  <Input
                    id="practice-url"
                    placeholder="https://practice.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    placeholder="America/Chicago"
                    defaultValue="America/Chicago"
                  />
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Input
                    id="language"
                    placeholder="English"
                    defaultValue="English"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          {/* Integration Credentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sleep Impressions Integration */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Sleep Impressions</h3>
                    <p className="text-sm text-gray-600">Dental sleep medicine management system</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={connectionStatus.sleepImpressions.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {connectionStatus.sleepImpressions.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection('sleepImpressions')}
                      disabled={connectionStatus.sleepImpressions.testing}
                    >
                      {connectionStatus.sleepImpressions.testing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="si-username">Username</Label>
                    <Input
                      id="si-username"
                      type="text"
                      placeholder="Sleep Impressions username"
                      value={credentials.sleepImpressions.username}
                      onChange={(e) => handleCredentialChange('sleepImpressions', 'username', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="si-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="si-password"
                        type={showPasswords ? 'text' : 'password'}
                        placeholder="Sleep Impressions password"
                        value={credentials.sleepImpressions.password}
                        onChange={(e) => handleCredentialChange('sleepImpressions', 'password', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="si-endpoint">API Endpoint</Label>
                  <Input
                    id="si-endpoint"
                    type="text"
                    placeholder="https://api.sleepimpressions.com"
                    value={credentials.sleepImpressions.endpoint}
                    onChange={(e) => handleCredentialChange('sleepImpressions', 'endpoint', e.target.value)}
                  />
                </div>
              </div>

              {/* DS3 Integration */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">DS3 (DeepSpeed 3)</h3>
                    <p className="text-sm text-gray-600">Dental practice management system</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={connectionStatus.ds3.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {connectionStatus.ds3.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => testConnection('ds3')}
                      disabled={connectionStatus.ds3.testing}
                    >
                      {connectionStatus.ds3.testing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ds3-username">Username</Label>
                    <Input
                      id="ds3-username"
                      type="text"
                      placeholder="DS3 username"
                      value={credentials.ds3.username}
                      onChange={(e) => handleCredentialChange('ds3', 'username', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ds3-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="ds3-password"
                        type={showPasswords ? 'text' : 'password'}
                        placeholder="DS3 password"
                        value={credentials.ds3.password}
                        onChange={(e) => handleCredentialChange('ds3', 'password', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(!showPasswords)}
                      >
                        {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="ds3-endpoint">API Endpoint</Label>
                  <Input
                    id="ds3-endpoint"
                    type="text"
                    placeholder="https://api.ds3.com"
                    value={credentials.ds3.endpoint}
                    onChange={(e) => handleCredentialChange('ds3', 'endpoint', e.target.value)}
                  />
                </div>
              </div>

              {/* Save Credentials Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4" />
                  <span>Credentials are encrypted and stored securely</span>
                </div>
                <Button onClick={handleSaveCredentials}>
                  <Shield className="w-4 h-4 mr-2" />
                  Save Credentials
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Security settings will be implemented here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Notification preferences will be implemented here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}