import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Activity
} from 'lucide-react';
import { ehrIntegrationService } from '@/services/ehrIntegrationService';
import { insuranceVerificationService } from '@/services/insuranceVerificationService';
import { providerAvailabilityService } from '@/services/providerAvailabilityService';

export const IntegrationDashboard = () => {
  const [ehrConnected, setEhrConnected] = useState(false);
  const [insuranceVerificationEnabled, setInsuranceVerificationEnabled] = useState(true);
  const [availabilitySyncEnabled, setAvailabilitySyncEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [syncStats, setSyncStats] = useState({
    lastEhrSync: null as Date | null,
    patientsUpdated: 0,
    insuranceVerifications: 0,
    availabilityConflicts: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadIntegrationStatus();
  }, []);

  const loadIntegrationStatus = async () => {
    try {
      const ehrConnections = await ehrIntegrationService.getEHRConnections();
      setEhrConnected(ehrConnections.some(conn => conn.status === 'connected'));
      
      const syncConfig = await providerAvailabilityService.getSyncConfiguration();
      setAvailabilitySyncEnabled(syncConfig.enabled);
      
      const verificationSettings = await insuranceVerificationService.getVerificationSettings();
      setInsuranceVerificationEnabled(verificationSettings.enabled);
    } catch (error) {
      console.error('Failed to load integration status:', error);
    }
  };

  const handleEhrSync = async () => {
    setLoading(true);
    try {
      const result = await ehrIntegrationService.syncPatientData('ehr-1');
      setSyncStats(prev => ({
        ...prev,
        lastEhrSync: result.lastSyncTime,
        patientsUpdated: result.patientsUpdated
      }));
      
      toast({
        title: "EHR Sync Complete",
        description: `Updated ${result.patientsUpdated} patient records`,
      });
    } catch (error) {
      toast({
        title: "EHR Sync Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInsuranceVerification = async () => {
    setLoading(true);
    try {
      // Mock batch verification
      const results = await insuranceVerificationService.batchVerifyInsurances(['patient-1', 'patient-2']);
      setSyncStats(prev => ({
        ...prev,
        insuranceVerifications: results.length
      }));
      
      toast({
        title: "Insurance Verification Complete",
        description: `Verified ${results.length} insurance policies`,
      });
    } catch (error) {
      toast({
        title: "Insurance Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailabilitySync = async (enabled: boolean) => {
    try {
      const config = await providerAvailabilityService.getSyncConfiguration();
      config.enabled = enabled;
      await providerAvailabilityService.updateSyncConfiguration(config);
      setAvailabilitySyncEnabled(enabled);
      
      toast({
        title: enabled ? "Availability Sync Enabled" : "Availability Sync Disabled",
        description: enabled ? "Real-time provider availability sync is now active" : "Real-time sync has been disabled",
      });
    } catch (error) {
      toast({
        title: "Configuration Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* EHR Integration Status */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${ehrConnected ? 'bg-green-100' : 'bg-gray-100'}`}>
                <Database className={`w-6 h-6 ${ehrConnected ? 'text-green-600' : 'text-gray-600'}`} />
              </div>
              <div>
                <p className="text-sm font-medium">EHR Integration</p>
                <Badge className={ehrConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {ehrConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insurance Verification */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Insurance Verification</p>
                <p className="text-xs text-gray-600">{syncStats.insuranceVerifications} verified today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Availability Sync */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <RefreshCw className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Availability Sync</p>
                <Badge className={availabilitySyncEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {availabilitySyncEnabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Codes */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">AI Billing Codes</p>
                <p className="text-xs text-gray-600">Ready for suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* EHR Integration Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            EHR Integration
          </CardTitle>
          <CardDescription>
            Sync patient data with your Electronic Health Record system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Manual Sync</p>
              <p className="text-sm text-gray-600">
                Last sync: {syncStats.lastEhrSync ? syncStats.lastEhrSync.toLocaleString() : 'Never'}
              </p>
            </div>
            <Button onClick={handleEhrSync} disabled={loading || !ehrConnected}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Sync Now
            </Button>
          </div>
          
          {syncStats.patientsUpdated > 0 && (
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Last sync updated {syncStats.patientsUpdated} patient records
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insurance Verification Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Insurance Verification
          </CardTitle>
          <CardDescription>
            Automated insurance eligibility verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Auto Verification</p>
              <p className="text-sm text-gray-600">
                Verify insurance before appointments
              </p>
            </div>
            <Switch
              checked={insuranceVerificationEnabled}
              onCheckedChange={setInsuranceVerificationEnabled}
            />
          </div>
          
          <Button onClick={handleInsuranceVerification} disabled={loading} variant="outline" className="w-full">
            <Activity className="w-4 h-4 mr-2" />
            Run Verification Batch
          </Button>
        </CardContent>
      </Card>

      {/* Availability Sync Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Real-Time Availability Sync
          </CardTitle>
          <CardDescription>
            Keep provider schedules synchronized across all platforms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Real-Time Sync</p>
              <p className="text-sm text-gray-600">
                Sync every 15 minutes with EHR and calendar systems
              </p>
            </div>
            <Switch
              checked={availabilitySyncEnabled}
              onCheckedChange={toggleAvailabilitySync}
            />
          </div>
          
          {syncStats.availabilityConflicts > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                {syncStats.availabilityConflicts} scheduling conflicts detected
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
