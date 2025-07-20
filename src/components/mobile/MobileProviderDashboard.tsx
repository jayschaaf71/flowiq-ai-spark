
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useMobileCapabilities } from '@/hooks/useMobileCapabilities';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { 
  Bell, 
  Calendar, 
  Users, 
  Camera, 
  Wifi, 
  WifiOff,
  Fingerprint,
  Shield,
  RefreshCw
} from 'lucide-react';

export const MobileProviderDashboard: React.FC = () => {
  const { profile } = useAuth();
  const { isNative, platform, isOnline, deviceInfo } = useMobileCapabilities();
  const { permissions, scheduleLocalNotification } = usePushNotifications();
  const { capabilities: biometricCapabilities, enableBiometricAuth } = useBiometricAuth();
  const { offlineData, isOffline, syncWithServer } = useOfflineStorage();

  // Only show mobile features for providers
  if (!profile || profile.role === 'patient') {
    return null;
  }

  const handleEnableBiometrics = async () => {
    await enableBiometricAuth();
  };

  const handleTestNotification = async () => {
    await scheduleLocalNotification(
      'FlowIQ Test',
      'Mobile notifications are working correctly!'
    );
  };

  const handleSync = async () => {
    await syncWithServer();
  };

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Mobile Dashboard</h1>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
          {isNative && (
            <Badge variant="outline">{platform}</Badge>
          )}
        </div>
      </div>

      {/* Mobile Capabilities Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Mobile Features Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Push Notifications</span>
              <Badge variant={permissions.pushEnabled ? "default" : "secondary"}>
                {permissions.pushEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Biometric Auth</span>
              <Badge variant={biometricCapabilities.isEnabled ? "default" : "secondary"}>
                {biometricCapabilities.isEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Offline Data</span>
              <Badge variant={offlineData.appointments.length > 0 ? "default" : "secondary"}>
                {offlineData.appointments.length} items cached
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Network Status</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            {biometricCapabilities.isAvailable && !biometricCapabilities.isEnabled && (
              <Button
                onClick={handleEnableBiometrics}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                Enable Biometrics
              </Button>
            )}
            
            {permissions.localEnabled && (
              <Button
                onClick={handleTestNotification}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Test Notification
              </Button>
            )}
            
            <Button
              onClick={handleSync}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Calendar className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold">Today's Schedule</h3>
            <p className="text-sm text-gray-600">{offlineData.appointments.length} appointments</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Users className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold">Patient Records</h3>
            <p className="text-sm text-gray-600">{offlineData.patients.length} cached</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Camera className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold">Document Capture</h3>
            <p className="text-sm text-gray-600">Take photos</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Bell className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-gray-600">Manage alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Information (for debugging) */}
      {isNative && deviceInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Platform: {deviceInfo.platform}</div>
              <div>Model: {deviceInfo.model}</div>
              <div>OS: {deviceInfo.operatingSystem} {deviceInfo.osVersion}</div>
              <div>Manufacturer: {deviceInfo.manufacturer}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {isOffline && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-800">
              <WifiOff className="w-5 h-5" />
              <span className="font-medium">You're currently offline</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              Your data is cached locally and will sync when connection is restored.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
