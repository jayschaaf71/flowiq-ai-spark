import React, { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, FileText, Calendar, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'appointment' | 'system' | 'reminder' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

export const Notifications = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'New SOAP Note Generated',
      message: 'AI-generated SOAP note ready for review for Jimmy Jack',
      timestamp: '2 minutes ago',
      isRead: false,
      priority: 'medium',
      actionUrl: '/patients/jimmy-jack'
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Upcoming Appointment',
      message: 'Gang Gang has an appointment scheduled for tomorrow at 10:00 AM',
      timestamp: '5 minutes ago',
      isRead: false,
      priority: 'high',
      actionUrl: '/calendar?date=2025-07-18'
    },
    {
      id: '3',
      type: 'system',
      title: 'Database Backup Completed',
      message: 'Daily database backup completed successfully at 2:00 AM',
      timestamp: '1 hour ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: '4',
      type: 'alert',
      title: 'Schedule Conflict Detected',
      message: 'Potential scheduling conflict detected for Dr. Smith on Friday',
      timestamp: '3 hours ago',
      isRead: false,
      priority: 'high',
      actionUrl: '/schedule/conflicts'
    },
    {
      id: '5',
      type: 'appointment',
      title: 'Patient Check-in Completed',
      message: 'Sarah Johnson has completed check-in for 3:00 PM appointment',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'medium'
    }
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'system':
        return <AlertTriangle className="h-5 w-5 text-green-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'alert':
        return <Bell className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    
    toast({
      title: notification.title,
      description: notification.message,
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    });
  };

  const clearAll = () => {
    setNotifications([]);
    toast({
      title: "All notifications cleared",
      description: "All notifications have been cleared",
    });
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.isRead;
    if (activeTab === 'high') return notification.priority === 'high';
    return true; // 'all' tab
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high').length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Notifications"
        subtitle="Manage all your notifications and alerts"
      />

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={markAllAsRead} variant="outline" size="sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button onClick={clearAll} variant="outline" size="sm">
            Clear All
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({notifications.length})
          </TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
          <TabsTrigger value="high">
            High Priority ({highPriorityCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">No notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'unread' ? 'All notifications have been read' : 
                   activeTab === 'high' ? 'No high priority notifications' : 
                   'No notifications to display'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border-l-4 cursor-pointer transition-all hover:shadow-md ${getPriorityColor(notification.priority)} ${!notification.isRead ? 'bg-blue-50' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {notification.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;