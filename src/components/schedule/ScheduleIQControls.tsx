
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Zap, 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { scheduleIQService } from '@/services/scheduleIQService';
import { useToast } from '@/hooks/use-toast';

interface ScheduleIQControlsProps {
  practiceId: string;
  onConfigChange?: () => void;
}

export const ScheduleIQControls: React.FC<ScheduleIQControlsProps> = ({ 
  practiceId, 
  onConfigChange 
}) => {
  const [config, setConfig] = useState({
    aiOptimizationEnabled: true,
    autoBookingEnabled: true,
    waitlistEnabled: true,
    realTimeUpdates: true,
    smartReminders: true,
    conflictDetection: true
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'active' | 'paused' | 'error'>('active');
  const { toast } = useToast();

  const handleConfigChange = async (key: string, value: boolean) => {
    try {
      setConfig(prev => ({ ...prev, [key]: value }));
      
      // Save configuration
      await scheduleIQService.initializeConfig(practiceId);
      
      toast({
        title: "Configuration Updated",
        description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} ${value ? 'enabled' : 'disabled'}`,
      });
      
      onConfigChange?.();
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast({
        title: "Configuration Error",
        description: "Failed to update configuration",
        variant: "destructive"
      });
    }
  };

  const runQuickOptimization = async () => {
    try {
      setIsProcessing(true);
      
      // Run quick optimization
      const result = await scheduleIQService.manageWaitlist();
      
      toast({
        title: "Quick Optimization Complete",
        description: `Processed ${result.processed} items, booked ${result.booked} appointments`,
      });
    } catch (error) {
      console.error('Error running optimization:', error);
      toast({
        title: "Optimization Error",
        description: "Failed to run optimization",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleSystemStatus = () => {
    const newStatus = systemStatus === 'active' ? 'paused' : 'active';
    setSystemStatus(newStatus);
    
    toast({
      title: `Schedule iQ ${newStatus === 'active' ? 'Activated' : 'Paused'}`,
      description: `AI scheduling is now ${newStatus}`,
    });
  };

  const getStatusColor = () => {
    switch (systemStatus) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = () => {
    switch (systemStatus) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Schedule iQ System Status
            </div>
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-1 capitalize">{systemStatus}</span>
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                AI scheduling system is currently {systemStatus}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Button
              variant={systemStatus === 'active' ? 'outline' : 'default'}
              onClick={toggleSystemStatus}
              className="flex items-center gap-2"
            >
              {systemStatus === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {systemStatus === 'active' ? 'Pause' : 'Activate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={runQuickOptimization}
              disabled={isProcessing || systemStatus !== 'active'}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {isProcessing ? 'Processing...' : 'Quick Optimize'}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Process Waitlist
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Check Conflicts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-optimization">AI Optimization</Label>
                <p className="text-xs text-gray-500">Automatically optimize schedules</p>
              </div>
              <Switch
                id="ai-optimization"
                checked={config.aiOptimizationEnabled}
                onCheckedChange={(value) => handleConfigChange('aiOptimizationEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-booking">Auto Booking</Label>
                <p className="text-xs text-gray-500">Book appointments automatically</p>
              </div>
              <Switch
                id="auto-booking"
                checked={config.autoBookingEnabled}
                onCheckedChange={(value) => handleConfigChange('autoBookingEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="waitlist-enabled">Smart Waitlist</Label>
                <p className="text-xs text-gray-500">Manage waitlist intelligently</p>
              </div>
              <Switch
                id="waitlist-enabled"
                checked={config.waitlistEnabled}
                onCheckedChange={(value) => handleConfigChange('waitlistEnabled', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="real-time">Real-time Updates</Label>
                <p className="text-xs text-gray-500">Live schedule synchronization</p>
              </div>
              <Switch
                id="real-time"
                checked={config.realTimeUpdates}
                onCheckedChange={(value) => handleConfigChange('realTimeUpdates', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smart-reminders">Smart Reminders</Label>
                <p className="text-xs text-gray-500">AI-powered reminder timing</p>
              </div>
              <Switch
                id="smart-reminders"
                checked={config.smartReminders}
                onCheckedChange={(value) => handleConfigChange('smartReminders', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="conflict-detection">Conflict Detection</Label>
                <p className="text-xs text-gray-500">Automatic conflict resolution</p>
              </div>
              <Switch
                id="conflict-detection"
                checked={config.conflictDetection}
                onCheckedChange={(value) => handleConfigChange('conflictDetection', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {systemStatus === 'active' && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            Schedule iQ is actively monitoring your appointments and will optimize bookings in real-time. 
            All AI features are enabled and running smoothly.
          </AlertDescription>
        </Alert>
      )}

      {systemStatus === 'paused' && (
        <Alert>
          <Pause className="h-4 w-4" />
          <AlertDescription>
            Schedule iQ is currently paused. No automatic optimizations or bookings will occur until reactivated.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
