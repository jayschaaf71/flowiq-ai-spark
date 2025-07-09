import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Calendar,
  CalendarX,
  CalendarClock,
  UserX,
  AlertTriangle,
  FileCheck,
  MessageCircleWarning,
  TestTube,
  Pill,
  ClipboardList,
  Save,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ProviderNotificationPreferencesService,
  ProviderNotificationPreference,
  NOTIFICATION_TYPES,
  NotificationTypeConfig
} from '@/services/providerNotificationPreferencesService';

interface ProviderNotificationPreferencesProps {
  providerId: string;
}

const iconMap = {
  Calendar,
  CalendarX,
  CalendarClock,
  UserX,
  AlertTriangle,
  FileCheck,
  MessageCircleWarning,
  TestTube,
  Pill,
  ClipboardList
};

const urgencyColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800'
};

const categoryColors = {
  appointment: 'bg-blue-50 border-blue-200',
  patient: 'bg-green-50 border-green-200',
  clinical: 'bg-purple-50 border-purple-200',
  system: 'bg-gray-50 border-gray-200'
};

export const ProviderNotificationPreferences: React.FC<ProviderNotificationPreferencesProps> = ({ 
  providerId 
}) => {
  const [preferences, setPreferences] = useState<ProviderNotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quietHours, setQuietHours] = useState({ start: '22:00', end: '08:00' });
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const { toast } = useToast();

  const daysOfWeek = [
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
    { value: 7, label: 'Sun' }
  ];

  useEffect(() => {
    loadPreferences();
  }, [providerId]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const prefs = await ProviderNotificationPreferencesService.getProviderPreferences(providerId);
      
      if (prefs.length === 0) {
        // Initialize default preferences
        await ProviderNotificationPreferencesService.initializeDefaultPreferences(providerId);
        const newPrefs = await ProviderNotificationPreferencesService.getProviderPreferences(providerId);
        setPreferences(newPrefs);
      } else {
        setPreferences(prefs);
        // Set quiet hours and days from first preference (they should be consistent)
        if (prefs[0]) {
          setQuietHours({
            start: prefs[0].quiet_hours_start,
            end: prefs[0].quiet_hours_end
          });
          setSelectedDays(prefs[0].days_of_week);
        }
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (
    notificationType: string,
    field: keyof ProviderNotificationPreference,
    value: any
  ) => {
    setSaving(true);
    try {
      const success = await ProviderNotificationPreferencesService.updatePreference(
        providerId,
        notificationType,
        { [field]: value }
      );

      if (success) {
        setPreferences(prev => 
          prev.map(pref => 
            pref.notification_type === notificationType 
              ? { ...pref, [field]: value }
              : pref
          )
        );
        
        toast({
          title: 'Preferences Updated',
          description: 'Your notification preferences have been saved'
        });
      } else {
        throw new Error('Failed to update preference');
      }
    } catch (error) {
      console.error('Error updating preference:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification preference',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateQuietHours = async () => {
    setSaving(true);
    try {
      const success = await ProviderNotificationPreferencesService.updateQuietHours(
        providerId,
        quietHours.start,
        quietHours.end
      );

      if (success) {
        toast({
          title: 'Quiet Hours Updated',
          description: 'Your quiet hours have been saved'
        });
      } else {
        throw new Error('Failed to update quiet hours');
      }
    } catch (error) {
      console.error('Error updating quiet hours:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quiet hours',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateDaysOfWeek = async (days: number[]) => {
    setSaving(true);
    try {
      const success = await ProviderNotificationPreferencesService.updateDaysOfWeek(
        providerId,
        days
      );

      if (success) {
        setSelectedDays(days);
        toast({
          title: 'Days Updated',
          description: 'Your notification days have been saved'
        });
      } else {
        throw new Error('Failed to update days');
      }
    } catch (error) {
      console.error('Error updating days:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification days',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const getPreferenceForType = (notificationType: string) => {
    return preferences.find(p => p.notification_type === notificationType);
  };

  const renderNotificationTypeCard = (typeConfig: NotificationTypeConfig) => {
    const preference = getPreferenceForType(typeConfig.type);
    const IconComponent = iconMap[typeConfig.icon as keyof typeof iconMap];

    return (
      <Card key={typeConfig.type} className={`${categoryColors[typeConfig.category]} transition-all hover:shadow-md`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <IconComponent className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{typeConfig.label}</CardTitle>
                <p className="text-sm text-muted-foreground">{typeConfig.description}</p>
              </div>
            </div>
            <Badge className={urgencyColors[typeConfig.urgency]}>
              {typeConfig.urgency}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <Label htmlFor={`${typeConfig.type}-email`} className="text-sm">Email</Label>
              <Switch
                id={`${typeConfig.type}-email`}
                checked={preference?.email_enabled || false}
                onCheckedChange={(checked) => 
                  updatePreference(typeConfig.type, 'email_enabled', checked)
                }
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Bell className="w-4 h-4 text-green-600" />
              <Label htmlFor={`${typeConfig.type}-app`} className="text-sm">In-App</Label>
              <Switch
                id={`${typeConfig.type}-app`}
                checked={preference?.in_app_enabled || false}
                onCheckedChange={(checked) => 
                  updatePreference(typeConfig.type, 'in_app_enabled', checked)
                }
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <Label htmlFor={`${typeConfig.type}-sms`} className="text-sm">SMS</Label>
              <Switch
                id={`${typeConfig.type}-sms`}
                checked={preference?.sms_enabled || false}
                onCheckedChange={(checked) => 
                  updatePreference(typeConfig.type, 'sms_enabled', checked)
                }
                disabled={saving}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-purple-600" />
              <Label htmlFor={`${typeConfig.type}-push`} className="text-sm">Push</Label>
              <Switch
                id={`${typeConfig.type}-push`}
                checked={preference?.push_enabled || false}
                onCheckedChange={(checked) => 
                  updatePreference(typeConfig.type, 'push_enabled', checked)
                }
                disabled={saving}
              />
            </div>
          </div>
          
          {typeConfig.supports_timing && (
            <div className="flex items-center gap-2 pt-2 border-t">
              <Clock className="w-4 h-4 text-gray-600" />
              <Label className="text-sm">Timing:</Label>
              <Select
                value={preference?.timing_minutes?.toString() || '30'}
                onValueChange={(value) => 
                  updatePreference(typeConfig.type, 'timing_minutes', parseInt(value))
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="240">4 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-muted-foreground">before event</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const categorizedTypes = NOTIFICATION_TYPES.reduce((acc, type) => {
    if (!acc[type.category]) acc[type.category] = [];
    acc[type.category].push(type);
    return acc;
  }, {} as Record<string, NotificationTypeConfig[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
      </div>
      
      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notification Types</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Timing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-6">
          {Object.entries(categorizedTypes).map(([category, types]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize flex items-center gap-2">
                {category === 'appointment' && <Calendar className="w-5 h-5" />}
                {category === 'patient' && <FileCheck className="w-5 h-5" />}
                {category === 'clinical' && <TestTube className="w-5 h-5" />}
                {category === 'system' && <Settings className="w-5 h-5" />}
                {category} Notifications
              </h3>
              <div className="grid gap-4">
                {types.map(renderNotificationTypeCard)}
              </div>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="schedule" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Quiet Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={quietHours.start}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, start: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={quietHours.end}
                    onChange={(e) => setQuietHours(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
                <Button onClick={updateQuietHours} disabled={saving} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Quiet Hours
                </Button>
                <p className="text-sm text-muted-foreground">
                  Non-urgent notifications will be paused during these hours
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Active Days
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <Button
                      key={day.value}
                      variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const newDays = selectedDays.includes(day.value)
                          ? selectedDays.filter(d => d !== day.value)
                          : [...selectedDays, day.value].sort();
                        updateDaysOfWeek(newDays);
                      }}
                      disabled={saving}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Select which days you want to receive notifications
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};