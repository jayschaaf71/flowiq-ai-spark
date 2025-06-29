
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, User, Calendar, FileText, X } from 'lucide-react';
import { ProviderNotificationService, ProviderNotification } from '@/services/providerNotificationService';
import { format } from 'date-fns';

interface ProviderNotificationBellProps {
  providerId: string;
}

export const ProviderNotificationBell: React.FC<ProviderNotificationBellProps> = ({ providerId }) => {
  const [notifications, setNotifications] = useState<ProviderNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      loadNotifications();
      loadUnreadCount();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [providerId]);

  const loadNotifications = async () => {
    try {
      const data = await ProviderNotificationService.getProviderNotifications(providerId);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const count = await ProviderNotificationService.getUnreadCount(providerId);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  };

  const handleNotificationClick = async (notification: ProviderNotification) => {
    if (!notification.is_read) {
      await ProviderNotificationService.markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'intake_completed':
        return <FileText className="w-4 h-4 text-green-600" />;
      case 'upcoming_appointment':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'intake_completed':
        return 'border-l-4 border-green-500';
      case 'upcoming_appointment':
        return 'border-l-4 border-blue-500';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 px-1 py-0 text-xs bg-red-500 text-white min-w-[1.25rem] h-5">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute top-12 right-0 w-96 max-h-96 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications yet
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read ? 'bg-blue-50' : ''
                      } ${getNotificationColor(notification.notification_type)}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.notification_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400">
                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
