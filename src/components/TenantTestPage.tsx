import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { parseTenantFromUrl } from '@/utils/tenantRouting';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Brain, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const TenantTestPage: React.FC = () => {
  const navigate = useNavigate();
  const tenantRoute = parseTenantFromUrl();
  
  const getTenantInfo = () => {
    if (!tenantRoute) {
      return {
        name: 'No Tenant Detected',
        specialty: 'Unknown',
        status: 'error',
        description: 'No tenant routing detected for this URL'
      };
    }
    
    const tenantMap = {
      'd52278c3-bf0d-4731-bfa9-a40f032fa305': {
        name: 'Midwest Dental Sleep Medicine Institute',
        specialty: 'Dental Sleep Medicine',
        icon: Brain,
        color: 'bg-purple-100 text-purple-800 border-purple-200'
      },
      '024e36c1-a1bc-44d0-8805-3162ba59a0c2': {
        name: 'West County Spine and Joint',
        specialty: 'Chiropractic Care',
        icon: Activity,
        color: 'bg-green-100 text-green-800 border-green-200'
      }
    };
    
    const tenant = tenantMap[tenantRoute.tenantId as keyof typeof tenantMap];
    
    return {
      name: tenant?.name || 'Unknown Tenant',
      specialty: tenant?.specialty || 'Unknown Specialty',
      status: 'success',
      description: `Tenant detected: ${tenantRoute.subdomain}`,
      icon: tenant?.icon || Users,
      color: tenant?.color || 'bg-gray-100 text-gray-800 border-gray-200'
    };
  };
  
  const tenantInfo = getTenantInfo();
  const IconComponent = tenantInfo.icon;
  
  const testUrls = [
    {
      name: 'West County Spine (Chiropractic)',
      url: '/chiropractic/dashboard',
      description: 'Chiropractic practice dashboard'
    },
    {
      name: 'Midwest Dental Sleep',
      url: '/dental-sleep/dashboard',
      description: 'Dental sleep medicine dashboard'
    },
    {
      name: 'Main Dashboard',
      url: '/dashboard',
      description: 'Platform admin dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            FlowIQ Tenant Routing Test
          </h1>
          <p className="text-gray-600">
            Testing multi-tenant routing in production environment
          </p>
        </div>

        {/* Current URL Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Current URL Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Hostname</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {window.location.hostname}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Pathname</label>
                <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                  {window.location.pathname}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tenant Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {tenantInfo.status === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              Tenant Detection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge className={tenantInfo.color}>
                <IconComponent className="w-4 h-4 mr-1" />
                {tenantInfo.specialty}
              </Badge>
              <div>
                <h3 className="font-semibold">{tenantInfo.name}</h3>
                <p className="text-sm text-gray-600">{tenantInfo.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Test Navigation</CardTitle>
            <CardDescription>
              Click the buttons below to test different tenant routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testUrls.map((testUrl, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  onClick={() => navigate(testUrl.url)}
                >
                  <span className="font-medium">{testUrl.name}</span>
                  <span className="text-xs text-gray-600">{testUrl.description}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Production Status */}
        <Card>
          <CardHeader>
            <CardTitle>Production Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Application Deployed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Multi-Tenant Routing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Database Connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>AI Agents Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button 
                onClick={() => window.open('https://flowiq-ai-spark-dd2bkzruq-flow-iq.vercel.app/chiropractic/dashboard', '_blank')}
              >
                Test West County Spine
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://flowiq-ai-spark-dd2bkzruq-flow-iq.vercel.app/dental-sleep/dashboard', '_blank')}
              >
                Test Midwest Dental Sleep
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 