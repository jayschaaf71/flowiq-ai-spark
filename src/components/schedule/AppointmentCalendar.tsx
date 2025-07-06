import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, isToday, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Phone } from 'lucide-react';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  patient_name?: string;
  phone?: string;
  appointment_type: string;
  provider_id?: string;
  providers?: {
    first_name: string;
    last_name: string;
  };
}

interface Provider {
  id: string;
  first_name: string;
  last_name: string;
  specialty?: string;
}

interface AppointmentCalendarProps {
  onAppointmentClick?: (appointment: Appointment) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

export const AppointmentCalendar = ({ onAppointmentClick, onTimeSlotClick }: AppointmentCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8; // Start at 8 AM
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    fetchProviders();
    fetchAppointments();
  }, [currentWeek, selectedProvider]);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('id, first_name, last_name, specialty')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const startDate = format(weekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd');

      let query = supabase
        .from('appointments')
        .select(`
          *,
          providers (first_name, last_name)
        `)
        .gte('date', startDate)
        .lte('date', endDate)
        .neq('status', 'cancelled')
        .order('date')
        .order('time');

      if (selectedProvider !== 'all') {
        query = query.eq('provider_id', selectedProvider);
      }

      const { data, error } = await query;

      if (error) throw error;
      setAppointments(data as unknown as Appointment[] || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getAppointmentAtTime = (date: Date, time: string) => {
    const dayAppointments = getAppointmentsForDay(date);
    return dayAppointments.find(apt => apt.time === time);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'no-show': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1));
  };

  const handleThisWeek = () => {
    setCurrentWeek(new Date());
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    const appointment = getAppointmentAtTime(date, time);
    if (appointment) {
      onAppointmentClick?.(appointment);
    } else {
      onTimeSlotClick?.(date, time);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Weekly Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleThisWeek}>
                This Week
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.first_name} {provider.last_name}
                    {provider.specialty && ` (${provider.specialty})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-muted-foreground">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with days */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="text-sm font-medium text-muted-foreground">Time</div>
                {weekDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className={`text-center py-2 rounded-lg ${
                      isToday(day) ? 'bg-primary text-primary-foreground' : 'text-sm font-medium'
                    }`}
                  >
                    <div className="text-xs">{format(day, 'EEE')}</div>
                    <div className="text-lg">{format(day, 'd')}</div>
                  </div>
                ))}
              </div>

              {/* Time slots grid */}
              <div className="space-y-1">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-2">
                    <div className="text-xs text-muted-foreground py-2 text-right">
                      {time}
                    </div>
                    {weekDays.map((day) => {
                      const appointment = getAppointmentAtTime(day, time);
                      const isPastDate = day < new Date() && !isToday(day);
                      
                      return (
                        <button
                          key={`${day.toISOString()}-${time}`}
                          onClick={() => handleTimeSlotClick(day, time)}
                          className={`
                            min-h-[60px] p-2 rounded border text-left text-xs transition-colors
                            ${appointment 
                              ? `${getStatusColor(appointment.status)} hover:opacity-80` 
                              : isPastDate 
                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-dashed border-gray-300 hover:border-primary hover:bg-primary/5'
                            }
                          `}
                          disabled={isPastDate}
                        >
                          {appointment ? (
                            <div className="space-y-1">
                              <div className="font-medium truncate">
                                {appointment.title || appointment.patient_name}
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <Clock className="w-3 h-3" />
                                {appointment.duration}m
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {appointment.appointment_type}
                              </Badge>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-center">
                              Available
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};