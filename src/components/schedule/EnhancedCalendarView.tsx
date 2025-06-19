import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight, Clock, User, Phone, Search, Filter, Calendar as CalendarIcon, Repeat } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addWeeks, subWeeks } from "date-fns";
import { useAppointments } from "@/hooks/useAppointments";
import { useProviders } from "@/hooks/useProviders";
import { useRecurringAppointments } from "@/hooks/useRecurringAppointments";
import { DragDropCalendar } from "./DragDropCalendar";

export const EnhancedCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day" | "dragdrop">("week");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  
  const { appointments, loading, updateAppointmentStatus } = useAppointments();
  const { providers } = useProviders();
  const { recurringAppointments } = useRecurringAppointments();

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

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           apt.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
      const matchesProvider = providerFilter === "all" || apt.provider_id === providerFilter;
      
      return matchesSearch && matchesStatus && matchesProvider;
    });
  }, [appointments, searchTerm, statusFilter, providerFilter]);

  const getAppointmentsForDate = (date: Date) => {
    return filteredAppointments.filter(apt => 
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
    
    if (isRecurring) {
      return `${color} bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200`;
    }
    
    return color;
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

  const handleAppointmentDrop = async (appointmentId: string, newDate: Date, newTime: string) => {
    // Here you would implement the logic to update the appointment
    // For now, we'll just update the status to show it was moved
    await updateAppointmentStatus(appointmentId, 'confirmed');
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

  if (viewMode === "dragdrop") {
    return <DragDropCalendar onAppointmentDrop={handleAppointmentDrop} />;
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
            <Button 
              variant={viewMode === "dragdrop" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("dragdrop")}
            >
              Drag & Drop
            </Button>
          </div>
        </div>

        <Button onClick={() => setSelectedDate(new Date())}>
          <CalendarIcon className="h-4 w-4 mr-2" />
          Today
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="no-show">No Show</SelectItem>
              </SelectContent>
            </Select>
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.first_name} {provider.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            
            {/* Recurring Appointments Summary */}
            <div className="mt-4 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Active Patterns
              </h4>
              <div className="space-y-2">
                {recurringAppointments.slice(0, 3).map((pattern) => (
                  <div key={pattern.id} className="text-xs p-2 bg-purple-50 rounded border border-purple-200">
                    <div className="font-medium text-purple-700">{pattern.patient_name}</div>
                    <div className="text-purple-600">{pattern.frequency} • {pattern.appointment_type}</div>
                  </div>
                ))}
                {recurringAppointments.length > 3 && (
                  <div className="text-xs text-gray-500">
                    +{recurringAppointments.length - 3} more patterns
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Grid */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {viewMode === "week" ? "Weekly Schedule" : "Daily Schedule"}
              <Badge variant="outline" className="ml-auto">
                {filteredAppointments.length} appointments
              </Badge>
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
                            <div className={`absolute inset-1 rounded border p-1 ${getStatusColor(timeAppointment.status)} cursor-pointer hover:shadow-sm`}>
                              <div className="text-xs font-medium truncate">{timeAppointment.title}</div>
                              <div className="text-xs truncate">{timeAppointment.appointment_type}</div>
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
                {getAppointmentsForDate(selectedDate).map((appointment) => (
                  <div key={appointment.id} className={`p-4 rounded-lg border ${getStatusColor(appointment.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium">{appointment.time}</div>
                        <div>
                          <div className="font-medium">{appointment.title}</div>
                          <div className="text-sm text-gray-600">{appointment.appointment_type} • {appointment.duration} min</div>
                          {appointment.provider_id && (
                            <div className="text-xs text-blue-600 mt-1">
                              <User className="inline h-3 w-3 mr-1" />
                              {getProviderName(appointment.provider_id)}
                            </div>
                          )}
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
                {getAppointmentsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments for {format(selectedDate, "MMMM d, yyyy")}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
