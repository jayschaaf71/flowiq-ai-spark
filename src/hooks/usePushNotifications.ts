
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NotificationPermissions {
  pushEnabled: boolean;
  localEnabled: boolean;
  token?: string;
}

export const usePushNotifications = () => {
  const [permissions, setPermissions] = useState<NotificationPermissions>({
    pushEnabled: false,
    localEnabled: false
  });
  const { profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !profile || profile.role === 'patient') {
      return; // Only enable for providers on native platforms
    }

    const initializeNotifications = async () => {
      try {
        // Request permissions for local notifications
        const localPermission = await LocalNotifications.requestPermissions();
        
        // Request permissions for push notifications
        const pushPermission = await PushNotifications.requestPermissions();
        
        if (pushPermission.receive === 'granted') {
          await PushNotifications.register();
        }

        setPermissions({
          pushEnabled: pushPermission.receive === 'granted',
          localEnabled: localPermission.display === 'granted'
        });

        // Listen for registration
        PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token: ' + token.value);
          setPermissions(prev => ({ ...prev, token: token.value }));
          
          // TODO: Send token to backend for provider-specific notifications
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (err) => {
          console.error('Registration error: ', err.error);
          toast({
            title: "Notification Setup Failed",
            description: "Unable to setup push notifications. Some features may be limited.",
            variant: "destructive"
          });
        });

        // Listen for incoming notifications
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received: ', notification);
          
          // Show local notification if app is in foreground
          if (permissions.localEnabled) {
            LocalNotifications.schedule({
              notifications: [
                {
                  title: notification.title || 'FlowIQ Notification',
                  body: notification.body || 'You have a new notification',
                  id: Date.now(),
                  schedule: { at: new Date(Date.now() + 1000) }
                }
              ]
            });
          }
        });

        // Handle notification tap
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed: ', notification);
          
          // Navigate based on notification data
          const data = notification.notification.data;
          if (data?.route) {
            window.location.href = data.route;
          }
        });

      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, [profile, permissions.localEnabled, toast]);

  const scheduleLocalNotification = async (title: string, body: string, scheduleTime?: Date) => {
    if (!permissions.localEnabled) return false;

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id: Date.now(),
            schedule: scheduleTime ? { at: scheduleTime } : { at: new Date(Date.now() + 1000) }
          }
        ]
      });
      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  };

  return {
    permissions,
    scheduleLocalNotification
  };
};
