
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, ArrowRight, Eye } from "lucide-react";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "@/hooks/useAppointments";
import { AppointmentBookingModal } from "@/components/schedule/AppointmentBookingModal";
import { AppointmentDetailsModal } from "@/components/schedule/AppointmentDetailsModal";

export const CalendarWidget = () => {
  const navigate = useNavigate();
  const { appointments, loading } = useAppointments();
  const [todayAppointments, setTodayAppointments] = useState<any[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    if (appointments) {
      const today = format(new Date(), 'yyyy-MM-dd');
      const todaysAppts = appointments.filter(apt => apt.date === today);
      setTodayAppointments(todaysAppts.slice(0, 3)); // Show only first 3
    }
  }, [appointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDetailsModalOpen(true);
  };

  const handleQuickBook = () => {
    setBookingModalOpen(true);
  };

  const handleAppointmentBooked = () => {
    // Appointments will refresh automatically via real-time updates
  };

  const handleAppointmentUpdated = () => {
    // Appointments will refresh automatically via real-time updates
  };

  const handleAppointmentDeleted = () => {
    // Appointments will refresh automatically via real-time updates
  };

  return (
    <>
      <Card className="cursor-pointer hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today's Schedule
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleQuickBook}
              className="flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Book
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/schedule")}
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : todayAppointments.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No appointments today</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleQuickBook}
              >
                <Plus className="w-4 h-4 mr-1" />
                Schedule Appointment
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                  onClick={() => handleAppointmentClick(appointment)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      {appointment.time}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{appointment.title}</p>
                      <p className="text-xs text-gray-500">{appointment.appointment_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </Badge>
                    <Eye className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              
              {appointments && appointments.filter(apt => apt.date === format(new Date(), 'yyyy-MM-dd')).length > 3 && (
                <div className="text-center pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/schedule")}
                    className="text-blue-600"
                  >
                    +{appointments.filter(apt => apt.date === format(new Date(), 'yyyy-MM-dd')).length - 3} more appointments
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AppointmentBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        selectedDate={new Date()}
        onAppointmentBooked={handleAppointmentBooked}
      />

      <AppointmentDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        appointment={selectedAppointment}
        onAppointmentUpdated={handleAppointmentUpdated}
        onAppointmentDeleted={handleAppointmentDeleted}
      />
    </>
  );
};
