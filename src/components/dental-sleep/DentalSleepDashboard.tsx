import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Phone, MessageSquare, AlertTriangle, CheckCircle, XCircle, Eye, Edit, PhoneCall, RefreshCw, Settings, ExternalLink, Bell, Database, Zap, Shield } from 'lucide-react';
import { format, isToday, isYesterday, parseISO } from 'date-fns';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { useToast } from '@/hooks/use-toast';

// Types
interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  appointmentType: 'new-patient' | 'follow-up' | 'delivery';
  time: string;
  status: 'confirmed' | 'unconfirmed' | 'cancelled';
  notes?: string;
}

interface ActionItem {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  type: 'claim' | 'appointment' | 'follow-up' | 'admin' | 'clinical';
  description: string;
  dueDate: string;
  completed: boolean;
  patientName?: string;
  amount?: number;
  insurance?: string;
}

interface QuickStat {
  label: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: number;
  showNotifications: boolean;
  greetingMessage: string;
  dataSources: {
    practiceManagement: boolean;
    claimsSystem: boolean;
    clinicalSystem: boolean;
    billingSystem: boolean;
  };
  layout: {
    showQuickStats: boolean;
    showTodaySchedule: boolean;
    showYesterdayIncomplete: boolean;
    showActionItems: boolean;
  };
}

export const DentalSleepDashboard = () => {
  const { tenantConfig, getBrandName } = useSpecialty();
  const { toast } = useToast();
  const [todayPatients, setTodayPatients] = useState<Patient[]>([]);
  const [yesterdayIncomplete, setYesterdayIncomplete] = useState<Patient[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<DashboardSettings>({
    autoRefresh: true,
    refreshInterval: 5,
    showNotifications: true,
    greetingMessage: "Good morning, Dr. Gatsas. Here's your practice overview for today.",
    dataSources: {
      practiceManagement: true,
      claimsSystem: true,
      clinicalSystem: true,
      billingSystem: true,
    },
    layout: {
      showQuickStats: true,
      showTodaySchedule: true,
      showYesterdayIncomplete: true,
      showActionItems: true,
    }
  });

  // Mock data - replace with real API calls
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Simulate API calls to different systems
      await Promise.all([
        loadTodayPatients(),
        loadYesterdayIncomplete(),
        loadActionItems(),
        loadQuickStats()
      ]);
    } catch (error) {
      toast({
        title: "Error Loading Data",
        description: "Some data may not be up to date. Please check your connections.",
        variant: "destructive"
      });
    }
  };

  const loadTodayPatients = async () => {
    // Simulate API call to practice management system
    setTodayPatients([
      {
        id: '1',
        name: 'Sarah Johnson',
        phone: '(555) 123-4567',
        email: 'sarah.johnson@email.com',
        appointmentType: 'new-patient',
        time: '09:00',
        status: 'confirmed',
        notes: 'Sleep study consultation'
      },
      {
        id: '2',
        name: 'Michael Chen',
        phone: '(555) 234-5678',
        email: 'michael.chen@email.com',
        appointmentType: 'follow-up',
        time: '10:30',
        status: 'unconfirmed',
        notes: 'Follow-up on CPAP therapy'
      },
      {
        id: '3',
        name: 'Lisa Rodriguez',
        phone: '(555) 345-6789',
        email: 'lisa.rodriguez@email.com',
        appointmentType: 'delivery',
        time: '14:00',
        status: 'confirmed',
        notes: 'CPAP device delivery'
      }
    ]);
  };

  const loadYesterdayIncomplete = async () => {
    // Simulate API call to clinical system
    setYesterdayIncomplete([
      {
        id: '4',
        name: 'Robert Wilson',
        phone: '(555) 456-7890',
        email: 'robert.wilson@email.com',
        appointmentType: 'new-patient',
        time: '09:00',
        status: 'confirmed',
        notes: 'Sleep study results pending'
      },
      {
        id: '5',
        name: 'Jennifer Davis',
        phone: '(555) 567-8901',
        email: 'jennifer.davis@email.com',
        appointmentType: 'follow-up',
        time: '11:00',
        status: 'confirmed',
        notes: 'CPAP compliance review needed'
      }
    ]);
  };

  const loadActionItems = async () => {
    // Simulate API calls to multiple systems
    const claimsItems = await loadClaimsItems();
    const clinicalItems = await loadClinicalItems();
    const adminItems = await loadAdminItems();
    
    setActionItems([...claimsItems, ...clinicalItems, ...adminItems]);
  };

  const loadClaimsItems = async () => {
    // Simulate claims system API
    return [
      {
        id: '1',
        title: 'Process Sarah Johnson Claims',
        priority: 'high',
        type: 'claim',
        description: 'Submit sleep study claims for yesterday\'s appointment',
        dueDate: '2024-01-15',
        completed: false,
        patientName: 'Sarah Johnson',
        amount: 2500,
        insurance: 'Blue Cross'
      }
    ];
  };

  const loadClinicalItems = async () => {
    // Simulate clinical system API
    return [
      {
        id: '3',
        title: 'Review Lisa Rodriguez CPAP Settings',
        priority: 'low',
        type: 'clinical',
        description: 'Adjust CPAP pressure settings based on sleep study',
        dueDate: '2024-01-16',
        completed: false,
        patientName: 'Lisa Rodriguez'
      },
      {
        id: '4',
        title: 'Complete Robert Wilson SOAP Note',
        priority: 'high',
        type: 'clinical',
        description: 'Document yesterday\'s sleep study consultation',
        dueDate: '2024-01-15',
        completed: false,
        patientName: 'Robert Wilson'
      }
    ];
  };

  const loadAdminItems = async () => {
    // Simulate admin system API
    return [
      {
        id: '2',
        title: 'Follow up with Michael Chen',
        priority: 'medium',
        type: 'follow-up',
        description: 'Confirm appointment for tomorrow',
        dueDate: '2024-01-15',
        completed: false,
        patientName: 'Michael Chen'
      },
      {
        id: '5',
        title: 'Verify Jennifer Davis Insurance',
        priority: 'medium',
        type: 'admin',
        description: 'Check coverage for CPAP device replacement',
        dueDate: '2024-01-16',
        completed: false,
        patientName: 'Jennifer Davis',
        insurance: 'Aetna'
      }
    ];
  };

  const loadQuickStats = async () => {
    // Calculate stats from loaded data
    setQuickStats([
      {
        label: 'Today\'s Appointments',
        value: todayPatients.length,
        change: 1,
        icon: <Calendar className="w-4 h-4" />,
        color: 'text-blue-600'
      },
      {
        label: 'Pending Claims',
        value: 12,
        change: -2,
        icon: <AlertTriangle className="w-4 h-4" />,
        color: 'text-orange-600'
      },
      {
        label: 'Yesterday Incomplete',
        value: yesterdayIncomplete.length,
        change: 1,
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-red-600'
      },
      {
        label: 'Action Items',
        value: actionItems.length,
        change: 2,
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-600'
      }
    ]);
  };

  const handleCallPatient = (patient: Patient) => {
    toast({
      title: "Calling Patient",
      description: `Initiating call to ${patient.name} at ${patient.phone}`,
    });
    console.log('Calling:', patient.name, patient.phone);
  };

  const handleMessagePatient = (patient: Patient) => {
    toast({
      title: "Messaging Patient",
      description: `Opening message to ${patient.name} at ${patient.email}`,
    });
    console.log('Messaging:', patient.name, patient.email);
  };

  const handleViewPatientDetails = (patient: Patient) => {
    toast({
      title: "Viewing Patient Details",
      description: `Opening detailed view for ${patient.name}`,
    });
    console.log('Viewing details for:', patient.name);
  };

  const handleCompleteActionItem = (actionItem: ActionItem) => {
    setActionItems(prev =>
      prev.map(item =>
        item.id === actionItem.id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
    
    toast({
      title: actionItem.completed ? "Action Item Reopened" : "Action Item Completed",
      description: actionItem.completed 
        ? `${actionItem.title} has been reopened`
        : `${actionItem.title} has been marked as complete`,
    });
  };

  const handleEditIncompleteCase = (patient: Patient) => {
    toast({
      title: "Editing Incomplete Case",
      description: `Opening case details for ${patient.name}`,
    });
    console.log('Editing incomplete case for:', patient.name);
  };

  const handleRefreshDashboard = async () => {
    toast({
      title: "Refreshing Dashboard",
      description: "Updating all data from systems...",
    });
    await loadDashboardData();
    toast({
      title: "Dashboard Updated",
      description: "All data has been refreshed successfully.",
    });
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleSaveSettings = (newSettings: DashboardSettings) => {
    setSettings(newSettings);
    setShowSettings(false);
    toast({
      title: "Settings Saved",
      description: "Dashboard settings have been updated.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'unconfirmed':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'new-patient':
        return 'bg-blue-100 text-blue-800';
      case 'follow-up':
        return 'bg-green-100 text-green-800';
      case 'delivery':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionItemIcon = (type: string) => {
    switch (type) {
      case 'claim':
        return <ExternalLink className="w-4 h-4" />;
      case 'appointment':
        return <Calendar className="w-4 h-4" />;
      case 'follow-up':
        return <Phone className="w-4 h-4" />;
      case 'clinical':
        return <User className="w-4 h-4" />;
      case 'admin':
        return <Settings className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Morning Dashboard</h1>
          <p className="text-gray-600">{settings.greetingMessage}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshDashboard}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={handleOpenSettings}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      {settings.layout.showQuickStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-sm ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change >= 0 ? '+' : ''}{stat.change} from yesterday
                    </p>
                  </div>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Patient Schedule */}
        {settings.layout.showTodaySchedule && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayPatients.map((patient) => (
                  <div key={patient.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(patient.status)}
                        <h3 className="font-medium text-gray-900">{patient.name}</h3>
                      </div>
                      <span className="text-sm text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {patient.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className={getAppointmentTypeColor(patient.appointmentType)}>
                        {patient.appointmentType.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs text-gray-600">{patient.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCallPatient(patient)}
                        className="flex-1"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMessagePatient(patient)}
                        className="flex-1"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewPatientDetails(patient)}
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Yesterday's Incomplete Cases */}
        {settings.layout.showYesterdayIncomplete && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-600" />
                Yesterday Incomplete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {yesterdayIncomplete.map((patient) => (
                  <div key={patient.id} className="p-3 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{patient.name}</h3>
                      <Badge variant="outline" className="bg-red-100 text-red-800">
                        Incomplete
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{patient.notes}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditIncompleteCase(patient)}
                      className="w-full"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Complete Case
                    </Button>
                  </div>
                ))}
                {yesterdayIncomplete.length === 0 && (
                  <p className="text-gray-500 text-center py-4">All yesterday's cases are complete!</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Items Queue */}
        {settings.layout.showActionItems && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {actionItems.map((item) => (
                  <div key={item.id} className={`p-3 border rounded-lg ${item.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getActionItemIcon(item.type)}
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <h3 className={`font-medium text-sm ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`text-xs ${item.completed ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {item.description}
                    </p>
                    {item.patientName && (
                      <p className="text-xs text-gray-500 mb-1">Patient: {item.patientName}</p>
                    )}
                    {item.amount && (
                      <p className="text-xs text-gray-500 mb-1">Amount: ${item.amount}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Due: {item.dueDate}</p>
                      <Button
                        size="sm"
                        variant={item.completed ? "outline" : "default"}
                        onClick={() => handleCompleteActionItem(item)}
                      >
                        {item.completed ? 'Undo' : 'Complete'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dashboard Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* General Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">General Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="greeting">Greeting Message</Label>
                  <Input
                    id="greeting"
                    value={settings.greetingMessage}
                    onChange={(e) => setSettings({...settings, greetingMessage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                  <Select value={settings.refreshInterval.toString()} onValueChange={(value) => setSettings({...settings, refreshInterval: parseInt(value)})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="autoRefresh"
                  checked={settings.autoRefresh}
                  onCheckedChange={(checked) => setSettings({...settings, autoRefresh: checked})}
                />
                <Label htmlFor="autoRefresh">Auto-refresh dashboard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={settings.showNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, showNotifications: checked})}
                />
                <Label htmlFor="notifications">Show notifications</Label>
              </div>
            </div>

            {/* Data Sources */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Data Sources</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="practiceManagement"
                    checked={settings.dataSources.practiceManagement}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      dataSources: {...settings.dataSources, practiceManagement: checked}
                    })}
                  />
                  <Label htmlFor="practiceManagement">Practice Management System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="claimsSystem"
                    checked={settings.dataSources.claimsSystem}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      dataSources: {...settings.dataSources, claimsSystem: checked}
                    })}
                  />
                  <Label htmlFor="claimsSystem">Claims System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="clinicalSystem"
                    checked={settings.dataSources.clinicalSystem}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      dataSources: {...settings.dataSources, clinicalSystem: checked}
                    })}
                  />
                  <Label htmlFor="clinicalSystem">Clinical System</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="billingSystem"
                    checked={settings.dataSources.billingSystem}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      dataSources: {...settings.dataSources, billingSystem: checked}
                    })}
                  />
                  <Label htmlFor="billingSystem">Billing System</Label>
                </div>
              </div>
            </div>

            {/* Layout Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Layout Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showQuickStats"
                    checked={settings.layout.showQuickStats}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      layout: {...settings.layout, showQuickStats: checked}
                    })}
                  />
                  <Label htmlFor="showQuickStats">Show Quick Stats</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showTodaySchedule"
                    checked={settings.layout.showTodaySchedule}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      layout: {...settings.layout, showTodaySchedule: checked}
                    })}
                  />
                  <Label htmlFor="showTodaySchedule">Show Today's Schedule</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showYesterdayIncomplete"
                    checked={settings.layout.showYesterdayIncomplete}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      layout: {...settings.layout, showYesterdayIncomplete: checked}
                    })}
                  />
                  <Label htmlFor="showYesterdayIncomplete">Show Yesterday Incomplete</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showActionItems"
                    checked={settings.layout.showActionItems}
                    onCheckedChange={(checked) => setSettings({
                      ...settings, 
                      layout: {...settings.layout, showActionItems: checked}
                    })}
                  />
                  <Label htmlFor="showActionItems">Show Action Items</Label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleSaveSettings(settings)}>
                Save Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};