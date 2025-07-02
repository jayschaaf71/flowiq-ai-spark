import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  Clock,
  User
} from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  title: string;
  appointment_type: string;
  status: string;
  duration: number;
  patient_id?: string;
  patient_name?: string;
  provider_id?: string;
  notes?: string;
}

interface CalendarViewProps {
  onCreateAppointment?: (date: Date, time?: string) => void;
  onViewAppointment?: (appointment: Appointment) => void;
}

export const CalendarView = ({ onCreateAppointment, onViewAppointment }: CalendarViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, [currentWeek]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const weekStart = startOfWeek(currentWeek);
      const weekEnd = addDays(weekStart, 7);

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lt('date', format(weekEnd, 'yyyy-MM-dd'))
        .order('date')
        .order('time');

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const weekStart = startOfWeek(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7; // 7 AM to 11 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getAppointmentsForDateTime = (date: Date, time: string) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date) && 
      apt.time.startsWith(time.slice(0, 2)) // Match hour
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Week of {format(weekStart, 'MMMM d, yyyy')}
                </CardTitle>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              {onCreateAppointment && (
                <Button onClick={() => onCreateAppointment(new Date())}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b">
            {/* Time column header */}
            <div className="p-3 border-r bg-muted/50 font-medium">
              Time
            </div>
            {/* Day headers */}
            {weekDays.map((day) => (
              <div key={day.toISOString()} className="p-3 border-r text-center">
                <div className="font-medium">{format(day, 'EEE')}</div>
                <div className={`text-sm ${isSameDay(day, new Date()) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                  {format(day, 'MMM d')}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots and appointments */}
          <div className="max-h-96 overflow-y-auto">
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b min-h-16">
                {/* Time label */}
                <div className="p-2 border-r bg-muted/30 text-sm font-medium flex items-center">
                  {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                </div>
                
                {/* Day columns */}
                {weekDays.map((day) => {
                  const dayAppointments = getAppointmentsForDateTime(day, time);
                  
                  return (
                    <div 
                      key={`${day.toISOString()}-${time}`} 
                      className="border-r p-1 min-h-16 hover:bg-muted/30 cursor-pointer relative"
                      onClick={() => onCreateAppointment?.(day, time)}
                    >
                      {dayAppointments.length > 0 ? (
                        <div className="space-y-1">
                          {dayAppointments.map((appointment) => (
                            <div
                              key={appointment.id}
                              className={`p-2 rounded text-xs border cursor-pointer hover:shadow-sm ${getStatusColor(appointment.status)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                onViewAppointment?.(appointment);
                              }}
                            >
                              <div className="font-medium truncate">{appointment.title}</div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                <span>{appointment.time}</span>
                              </div>
                              {appointment.patient_name && (
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">{appointment.patient_name}</span>
                                </div>
                              )}
                              <Badge variant="secondary" className="text-xs mt-1">
                                {appointment.status}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};