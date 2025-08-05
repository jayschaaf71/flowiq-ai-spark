import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Phone, MessageSquare, AlertTriangle, CheckCircle, XCircle, Eye, Edit, PhoneCall, RefreshCw, Settings, ExternalLink } from 'lucide-react';
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

export const DentalSleepDashboard = () => {
  const { tenantConfig, getBrandName } = useSpecialty();
  const { toast } = useToast();
  const [todayPatients, setTodayPatients] = useState<Patient[]>([]);
  const [yesterdayIncomplete, setYesterdayIncomplete] = useState<Patient[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);

  // Mock data - replace with real API calls
  useEffect(() => {
    // Today's patients
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

    // Yesterday's incomplete cases
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

    // Action items - from various systems
    setActionItems([
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
      },
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
    ]);

    // Quick stats
    setQuickStats([
      {
        label: 'Today\'s Appointments',
        value: 3,
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
        value: 2,
        change: 1,
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-red-600'
      },
      {
        label: 'Action Items',
        value: 5,
        change: 2,
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-green-600'
      }
    ]);
  }, []);

  const handleCallPatient = (patient: Patient) => {
    // Implement call functionality
    toast({
      title: "Calling Patient",
      description: `Initiating call to ${patient.name} at ${patient.phone}`,
    });
    console.log('Calling:', patient.name, patient.phone);
  };

  const handleMessagePatient = (patient: Patient) => {
    // Implement message functionality
    toast({
      title: "Messaging Patient",
      description: `Opening message to ${patient.name} at ${patient.email}`,
    });
    console.log('Messaging:', patient.name, patient.email);
  };

  const handleViewPatientDetails = (patient: Patient) => {
    // Navigate to patient details
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

  const handleRefreshDashboard = () => {
    toast({
      title: "Refreshing Dashboard",
      description: "Updating all data from systems...",
    });
    // In real implementation, this would refresh data from all systems
    console.log('Refreshing dashboard data');
  };

  const handleOpenSettings = () => {
    toast({
      title: "Opening Settings",
      description: "Navigating to dashboard settings",
    });
    console.log('Opening dashboard settings');
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
          <p className="text-gray-600">Good morning, Dr. Gatsas. Here's your practice overview for today.</p>
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

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Patient Schedule */}
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

        {/* Yesterday's Incomplete Cases */}
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

        {/* Action Items Queue */}
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
      </div>
    </div>
  );
};