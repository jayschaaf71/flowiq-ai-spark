import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  Send,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  patient_name?: string;
  phone?: string;
  email?: string;
  appointment_type: string;
  notes?: string;
}

interface AppointmentQuickActionsProps {
  appointments?: Appointment[];
  onAppointmentsUpdate?: () => void;
}

export const AppointmentQuickActions = ({ 
  appointments = [],
  onAppointmentsUpdate 
}: AppointmentQuickActionsProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Filter appointments for different categories
  const todayAppointments = appointments.filter(apt => 
    isToday(new Date(apt.date)) && apt.status !== 'cancelled'
  );
  
  const tomorrowAppointments = appointments.filter(apt => 
    isTomorrow(new Date(apt.date)) && apt.status !== 'cancelled'
  );

  const pendingAppointments = appointments.filter(apt => 
    apt.status === 'pending'
  );

  const upcomingReminders = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return aptDate >= tomorrow && apt.status === 'confirmed';
  }).slice(0, 5);

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Appointment status changed to ${newStatus}`,
      });

      onAppointmentsUpdate?.();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendReminder = async (appointment: Appointment) => {
    try {
      setLoading(true);
      
      // In a real implementation, this would trigger the send-reminder edge function
      console.log('Sending reminder for appointment:', appointment.id);
      
      toast({
        title: "Reminder Sent",
        description: `Reminder sent to ${appointment.patient_name || appointment.title}`,
      });
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast({
        title: "Error",
        description: "Failed to send reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="today" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">
            Today ({todayAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="tomorrow">
            Tomorrow ({tomorrowAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({pendingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="reminders">
            Reminders ({upcomingReminders.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Today's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No appointments scheduled for today
                </p>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">
                          {appointment.time}
                        </div>
                        <div>
                          <div className="font-medium">
                            {appointment.patient_name || appointment.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.appointment_type} • {appointment.duration}min
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </Badge>
                        {appointment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                            disabled={loading}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tomorrow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Tomorrow's Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tomorrowAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No appointments scheduled for tomorrow
                </p>
              ) : (
                <div className="space-y-4">
                  {tomorrowAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">
                          {appointment.time}
                        </div>
                        <div>
                          <div className="font-medium">
                            {appointment.patient_name || appointment.title}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.appointment_type} • {appointment.duration}min
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(appointment)}
                          disabled={loading}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Remind
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Pending Confirmations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAppointments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No pending appointments
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {appointment.patient_name || appointment.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(appointment.date), 'MMM d, yyyy')} at {appointment.time}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.appointment_type} • {appointment.duration}min
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          disabled={loading}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          disabled={loading}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Upcoming Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingReminders.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming reminders to send
                </p>
              ) : (
                <div className="space-y-4">
                  {upcomingReminders.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {appointment.patient_name || appointment.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(new Date(appointment.date), 'MMM d, yyyy')} at {appointment.time}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {appointment.phone || 'No phone'}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleSendReminder(appointment)}
                        disabled={loading}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send Reminder
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};