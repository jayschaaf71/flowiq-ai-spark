
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Activity, 
  Bell, 
  Settings,
  RefreshCw,
  Calendar,
  Users
} from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';

export const EnhancedDashboardHeader: React.FC = () => {
  const { state, addNotification } = useDashboard();
  const unreadNotifications = state.notifications.filter(n => !n.isRead).length;

  const handleRefresh = () => {
    addNotification({
      type: 'info',
      title: 'Dashboard Refreshed',
      message: 'All data has been updated with the latest information'
    });
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">FlowIQ Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  AI-powered healthcare practice management
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-8">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-600">System Online</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            
            <Button
              variant="outline" 
              size="sm"
              className="relative flex items-center gap-2"
            >
              <Bell className="w-4 h-4" />
              Notifications
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">12</span>
            </div>
            <p className="text-sm text-muted-foreground">Today's Appointments</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">847</span>
            </div>
            <p className="text-sm text-muted-foreground">Active Patients</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">156</span>
            </div>
            <p className="text-sm text-muted-foreground">AI Automations</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">94%</span>
            </div>
            <p className="text-sm text-muted-foreground">Efficiency Score</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
