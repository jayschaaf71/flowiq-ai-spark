
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAppointmentReminders, useSendReminder } from "@/hooks/useReminders";
import { useAppointments } from "@/hooks/useAppointments";
import { Bell, Mail, MessageSquare, Clock, User } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";

export const AppointmentReminders = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const { appointments } = useAppointments();
  const { data: reminders = [] } = useAppointmentReminders();
  const sendReminder = useSendReminder();

  // Filter upcoming appointments that need reminders
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(`${apt.date} ${apt.time}`);
    const now = new Date();
    return appointmentDate > now && apt.status === 'confirmed';
  });

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d, yyyy");
  };

  const getAppointmentReminders = (appointmentId: string) => {
    return reminders.filter(r => r.appointment_id === appointmentId);
  };

  const handleSendReminder = async (appointmentId: string, type: 'email' | 'sms') => {
    await sendReminder.mutateAsync({ appointmentId, type });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Appointment Reminders</h3>
          <p className="text-sm text-gray-600">
            Send reminders to patients about upcoming appointments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">Appointments need reminders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reminders.filter(r => isToday(new Date(r.created_at)) && r.status === 'sent').length}
            </div>
            <p className="text-xs text-muted-foreground">Reminders sent today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">Delivery success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>
            Send reminders to patients about their scheduled appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No upcoming appointments requiring reminders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => {
                const appointmentReminders = getAppointmentReminders(appointment.id);
                const hasEmailReminder = appointmentReminders.some(r => r.reminder_type === 'email');
                const hasSMSReminder = appointmentReminders.some(r => r.reminder_type === 'sms');

                return (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{appointment.title}</h4>
                          <Badge variant="outline">
                            {appointment.appointment_type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Patient ID: {appointment.patient_id}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {getDateLabel(appointment.date)} at {appointment.time}
                          </div>
                          {appointment.phone && (
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4" />
                              {appointment.phone}
                            </div>
                          )}
                          {appointment.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {appointment.email}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {hasEmailReminder && (
                            <Badge variant="secondary" className="text-green-700 bg-green-100">
                              <Mail className="h-3 w-3 mr-1" />
                              Email Sent
                            </Badge>
                          )}
                          {hasSMSReminder && (
                            <Badge variant="secondary" className="text-green-700 bg-green-100">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              SMS Sent
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(appointment.id, 'email')}
                          disabled={hasEmailReminder || sendReminder.isPending || !appointment.email}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(appointment.id, 'sms')}
                          disabled={hasSMSReminder || sendReminder.isPending || !appointment.phone}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          SMS
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
