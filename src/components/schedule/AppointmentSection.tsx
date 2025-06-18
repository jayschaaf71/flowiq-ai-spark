
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentCard } from "./AppointmentCard";
import { LucideIcon } from "lucide-react";

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

interface AppointmentSectionProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  appointments: Appointment[];
  emptyMessage: string;
  userRole?: string;
  onStatusUpdate: (appointmentId: string, newStatus: Appointment['status']) => void;
  onSendReminder: (appointment: Appointment) => void;
  loading: boolean;
  isToday?: boolean;
}

export const AppointmentSection = ({
  title,
  icon: Icon,
  iconColor,
  appointments,
  emptyMessage,
  userRole,
  onStatusUpdate,
  onSendReminder,
  loading,
  isToday = false
}: AppointmentSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title} ({appointments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isToday={isToday}
                userRole={userRole}
                onStatusUpdate={onStatusUpdate}
                onSendReminder={onSendReminder}
                loading={loading}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
