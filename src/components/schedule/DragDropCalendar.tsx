
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Clock, User, Phone, Calendar as CalendarIcon, Repeat } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { useAppointments } from "@/hooks/useAppointments";
import { useProviders } from "@/hooks/useProviders";
import { useToast } from "@/hooks/use-toast";

interface DragDropCalendarProps {
  onAppointmentDrop?: (appointmentId: string, newDate: Date, newTime: string) => void;
}

export const DragDropCalendar = ({ onAppointmentDrop }: DragDropCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedAppointment, setDraggedAppointment] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { appointments, loading } = useAppointments();
  const { providers } = useProviders();

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
  ];

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).slice(0, 5);
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(apt.date), date)
    );
  };

  const getStatusColor = (status: string, isRecurring: boolean = false) => {
    const baseColors = {
      "confirmed": "bg-green-100 text-green-700 border-green-200",
      "pending": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "cancelled": "bg-red-100 text-red-700 border-red-200",
      "completed": "bg-blue-100 text-blue-700 border-blue-200",
      "no-show": "bg-gray-100 text-gray-700 border-gray-200",
    };
    
    const color = baseColors[status as keyof typeof baseColors] || "bg-gray-100 text-gray-700 border-gray-200";
    
    // Add pattern for recurring appointments
    if (isRecurring) {
      return `${color} bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200`;
    }
    
    return color;
  };

  const handleDragStart = (e: React.DragEvent, appointmentId: string) => {
    setDraggedAppointment(appointmentId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, date: Date, time: string) => {
    e.preventDefault();
    if (draggedAppointment && onAppointmentDrop) {
      onAppointmentDrop(draggedAppointment, date, time);
      toast({
        title: "Appointment Moved",
        description: `Appointment rescheduled to ${format(date, "MMM d, yyyy")} at ${time}`,
      });
    }
    setDraggedAppointment(null);
  };

  const navigateWeek = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else {
      setSelectedDate(addWeeks(selectedDate, 1));
    }
  };

  const getProviderName = (providerId: string) => {
    const provider = providers.find(p => p.id === providerId);
    return provider ? `${provider.first_name} ${provider.last_name}` : "Unknown Provider";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold min-w-[200px] text-center">
              {format(selectedDate, "MMMM yyyy")}
            </h3>
            <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={() => setSelectedDate(new Date())}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-200"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200"></div>
              <Repeat className="h-3 w-3" />
              <span>Recurring</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mini Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border-0"
            />
          </CardContent>
        </Card>

        {/* Drag & Drop Schedule Grid */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Weekly Schedule (Drag & Drop Enabled)
              <Badge variant="outline" className="ml-auto">
                {appointments.length} appointments
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-4">
              {/* Time column */}
              <div className="space-y-2">
                <div className="h-8 border-b font-medium text-sm text-gray-500">Time</div>
                {timeSlots.map((time) => (
                  <div key={time} className="h-12 text-xs text-gray-500 border-b border-gray-100">
                    {time}
                  </div>
                ))}
              </div>
              
              {/* Day columns */}
              {getWeekDays().map((day) => (
                <div key={day.toISOString()} className="space-y-2">
                  <div className="h-8 border-b font-medium text-sm text-center">
                    <div>{format(day, "EEE")}</div>
                    <div className="text-xs text-gray-500">{format(day, "MMM d")}</div>
                  </div>
                  {timeSlots.map((time) => {
                    const dayAppointments = getAppointmentsForDate(day);
                    const timeAppointment = dayAppointments.find(apt => apt.time === time);
                    
                    return (
                      <div 
                        key={time} 
                        className="h-12 border-b border-gray-100 relative"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day, time)}
                      >
                        {timeAppointment && (
                          <div 
                            className={`absolute inset-1 rounded border p-1 cursor-move transition-all hover:shadow-md ${getStatusColor(timeAppointment.status, false)} ${
                              draggedAppointment === timeAppointment.id ? 'opacity-50 scale-105' : ''
                            }`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, timeAppointment.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-medium truncate flex items-center gap-1">
                                  {timeAppointment.title}
                                  <Repeat className="h-3 w-3 text-purple-600" />
                                </div>
                                <div className="text-xs truncate">{timeAppointment.appointment_type}</div>
                              </div>
                            </div>
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
      </div>
    </div>
  );
};
