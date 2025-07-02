import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  Key,
  Globe,
  Zap,
  TestTube
} from "lucide-react";

export const RealTimeEligibilityAPI = () => {
  const [apiSettings, setApiSettings] = useState({
    changeHCXEnabled: true,
    pokitDokEnabled: false,
    customAPIEnabled: false,
    changeHCXApiKey: "chcx_live_***********",
    pokitDokApiKey: "",
    customAPIUrl: "",
    autoRetryEnabled: true,
    timeoutSettings: 30,
    cachingEnabled: true,
    cacheExpiry: 24
  });

  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const apiProviders = [
    {
      name: "Change Healthcare (HCX)",
      status: apiSettings.changeHCXEnabled ? "connected" : "disabled",
      uptime: "99.9%",
      avgResponseTime: "1.2s",
      supportedPayers: 2500,
      description: "Industry-leading eligibility and benefits verification"
    },
    {
      name: "PokitDok",
      status: apiSettings.pokitDokEnabled ? "connected" : "disabled", 
      uptime: "99.7%",
      avgResponseTime: "1.8s",
      supportedPayers: 1800,
      description: "Comprehensive healthcare API platform"
    },
    {
      name: "Custom API",
      status: apiSettings.customAPIEnabled ? "connected" : "disabled",
      uptime: "98.5%",
      avgResponseTime: "2.1s",
      supportedPayers: 500,
      description: "Direct payer integrations"
    }
  ];

  const runAPITest = async () => {
    setTesting(true);
    
    // Simulate API test
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setTestResults({
      timestamp: new Date().toLocaleString(),
      changeHCX: apiSettings.changeHCXEnabled ? {
        status: "success",
        responseTime: "1.2s",
        eligibilityCheck: "passed",
        benefitsRetrieval: "passed"
      } : null,
      pokitDok: apiSettings.pokitDokEnabled ? {
        status: "success", 
        responseTime: "1.8s",
        eligibilityCheck: "passed",
        benefitsRetrieval: "passed"
      } : null,
      customAPI: apiSettings.customAPIEnabled ? {
        status: "warning",
        responseTime: "2.1s", 
        eligibilityCheck: "passed",
        benefitsRetrieval: "failed"
      } : null
    });
    
    setTesting(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-700">Connected</Badge>;
      case "disabled":
        return <Badge variant="secondary">Disabled</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-700">Error</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Real-time Eligibility API Configuration
          </CardTitle>
          <CardDescription>
            Configure and manage external API connections for real-time insurance verification
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Providers Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              API Providers
            </CardTitle>
            <CardDescription>
              Configure external eligibility verification providers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Change Healthcare */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Change Healthcare (HCX)</h4>
                  <p className="text-sm text-gray-600">Primary eligibility provider</p>
                </div>
                <Switch 
                  checked={apiSettings.changeHCXEnabled}
                  onCheckedChange={(checked) => 
                    setApiSettings(prev => ({ ...prev, changeHCXEnabled: checked }))
                  }
                />
              </div>
              {apiSettings.changeHCXEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="chcx-api-key">API Key</Label>
                    <Input
                      id="chcx-api-key"
                      type="password"
                      value={apiSettings.changeHCXApiKey}
                      onChange={(e) => setApiSettings(prev => ({
                        ...prev,
                        changeHCXApiKey: e.target.value
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Uptime: 99.9%</div>
                    <div>Response: 1.2s avg</div>
                    <div>Payers: 2,500+</div>
                    <div>Status: Active</div>
                  </div>
                </div>
              )}
            </div>

            {/* PokitDok */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">PokitDok</h4>
                  <p className="text-sm text-gray-600">Secondary eligibility provider</p>
                </div>
                <Switch 
                  checked={apiSettings.pokitDokEnabled}
                  onCheckedChange={(checked) => 
                    setApiSettings(prev => ({ ...prev, pokitDokEnabled: checked }))
                  }
                />
              </div>
              {apiSettings.pokitDokEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="pokitdok-api-key">API Key</Label>
                    <Input
                      id="pokitdok-api-key"
                      type="password"
                      placeholder="Enter PokitDok API key"
                      value={apiSettings.pokitDokApiKey}
                      onChange={(e) => setApiSettings(prev => ({
                        ...prev,
                        pokitDokApiKey: e.target.value
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Uptime: 99.7%</div>
                    <div>Response: 1.8s avg</div>
                    <div>Payers: 1,800+</div>
                    <div>Status: Inactive</div>
                  </div>
                </div>
              )}
            </div>

            {/* Custom API */}
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Custom API</h4>
                  <p className="text-sm text-gray-600">Direct payer integrations</p>
                </div>
                <Switch 
                  checked={apiSettings.customAPIEnabled}
                  onCheckedChange={(checked) => 
                    setApiSettings(prev => ({ ...prev, customAPIEnabled: checked }))
                  }
                />
              </div>
              {apiSettings.customAPIEnabled && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="custom-api-url">API Endpoint URL</Label>
                    <Input
                      id="custom-api-url"
                      placeholder="https://api.example.com/eligibility"
                      value={apiSettings.customAPIUrl}
                      onChange={(e) => setApiSettings(prev => ({
                        ...prev,
                        customAPIUrl: e.target.value
                      }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Uptime: 98.5%</div>
                    <div>Response: 2.1s avg</div>
                    <div>Payers: 500+</div>
                    <div>Status: Custom</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Testing */}
        <div className="space-y-6">
          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>
                Configure performance and reliability options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-retry Failed Requests</Label>
                  <p className="text-sm text-gray-600">Automatically retry failed API calls</p>
                </div>
                <Switch 
                  checked={apiSettings.autoRetryEnabled}
                  onCheckedChange={(checked) => 
                    setApiSettings(prev => ({ ...prev, autoRetryEnabled: checked }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                <Input
                  id="timeout"
                  type="number"
                  value={apiSettings.timeoutSettings}
                  onChange={(e) => setApiSettings(prev => ({
                    ...prev,
                    timeoutSettings: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable Response Caching</Label>
                  <p className="text-sm text-gray-600">Cache responses to improve performance</p>
                </div>
                <Switch 
                  checked={apiSettings.cachingEnabled}
                  onCheckedChange={(checked) => 
                    setApiSettings(prev => ({ ...prev, cachingEnabled: checked }))
                  }
                />
              </div>

              {apiSettings.cachingEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="cache-expiry">Cache Expiry (hours)</Label>
                  <Input
                    id="cache-expiry"
                    type="number"
                    value={apiSettings.cacheExpiry}
                    onChange={(e) => setApiSettings(prev => ({
                      ...prev,
                      cacheExpiry: parseInt(e.target.value)
                    }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                API Testing
              </CardTitle>
              <CardDescription>
                Test your API connections and validate responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={runAPITest}
                disabled={testing}
                className="w-full"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing APIs...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Run API Tests
                  </>
                )}
              </Button>

              {testResults && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="text-sm font-medium">
                    Test Results - {testResults.timestamp}
                  </div>
                  
                  {testResults.changeHCX && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Change Healthcare</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs">{testResults.changeHCX.responseTime}</span>
                      </div>
                    </div>
                  )}
                  
                  {testResults.pokitDok && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">PokitDok</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-xs">{testResults.pokitDok.responseTime}</span>
                      </div>
                    </div>
                  )}
                  
                  {testResults.customAPI && (
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Custom API</span>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs">{testResults.customAPI.responseTime}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Provider Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Provider Status Overview
          </CardTitle>
          <CardDescription>
            Real-time status of all configured API providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apiProviders.map((provider) => (
              <div key={provider.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{provider.name}</h4>
                  {getStatusBadge(provider.status)}
                </div>
                <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">{provider.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Response:</span>
                    <span className="font-medium">{provider.avgResponseTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Supported Payers:</span>
                    <span className="font-medium">{provider.supportedPayers.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};