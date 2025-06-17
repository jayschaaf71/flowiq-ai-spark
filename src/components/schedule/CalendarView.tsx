
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Clock, User, Phone } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  phone: string;
  time: string;
  duration: number;
  type: string;
  status: "confirmed" | "pending" | "cancelled";
}

export const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("week");

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "John Smith",
      phone: "(555) 123-4567",
      time: "09:00",
      duration: 60,
      type: "Cleaning",
      status: "confirmed"
    },
    {
      id: "2",
      patientName: "Sarah Johnson",
      phone: "(555) 234-5678",
      time: "10:30",
      duration: 30,
      type: "Consultation",
      status: "pending"
    },
    {
      id: "3",
      patientName: "Mike Davis",
      phone: "(555) 345-6789",
      time: "14:00",
      duration: 90,
      type: "Root Canal",
      status: "confirmed"
    }
  ];

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30"
  ];

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).slice(0, 5); // Mon-Fri only
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      isSameDay(new Date(), date) // Mock: showing all appointments for today
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-700 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, -7))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">
              {format(selectedDate, "MMMM yyyy")}
            </h3>
            <Button variant="outline" size="icon" onClick={() => setSelectedDate(addDays(selectedDate, 7))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "week" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("week")}
            >
              Week
            </Button>
            <Button 
              variant={viewMode === "day" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("day")}
            >
              Day
            </Button>
          </div>
        </div>

        <Button onClick={() => setSelectedDate(new Date())}>
          Today
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mini Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Calendar</CardTitle>
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

        {/* Schedule Grid */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {viewMode === "week" ? "Weekly Schedule" : "Daily Schedule"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === "week" ? (
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
                        <div key={time} className="h-12 border-b border-gray-100 relative">
                          {timeAppointment && (
                            <div className={`absolute inset-1 rounded border p-1 ${getStatusColor(timeAppointment.status)}`}>
                              <div className="text-xs font-medium truncate">{timeAppointment.patientName}</div>
                              <div className="text-xs truncate">{timeAppointment.type}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className={`p-4 rounded-lg border ${getStatusColor(appointment.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{appointment.time}</div>
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-gray-600">{appointment.type} • {appointment.duration} min</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {appointment.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
