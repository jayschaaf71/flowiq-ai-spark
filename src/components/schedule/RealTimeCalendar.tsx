
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, Phone, Plus } from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, isToday } from "date-fns";
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
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

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

      // Load availability slots - using mock data until table is created
      const mockSlots = [
        {
          id: '1',
          provider_id: 'provider-1',
          date: '2024-01-15',
          start_time: '09:00',
          end_time: '10:00',
          is_available: true
        },
        {
          id: '2',
          provider_id: 'provider-1',
          date: '2024-01-15',
          start_time: '10:00',
          end_time: '11:00',
          is_available: false
        }
      ];

      setAppointments(appointmentsData || []);
      setAvailableSlots(mockSlots);
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
      case 'appointment': {
        const statusColors = {
          confirmed: 'bg-green-100 border-green-300 text-green-800 hover:bg-green-200',
          pending: 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200',
          cancelled: 'bg-red-100 border-red-300 text-red-800 hover:bg-red-200',
          completed: 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200'
        };
        return statusColors[status.data.status as keyof typeof statusColors] || 'bg-gray-100 border-gray-300 hover:bg-gray-200';
      }
      case 'available':
        return 'bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer border-2 border-dashed';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100 cursor-pointer';
    }
  };

  const getSlotId = (date: Date, time: string) => {
    return `${format(date, 'yyyy-MM-dd')}-${time}`;
  };

  const handleSlotClick = (date: Date, time: string, status: any) => {
    if (status.type === 'appointment') {
      onAppointmentClick(status.data);
    } else {
      // Allow booking on any empty slot (available or unavailable)
      onTimeSlotClick(date, time);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Live Schedule - Week of {format(currentWeek, 'MMM d, yyyy')}
            <Badge className="bg-green-100 text-green-700 ml-2">
              Real-time Updates
            </Badge>
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
        
        {/* Legend */}
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-50 border-2 border-green-200 border-dashed rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded"></div>
            <span>Click to Book</span>
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
              <div className="p-2 font-medium text-center bg-gray-50 rounded">Time</div>
              {weekDays.map(day => (
                <div key={day.toISOString()} className={`p-2 text-center rounded ${
                  isToday(day) ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}>
                  <div className="font-medium">{format(day, 'EEE')}</div>
                  <div className="text-sm text-gray-500">{format(day, 'MMM d')}</div>
                  {isToday(day) && (
                    <Badge variant="default" className="text-xs mt-1 bg-blue-600">Today</Badge>
                  )}
                </div>
              ))}

              {/* Time slots */}
              {timeSlots.map(time => (
                 <React.Fragment key={time}>
                   <div className="p-2 text-sm font-medium text-gray-600 border-r bg-gray-50 rounded">
                     {time}
                   </div>
                  {weekDays.map(day => {
                    const status = getSlotStatus(day, time);
                    const slotId = getSlotId(day, time);
                    const isHovered = hoveredSlot === slotId;
                    
                    return (
                      <div
                        key={slotId}
                        className={`p-1 border rounded text-xs min-h-[70px] transition-all duration-200 ${getStatusColor(status)} ${
                          isHovered ? 'scale-105 shadow-md' : ''
                        }`}
                        onMouseEnter={() => setHoveredSlot(slotId)}
                        onMouseLeave={() => setHoveredSlot(null)}
                        onClick={() => handleSlotClick(day, time, status)}
                      >
                        {status.type === 'appointment' && (
                          <div className="space-y-1">
                            <div className="font-medium truncate">{status.data.title}</div>
                            <div className="flex items-center gap-1 text-xs opacity-75">
                              <Clock className="w-3 h-3" />
                              {status.data.duration}min
                            </div>
                            {status.data.phone && (
                              <div className="flex items-center gap-1 text-xs opacity-75">
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
                          <div className="flex flex-col items-center justify-center h-full">
                            <Plus className={`w-6 h-6 text-green-600 transition-all duration-200 ${
                              isHovered ? 'scale-125' : ''
                            }`} />
                            {isHovered && (
                              <span className="text-xs text-green-700 font-medium mt-1">
                                Book Appointment
                              </span>
                            )}
                          </div>
                        )}
                        {status.type === 'unavailable' && (
                          <div className="flex flex-col items-center justify-center h-full">
                            <Plus className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                              isHovered ? 'scale-110 text-blue-500' : ''
                            }`} />
                            {isHovered && (
                              <span className="text-xs text-blue-600 font-medium mt-1">
                                Book Here
                              </span>
                            )}
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
