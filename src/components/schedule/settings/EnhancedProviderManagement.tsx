import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Phone, MessageSquare, AlertTriangle, CheckCircle, XCircle, Eye, Edit, PhoneCall, RefreshCw, Settings, ExternalLink, Bell, Database, Zap, Shield, Users, Plus, Trash2, CalendarDays, Timer, Activity, Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProviders } from '@/hooks/useProviders';

interface WorkingHours {
  day: string;
  startTime: string;
  endTime: string;
  isWorking: boolean;
  breakStart?: string;
  breakEnd?: string;
}

interface AppointmentType {
  id: string;
  name: string;
  duration: number; // in minutes
  color: string;
  maxCapacity: number;
  isActive: boolean;
}

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  specialty: string;
  email: string;
  phone: string;
  isActive: boolean;
  workingHours: WorkingHours[];
  appointmentTypes: AppointmentType[];
  waitlistSettings: {
    autoFill: boolean;
    maxWaitlistSize: number;
    priorityRules: string[];
    notificationSettings: {
      email: boolean;
      sms: boolean;
      inApp: boolean;
    };
  };
}

interface WaitlistItem {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  preferredDate: string;
  preferredTime: string;
  appointmentType: string;
  priority: 'high' | 'medium' | 'low';
  addedDate: string;
  notes?: string;
  status: 'waiting' | 'contacted' | 'scheduled' | 'expired';
}

export const EnhancedProviderManagement = () => {
  const { toast } = useToast();
  const { providers, loading: providersLoading } = useProviders();
  
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [showWaitlistSettings, setShowWaitlistSettings] = useState(false);
  const [waitlistItems, setWaitlistItems] = useState<WaitlistItem[]>([]);
  const [aiWaitlistEnabled, setAiWaitlistEnabled] = useState(true);

  // Mock data for demonstration
  const mockProviders: Provider[] = [
    {
      id: '1',
      firstName: 'Dr. Sarah',
      lastName: 'Gatsas',
      specialty: 'Dental Sleep Medicine',
      email: 'dr.gatsas@midwestdental.com',
      phone: '(555) 123-4567',
      isActive: true,
      workingHours: [
        { day: 'Monday', startTime: '08:00', endTime: '17:00', isWorking: true, breakStart: '12:00', breakEnd: '13:00' },
        { day: 'Tuesday', startTime: '08:00', endTime: '17:00', isWorking: true, breakStart: '12:00', breakEnd: '13:00' },
        { day: 'Wednesday', startTime: '08:00', endTime: '17:00', isWorking: true, breakStart: '12:00', breakEnd: '13:00' },
        { day: 'Thursday', startTime: '08:00', endTime: '17:00', isWorking: true, breakStart: '12:00', breakEnd: '13:00' },
        { day: 'Friday', startTime: '08:00', endTime: '17:00', isWorking: true, breakStart: '12:00', breakEnd: '13:00' },
        { day: 'Saturday', startTime: '09:00', endTime: '14:00', isWorking: false },
        { day: 'Sunday', startTime: '09:00', endTime: '14:00', isWorking: false },
      ],
      appointmentTypes: [
        { id: '1', name: 'Sleep Study Consultation', duration: 60, color: '#3B82F6', maxCapacity: 1, isActive: true },
        { id: '2', name: 'CPAP Fitting', duration: 45, color: '#10B981', maxCapacity: 1, isActive: true },
        { id: '3', name: 'Follow-up Visit', duration: 30, color: '#F59E0B', maxCapacity: 1, isActive: true },
        { id: '4', name: 'Emergency Visit', duration: 90, color: '#EF4444', maxCapacity: 1, isActive: true },
      ],
      waitlistSettings: {
        autoFill: true,
        maxWaitlistSize: 50,
        priorityRules: ['urgent', 'existing_patient', 'first_available'],
        notificationSettings: {
          email: true,
          sms: true,
          inApp: true,
        },
      },
    },
    {
      id: '2',
      firstName: 'Dr. Michael',
      lastName: 'Johnson',
      specialty: 'Dental Sleep Medicine',
      email: 'dr.johnson@midwestdental.com',
      phone: '(555) 123-4568',
      isActive: true,
      workingHours: [
        { day: 'Monday', startTime: '09:00', endTime: '18:00', isWorking: true, breakStart: '12:30', breakEnd: '13:30' },
        { day: 'Tuesday', startTime: '09:00', endTime: '18:00', isWorking: true, breakStart: '12:30', breakEnd: '13:30' },
        { day: 'Wednesday', startTime: '09:00', endTime: '18:00', isWorking: true, breakStart: '12:30', breakEnd: '13:30' },
        { day: 'Thursday', startTime: '09:00', endTime: '18:00', isWorking: true, breakStart: '12:30', breakEnd: '13:30' },
        { day: 'Friday', startTime: '09:00', endTime: '18:00', isWorking: true, breakStart: '12:30', breakEnd: '13:30' },
        { day: 'Saturday', startTime: '09:00', endTime: '14:00', isWorking: false },
        { day: 'Sunday', startTime: '09:00', endTime: '14:00', isWorking: false },
      ],
      appointmentTypes: [
        { id: '1', name: 'Sleep Study Consultation', duration: 60, color: '#3B82F6', maxCapacity: 1, isActive: true },
        { id: '2', name: 'CPAP Fitting', duration: 45, color: '#10B981', maxCapacity: 1, isActive: true },
        { id: '3', name: 'Follow-up Visit', duration: 30, color: '#F59E0B', maxCapacity: 1, isActive: true },
      ],
      waitlistSettings: {
        autoFill: true,
        maxWaitlistSize: 30,
        priorityRules: ['urgent', 'existing_patient', 'first_available'],
        notificationSettings: {
          email: true,
          sms: false,
          inApp: true,
        },
      },
    },
  ];

  const mockWaitlistItems: WaitlistItem[] = [
    {
      id: '1',
      patientName: 'John Smith',
      patientPhone: '(555) 123-4567',
      patientEmail: 'john.smith@email.com',
      preferredDate: '2024-01-15',
      preferredTime: '09:00',
      appointmentType: 'Sleep Study Consultation',
      priority: 'high',
      addedDate: '2024-01-10',
      notes: 'Urgent case - severe sleep apnea',
      status: 'waiting',
    },
    {
      id: '2',
      patientName: 'Sarah Wilson',
      patientPhone: '(555) 234-5678',
      patientEmail: 'sarah.wilson@email.com',
      preferredDate: '2024-01-20',
      preferredTime: '14:00',
      appointmentType: 'CPAP Fitting',
      priority: 'medium',
      addedDate: '2024-01-12',
      status: 'waiting',
    },
    {
      id: '3',
      patientName: 'Mike Davis',
      patientPhone: '(555) 345-6789',
      patientEmail: 'mike.davis@email.com',
      preferredDate: '2024-01-18',
      preferredTime: '10:00',
      appointmentType: 'Follow-up Visit',
      priority: 'low',
      addedDate: '2024-01-11',
      status: 'contacted',
    },
  ];

  useEffect(() => {
    setWaitlistItems(mockWaitlistItems);
  }, []);

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleWorkingHoursSave = (workingHours: WorkingHours[]) => {
    if (selectedProvider) {
      // Update provider working hours
      toast({
        title: 'Success',
        description: 'Working hours updated successfully',
      });
    }
  };

  const handleWaitlistSettingsSave = (settings: any) => {
    toast({
      title: 'Success',
      description: 'Waitlist settings updated successfully',
    });
  };

  const handleAiWaitlistToggle = (enabled: boolean) => {
    setAiWaitlistEnabled(enabled);
    toast({
      title: enabled ? 'AI Waitlist Enabled' : 'AI Waitlist Disabled',
      description: enabled ? 'AI will automatically manage waitlist and fill cancellations' : 'Manual waitlist management only',
    });
  };

  const handleAutoFillWaitlist = () => {
    // Simulate AI auto-filling waitlist
    toast({
      title: 'AI Waitlist Processing',
      description: 'AI is analyzing cancellations and filling openings with waitlist patients...',
    });
    
    setTimeout(() => {
      toast({
        title: 'Waitlist Updated',
        description: '3 patients moved from waitlist to available appointments',
      });
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Enhanced Provider Management</h2>
          <p className="text-gray-600">Configure providers, working hours, and AI waitlist system</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={aiWaitlistEnabled}
              onCheckedChange={handleAiWaitlistToggle}
            />
            <Label>AI Waitlist</Label>
          </div>
          <Button onClick={handleAutoFillWaitlist} disabled={!aiWaitlistEnabled}>
            <Brain className="w-4 h-4 mr-2" />
            Auto-Fill Waitlist
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Provider List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Providers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProviders.map((provider) => (
              <div
                key={provider.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedProvider?.id === provider.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleProviderSelect(provider)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{provider.firstName} {provider.lastName}</p>
                    <p className="text-sm text-gray-600">{provider.specialty}</p>
                    <p className="text-xs text-gray-500">{provider.email}</p>
                  </div>
                  <Badge variant={provider.isActive ? "default" : "secondary"}>
                    {provider.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            ))}
            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </CardContent>
        </Card>

        {/* Selected Provider Details */}
        {selectedProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {selectedProvider.firstName} {selectedProvider.lastName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p><strong>Specialty:</strong> {selectedProvider.specialty}</p>
                <p><strong>Email:</strong> {selectedProvider.email}</p>
                <p><strong>Phone:</strong> {selectedProvider.phone}</p>
                <p><strong>Status:</strong> 
                  <Badge variant={selectedProvider.isActive ? "default" : "secondary"} className="ml-2">
                    {selectedProvider.isActive ? "Active" : "Inactive"}
                  </Badge>
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setShowWorkingHours(true)}
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Working Hours
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setShowWaitlistSettings(true)}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Waitlist Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Waitlist Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Waitlist System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Waitlist:</span>
                <Badge variant="outline">{waitlistItems.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>High Priority:</span>
                <Badge variant="destructive">{waitlistItems.filter(item => item.priority === 'high').length}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Ready to Schedule:</span>
                <Badge variant="default">{waitlistItems.filter(item => item.status === 'waiting').length}</Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button className="w-full" variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Waitlist
              </Button>
              <Button className="w-full" variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                AI Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Hours Dialog */}
      <Dialog open={showWorkingHours} onOpenChange={setShowWorkingHours}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Working Hours - {selectedProvider?.firstName} {selectedProvider?.lastName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedProvider?.workingHours.map((hours, index) => (
              <div key={hours.day} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="w-20">
                  <Label>{hours.day}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={hours.isWorking}
                    onCheckedChange={() => {}}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={hours.startTime}
                    className="w-24"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={hours.endTime}
                    className="w-24"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Break:</span>
                  <Input
                    type="time"
                    value={hours.breakStart || ''}
                    className="w-20"
                    placeholder="Start"
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    value={hours.breakEnd || ''}
                    className="w-20"
                    placeholder="End"
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWorkingHours(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleWorkingHoursSave(selectedProvider?.workingHours || []);
                setShowWorkingHours(false);
              }}>
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Waitlist Settings Dialog */}
      <Dialog open={showWaitlistSettings} onOpenChange={setShowWaitlistSettings}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Waitlist Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Auto-fill Cancellations</Label>
                <Switch
                  checked={selectedProvider?.waitlistSettings.autoFill || false}
                  onCheckedChange={() => {}}
                />
              </div>
              <div className="space-y-2">
                <Label>Maximum Waitlist Size</Label>
                <Input
                  type="number"
                  value={selectedProvider?.waitlistSettings.maxWaitlistSize || 50}
                  className="w-32"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority Rules</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority rule" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent cases first</SelectItem>
                    <SelectItem value="existing_patient">Existing patients first</SelectItem>
                    <SelectItem value="first_available">First available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notification Settings</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Switch checked={selectedProvider?.waitlistSettings.notificationSettings.email || false} />
                    <Label>Email notifications</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={selectedProvider?.waitlistSettings.notificationSettings.sms || false} />
                    <Label>SMS notifications</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={selectedProvider?.waitlistSettings.notificationSettings.inApp || false} />
                    <Label>In-app notifications</Label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowWaitlistSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleWaitlistSettingsSave({});
                setShowWaitlistSettings(false);
              }}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 