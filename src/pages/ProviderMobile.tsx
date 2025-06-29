
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Bell,
  Phone,
  MessageSquare,
  Mic,
  CheckCircle,
  AlertCircle,
  Activity,
  Search,
  Plus,
  MoreVertical
} from 'lucide-react';

export const ProviderMobile: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('schedule');

  const todaysAppointments = [
    {
      id: '1',
      time: '9:00 AM',
      patient: 'Sarah Johnson',
      type: 'Follow-up',
      status: 'checked-in',
      duration: '30 min',
      room: 'Room 101'
    },
    {
      id: '2',
      time: '10:30 AM',
      patient: 'Michael Chen',
      type: 'New Patient',
      status: 'scheduled',
      duration: '60 min',
      room: 'Room 102'
    },
    {
      id: '3',
      time: '2:00 PM',
      patient: 'Emily Davis',
      type: 'Annual Physical',
      status: 'intake-complete',
      duration: '45 min',
      room: 'Room 103'
    }
  ];

  const notifications = [
    {
      id: '1',
      type: 'urgent',
      message: 'Lab results available for Sarah Johnson',
      time: '5 min ago'
    },
    {
      id: '2',
      type: 'appointment',
      message: 'New appointment request from John Smith',
      time: '15 min ago'
    }
  ];

  const quickActions = [
    { icon: Search, label: 'Patient Lookup', color: 'bg-blue-500' },
    { icon: Plus, label: 'Quick Note', color: 'bg-green-500' },
    { icon: Mic, label: 'Voice Memo', color: 'bg-purple-500' },
    { icon: MessageSquare, label: 'Messages', color: 'bg-orange-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Provider Portal</h1>
            <p className="text-sm text-gray-600">Dr. Sarah Johnson</p>
          </div>
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-gray-700 text-center">{action.label}</span>
            </button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Today's Schedule
                </CardTitle>
                <CardDescription>
                  {todaysAppointments.length} appointments scheduled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todaysAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{appointment.time}</span>
                        </div>
                        <Badge 
                          variant={
                            appointment.status === 'checked-in' ? 'default' :
                            appointment.status === 'intake-complete' ? 'secondary' :
                            'outline'
                          }
                          className="text-xs"
                        >
                          {appointment.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.patient}</p>
                        <p className="text-sm text-gray-600">{appointment.type} • {appointment.duration}</p>
                        <p className="text-xs text-gray-500">{appointment.room}</p>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="flex-1">
                          View Chart
                        </Button>
                        <Button size="sm" className="flex-1">
                          Start Visit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="Search patients..." 
                    className="flex-1 p-2 border rounded-lg"
                  />
                  <Button size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Recent Patients</p>
                    <p className="text-sm text-gray-600">Quick access to recently seen patients</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Voice Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full mb-4">
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </Button>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Recent voice notes will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    {notification.type === 'urgent' ? (
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
