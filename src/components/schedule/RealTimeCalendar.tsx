
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { Calendar, Clock, Users, Plus, RefreshCw } from "lucide-react";

interface CalendarAppointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  patient_id: string;
  provider_id?: string;
}

interface RealTimeCalendarProps {
  onAppointmentClick?: (appointment: CalendarAppointment) => void;
  onTimeSlotClick?: (date: Date, time: string) => void;
}

export const RealTimeCalendar = ({ onAppointmentClick, onTimeSlotClick }: RealTimeCalendarProps) => {
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  useEffect(() => {
    loadAppointments();
    setupRealtimeSubscription();
  }, [currentWeek]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const startDate = format(weekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(weekStart, 6), 'yyyy-MM-dd');

      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')
        .order('time');

      if (error) throw error;

      setAppointments(data || []);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments'
        },
        (payload) => {
          console.log('Real-time appointment update:', payload);
          loadAppointments(); // Reload appointments on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getAppointmentsForSlot = (date: Date, time: string) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date) && apt.time === time
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'no-show': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isTimeSlotAvailable = (date: Date, time: string) => {
    const slotAppointments = getAppointmentsForSlot(date, time);
    return slotAppointments.length === 0;
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    if (isTimeSlotAvailable(date, time) && onTimeSlotClick) {
      onTimeSlotClick(date, time);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Real-Time Schedule
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Last updated: {format(lastUpdate, 'HH:mm:ss')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={loadAppointments}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(prev => addDays(prev, -7))}
                >
                  ← Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentWeek(prev => addDays(prev, 7))}
                >
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* Header Row */}
            <div className="p-2 font-medium text-center">Time</div>
            {weekDays.map((day, index) => (
              <div key={index} className="p-2 font-medium text-center">
                <div>{format(day, 'EEE')}</div>
                <div className="text-sm text-gray-500">{format(day, 'MMM d')}</div>
              </div>
            ))}

            {/* Time Slots */}
            {timeSlots.map((time) => (
              <div key={time} className="contents">
                <div className="p-2 text-sm font-medium text-gray-600 flex items-center">
                  {time}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const slotAppointments = getAppointmentsForSlot(day, time);
                  const isAvailable = slotAppointments.length === 0;
                  
                  return (
                    <div
                      key={`${time}-${dayIndex}`}
                      className={`
                        min-h-[60px] border rounded p-1 cursor-pointer transition-colors
                        ${isAvailable 
                          ? 'bg-gray-50 hover:bg-blue-50 border-dashed' 
                          : 'bg-white hover:bg-gray-50'
                        }
                      `}
                      onClick={() => handleTimeSlotClick(day, time)}
                    >
                      {slotAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="mb-1 p-1 rounded text-xs cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick?.(appointment);
                          }}
                        >
                          <Badge className={`${getStatusColor(appointment.status)} text-xs w-full justify-start`}>
                            <div className="truncate">
                              <div className="font-medium">{appointment.title}</div>
                              <div className="text-xs opacity-75">
                                {appointment.duration}min
                              </div>
                            </div>
                          </Badge>
                        </div>
                      ))}
                      {isAvailable && (
                        <div className="flex items-center justify-center h-full opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-gray-400" />
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

      {/* Real-time Status */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-800 font-medium">Live Updates Active</span>
            <span className="text-green-600 text-sm">
              Calendar automatically refreshes when appointments change
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
