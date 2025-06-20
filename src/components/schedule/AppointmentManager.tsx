
import { AppointmentSection } from "./AppointmentSection";
import { useAppointments } from "@/hooks/useAppointments";
import { Calendar, Clock } from "lucide-react";
import { isToday, parseISO } from "date-fns";

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

interface AppointmentManagerProps {
  onAppointmentUpdate?: (appointment: Appointment) => void;
}

export const AppointmentManager = ({ onAppointmentUpdate }: AppointmentManagerProps) => {
  const { appointments, loading, updateAppointmentStatus, sendReminder } = useAppointments();

  const handleStatusUpdate = async (appointmentId: string, newStatus: Appointment['status']) => {
    const updatedAppointment = await updateAppointmentStatus(appointmentId, newStatus);
    if (updatedAppointment && onAppointmentUpdate) {
      onAppointmentUpdate({ ...updatedAppointment, status: newStatus });
    }
  };

  const todayAppointments = appointments.filter(apt => isToday(parseISO(apt.date)));
  const upcomingAppointments = appointments.filter(apt => !isToday(parseISO(apt.date)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AppointmentSection
        title="Today's Appointments"
        icon={Calendar}
        iconColor="text-blue-600"
        appointments={todayAppointments}
        emptyMessage="No appointments today"
        userRole="staff"
        onStatusUpdate={handleStatusUpdate}
        onSendReminder={sendReminder}
        loading={loading}
        isToday={true}
      />

      <AppointmentSection
        title="Upcoming Appointments"
        icon={Clock}
        iconColor="text-green-600"
        appointments={upcomingAppointments}
        emptyMessage="No upcoming appointments"
        userRole="staff"
        onStatusUpdate={handleStatusUpdate}
        onSendReminder={sendReminder}
        loading={loading}
        isToday={false}
      />
    </div>
  );
};
