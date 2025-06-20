
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Plus } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: any;
}

interface RealTimeCalendarProps {
  onTimeSlotClick: (date: Date, time: string) => void;
  onAppointmentClick: (appointment: any) => void;
}

export const RealTimeCalendar = ({ onTimeSlotClick, onAppointmentClick }: RealTimeCalendarProps) => {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  const loadData = async () => {
    setLoading(true);
    try {
      const startDate = format(currentWeek, 'yyyy-MM-dd');
      const endDate = format(addDays(currentWeek, 6), 'yyyy-MM-dd');

      // Load appointments
      const { data: appointmentsData } = await supabase
        .from('appointments')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')
        .order('time');

      // Load availability slots
      const { data: slotsData } = await supabase
        .from('availability_slots')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date')
        .order('start_time');

      setAppointments(appointmentsData || []);
      setAvailableSlots(slotsData || []);
    } catch (error) {
      console.error("Error loading calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('calendar-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'appointments'
      }, () => {
        loadData();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'availability_slots'
      }, () => {
        loadData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWeek]);

  const getSlotStatus = (date: Date, time: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Check for existing appointment
    const appointment = appointments.find(apt => 
      apt.date === dateStr && apt.time === time
    );
    
    if (appointment) {
      return { type: 'appointment', data: appointment };
    }

    // Check for available slot
    const slot = availableSlots.find(slot => 
      slot.date === dateStr && slot.start_time === time && slot.is_available
    );
    
    if (slot) {
      return { type: 'available', data: slot };
    }

    return { type: 'unavailable', data: null };
  };

  const getStatusColor = (status: any) => {
    switch (status.type) {
      case 'appointment':
        const statusColors = {
          confirmed: 'bg-green-100 border-green-300 text-green-800',
          pending: 'bg-yellow-100 border-yellow-300 text-yellow-800',
          cancelled: 'bg-red-100 border-red-300 text-red-800',
          completed: 'bg-blue-100 border-blue-300 text-blue-800'
        };
        return statusColors[status.data.status as keyof typeof statusColors] || 'bg-gray-100 border-gray-300';
      case 'available':
        return 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Live Schedule - Week of {format(currentWeek, 'MMM d, yyyy')}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
            >
              Previous Week
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(startOfWeek(new Date()))}
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            >
              Next Week
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-1 min-w-[800px]">
              {/* Header row */}
              <div className="p-2 font-medium">Time</div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className="p-2 text-center">
                  <div className="font-medium">{format(day, 'EEE')}</div>
                  <div className="text-sm text-gray-500">{format(day, 'MMM d')}</div>
                  {isSameDay(day, new Date()) && (
                    <Badge variant="secondary" className="text-xs mt-1">Today</Badge>
                  )}
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map(time => (
                <React.Fragment key={time}>
                  <div className="p-2 text-sm font-medium text-gray-600 border-r">
                    {time}
                  </div>
                  {weekDays.map(day => {
                    const status = getSlotStatus(day, time);
                    return (
                      <div
                        key={`${day.toISOString()}-${time}`}
                        className={`p-1 border rounded text-xs min-h-[60px] ${getStatusColor(status)}`}
                        onClick={() => {
                          if (status.type === 'available') {
                            onTimeSlotClick(day, time);
                          } else if (status.type === 'appointment') {
                            onAppointmentClick(status.data);
                          }
                        }}
                      >
                        {status.type === 'appointment' && (
                          <div className="space-y-1">
                            <div className="font-medium truncate">{status.data.title}</div>
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="w-3 h-3" />
                              {status.data.duration}min
                            </div>
                            {status.data.phone && (
                              <div className="flex items-center gap-1 text-xs">
                                <Phone className="w-3 h-3" />
                                {status.data.phone.slice(-4)}
                              </div>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {status.data.status}
                            </Badge>
                          </div>
                        )}
                        {status.type === 'available' && (
                          <div className="flex items-center justify-center h-full">
                            <Plus className="w-4 h-4 text-green-600" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
