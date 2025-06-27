
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Phone, Mail, Calendar, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

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
  icon: React.ComponentType<any>;
  iconColor: string;
  appointments: Appointment[];
  emptyMessage: string;
  userRole: string;
  onStatusUpdate: (appointmentId: string, status: Appointment['status']) => void;
  onSendReminder: (appointmentId: string) => void;
  loading: boolean;
  isToday: boolean;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  title,
  icon: Icon,
  iconColor,
  appointments,
  emptyMessage,
  userRole,
  onStatusUpdate,
  onSendReminder,
  loading,
  isToday
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'no-show': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusActions = (appointment: Appointment) => {
    const actions = [];
    
    if (appointment.status === 'pending') {
      actions.push(
        <Button
          key="confirm"
          size="sm"
          onClick={() => onStatusUpdate(appointment.id, 'confirmed')}
        >
          Confirm
        </Button>
      );
    }
    
    if (appointment.status === 'confirmed' && isToday) {
      actions.push(
        <Button
          key="complete"
          size="sm"
          variant="outline"
          onClick={() => onStatusUpdate(appointment.id, 'completed')}
        >
          Complete
        </Button>
      );
      actions.push(
        <Button
          key="no-show"
          size="sm"
          variant="outline"
          onClick={() => onStatusUpdate(appointment.id, 'no-show')}
        >
          No Show
        </Button>
      );
    }
    
    if (['pending', 'confirmed'].includes(appointment.status)) {
      actions.push(
        <Button
          key="cancel"
          size="sm"
          variant="destructive"
          onClick={() => onStatusUpdate(appointment.id, 'cancelled')}
        >
          Cancel
        </Button>
      );
    }

    return actions;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${iconColor}`} />
          {title}
          <Badge variant="secondary">{appointments.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{appointment.title}</h3>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{format(parseISO(appointment.date), 'PPP')}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.time} ({appointment.duration} min)</span>
                      </div>
                      
                      {appointment.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          <span>{appointment.phone}</span>
                        </div>
                      )}
                      
                      {appointment.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{appointment.email}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <Badge variant="outline">{appointment.appointment_type}</Badge>
                    </div>
                    
                    {appointment.notes && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <p>{appointment.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {userRole === 'staff' && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSendReminder(appointment.id)}
                    >
                      Send Reminder
                    </Button>
                    
                    <div className="flex gap-2">
                      {getStatusActions(appointment)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
