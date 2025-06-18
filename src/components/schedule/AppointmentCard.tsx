
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, CheckCircle, AlertTriangle, User } from "lucide-react";

interface Appointment {
  id: string;
  title: string;
  appointment_type: string;
  date: string;
  time: string;
  duration: number;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "no-show";
  notes?: string;
  phone?: string;
  email?: string;
  created_at: string;
  patient_id: string;
  provider_id?: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  isToday?: boolean;
  userRole?: string;
  onStatusUpdate: (appointmentId: string, newStatus: Appointment['status']) => void;
  onSendReminder: (appointment: Appointment) => void;
  loading: boolean;
}

export const AppointmentCard = ({ 
  appointment, 
  isToday = false, 
  userRole, 
  onStatusUpdate, 
  onSendReminder, 
  loading 
}: AppointmentCardProps) => {
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
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { 
      weekday: "short", 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isToday ? (
            <div className="text-lg font-medium text-blue-600">
              {appointment.time}
            </div>
          ) : (
            <div className="text-center">
              <div className="text-sm font-medium text-gray-600">
                {getDateLabel(appointment.date)}
              </div>
              <div className="text-lg font-medium text-green-600">
                {appointment.time}
              </div>
            </div>
          )}
          <div>
            <div className="font-medium">{appointment.title}</div>
            <div className="text-sm text-gray-600">
              {appointment.appointment_type} • {appointment.duration} min
            </div>
            {appointment.phone && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Phone className="h-3 w-3" />
                {appointment.phone}
                {appointment.email && (
                  <>
                    <Mail className="h-3 w-3 ml-2" />
                    {appointment.email}
                  </>
                )}
              </div>
            )}
            {userRole === 'patient' && appointment.provider_id && (
              <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                <User className="h-3 w-3" />
                Provider ID: {appointment.provider_id.slice(0, 8)}...
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
          {appointment.status === "pending" && !isToday && (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
          <div className="flex gap-1">
            {appointment.status === "pending" && userRole !== 'patient' && (
              <Button 
                size="sm" 
                onClick={() => onStatusUpdate(appointment.id, "confirmed")}
                disabled={loading}
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Confirm
              </Button>
            )}
            {userRole !== 'patient' && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSendReminder(appointment)}
                disabled={loading}
              >
                Remind
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
