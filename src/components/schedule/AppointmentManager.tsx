
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, AlertTriangle } from "lucide-react";
import { format, addDays, isToday, isTomorrow, parseISO } from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  provider?: string;
  createdAt: string;
}

interface AppointmentManagerProps {
  onAppointmentUpdate?: (appointment: Appointment) => void;
}

export const AppointmentManager = ({ onAppointmentUpdate }: AppointmentManagerProps) => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  // Simulated data - replace with real API calls
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    // Simulate API call
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        patientName: "John Smith",
        phone: "(555) 123-4567",
        email: "john@email.com",
        date: format(new Date(), "yyyy-MM-dd"),
        time: "09:00",
        duration: 60,
        type: "Cleaning",
        status: "confirmed",
        provider: "Dr. Johnson",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        patientName: "Sarah Wilson",
        phone: "(555) 234-5678",
        email: "sarah@email.com",
        date: format(addDays(new Date(), 1), "yyyy-MM-dd"),
        time: "10:30",
        duration: 30,
        type: "Consultation",
        status: "pending",
        provider: "Dr. Smith",
        createdAt: new Date().toISOString()
      }
    ];
    
    setAppointments(mockAppointments);
    setLoading(false);
  };

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    setLoading(true);
    try {
      // Simulate API call
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: newStatus }
          : apt
      ));
      
      const updatedAppointment = appointments.find(apt => apt.id === appointmentId);
      if (updatedAppointment) {
        const updated = { ...updatedAppointment, status: newStatus };
        onAppointmentUpdate?.(updated);
      }
      
      toast({
        title: "Appointment Updated",
        description: `Status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async (appointment: Appointment) => {
    setLoading(true);
    try {
      // Simulate sending SMS/Email reminder
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Reminder Sent",
        description: `Reminder sent to ${appointment.patientName} via SMS and email`,
      });
    } catch (error) {
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
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "completed": return "bg-blue-100 text-blue-700 border-blue-200";
      case "no-show": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d, yyyy");
  };

  const todayAppointments = appointments.filter(apt => isToday(parseISO(apt.date)));
  const upcomingAppointments = appointments.filter(apt => !isToday(parseISO(apt.date)));

  return (
    <div className="space-y-6">
      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Today's Appointments ({todayAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {todayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments today</p>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-medium text-blue-600">
                        {appointment.time}
                      </div>
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-gray-600">
                          {appointment.type} • {appointment.duration} min • {appointment.provider}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Phone className="h-3 w-3" />
                          {appointment.phone}
                          <Mail className="h-3 w-3 ml-2" />
                          {appointment.email}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <div className="flex gap-1">
                        {appointment.status === "pending" && (
                          <Button 
                            size="sm" 
                            onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                            disabled={loading}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Confirm
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendReminder(appointment)}
                          disabled={loading}
                        >
                          Remind
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-600">
                          {getDateLabel(appointment.date)}
                        </div>
                        <div className="text-lg font-medium text-green-600">
                          {appointment.time}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-gray-600">
                          {appointment.type} • {appointment.duration} min • {appointment.provider}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      {appointment.status === "pending" && (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
