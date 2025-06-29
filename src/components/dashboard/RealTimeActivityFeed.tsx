
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Activity,
  Eye,
  ArrowRight
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'success' | 'pending' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: Date;
  actionable?: boolean;
}

export const RealTimeActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'success',
      title: 'Patient Check-in Completed',
      description: 'Maria Garcia checked in for 2:30 PM appointment',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      actionable: true
    },
    {
      id: '2',
      type: 'success',
      title: 'SOAP Note Generated',
      description: 'AI generated SOAP note for John Smith visit',
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: '3',
      type: 'pending',
      title: 'Insurance Verification Pending',
      description: '3 patients require insurance verification',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      actionable: true
    },
    {
      id: '4',
      type: 'success',
      title: 'Claims Submitted',
      description: 'Batch of 12 claims submitted successfully',
      timestamp: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: '5',
      type: 'warning',
      title: 'Appointment Reminder Failed',
      description: 'SMS reminder failed for tomorrow\'s appointments',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      actionable: true
    }
  ]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Activity className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'warning': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return timestamp.toLocaleDateString();
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'warning' : 'success',
        title: 'New Activity',
        description: 'Real-time update from system',
        timestamp: new Date(),
        actionable: Math.random() > 0.5
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Real-Time Activity
            </CardTitle>
            <CardDescription>
              Live updates from across your practice
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                index === 0 ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                  <Badge className={`text-xs ${getBadgeColor(activity.type)}`}>
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
                <span className="text-xs text-muted-foreground">{formatTimeAgo(activity.timestamp)}</span>
              </div>
              
              {activity.actionable && (
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
