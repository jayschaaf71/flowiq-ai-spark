import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus,
  Clock,
  User,
  MapPin
} from 'lucide-react';

export const PracticeScheduling = () => {
  const todayAppointments = [
    { 
      id: 1, 
      time: "9:00 AM", 
      patient: "Sarah Johnson",
      provider: "Dr. Emily Wilson",
      type: "Consultation",
      status: "confirmed",
      room: "Room 1"
    },
    { 
      id: 2, 
      time: "10:30 AM", 
      patient: "Mike Chen",
      provider: "Dr. Emily Wilson",
      type: "Follow-up",
      status: "pending",
      room: "Room 1"
    },
    { 
      id: 3, 
      time: "2:00 PM", 
      patient: "Lisa Rodriguez",
      provider: "Dr. Emily Wilson",
      type: "Treatment",
      status: "confirmed",
      room: "Room 2"
    },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground">Manage appointments and provider schedules</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Schedule Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter(a => a.status === 'confirmed').length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Confirmations</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {todayAppointments.filter(a => a.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Remaining today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Providers On Duty</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              Working today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{appointment.time} - {appointment.patient}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{appointment.provider}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{appointment.room}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Type: {appointment.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusBadgeVariant(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <Calendar className="h-6 w-6" />
              <span className="text-sm">View Calendar</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <Clock className="h-6 w-6" />
              <span className="text-sm">Set Availability</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col items-center gap-2 p-4">
              <User className="h-6 w-6" />
              <span className="text-sm">Provider Schedule</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};