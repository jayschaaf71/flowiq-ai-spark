import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, User, Phone, Mail, Plus } from 'lucide-react';
import { format, isSameDay } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';
import { Tables } from '@/integrations/supabase/types';

type Appointment = Tables<"appointments">;

interface TodaysAppointmentsProps {
  onCreateAppointment?: () => void;
  onViewAppointment?: (appointment: Appointment) => void;
}

export const TodaysAppointments = ({ onCreateAppointment, onViewAppointment }: TodaysAppointmentsProps) => {
  const { appointments, loading } = useAppointments();

  // Filter appointments for today only
  const todaysAppointments = appointments?.filter(apt => {
    const today = new Date();
    const appointmentDate = new Date(apt.date);
    return isSameDay(appointmentDate, today);
  }) || [];

  // Sort by time
  const sortedAppointments = todaysAppointments.sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (time: string) => {
    try {
      return format(new Date(`2000-01-01T${time}`), 'h:mm a');
    } catch {
      return time;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading today's appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Today's Appointments
          </h2>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button onClick={onCreateAppointment}>
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{sortedAppointments.length}</div>
              <div className="text-sm text-gray-600">Total Today</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {sortedAppointments.filter(a => a.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {sortedAppointments.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sortedAppointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Appointment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No appointments scheduled for today</p>
              <p className="text-gray-400 text-sm mt-2">
                Click "New Appointment" to schedule one
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onViewAppointment?.(appointment)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-lg font-semibold text-blue-600">
                        {formatTime(appointment.time)}
                      </div>
                      <Badge className={`${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.duration} minutes
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{appointment.patient_name || appointment.title}</span>
                      </div>
                      {appointment.appointment_type && (
                        <div className="text-sm text-gray-600">
                          Type: {appointment.appointment_type}
                        </div>
                      )}
                      {appointment.provider && (
                        <div className="text-sm text-gray-600">
                          Provider: {appointment.provider}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {appointment.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.phone}</span>
                        </div>
                      )}
                      {appointment.email && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{appointment.email}</span>
                        </div>
                      )}
                      {appointment.room && (
                        <div className="text-sm text-gray-600">
                          Room: {appointment.room}
                        </div>
                      )}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        <strong>Notes:</strong> {appointment.notes}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};