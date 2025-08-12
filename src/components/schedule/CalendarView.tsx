
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

interface Appointment {
  id: string;
  date: Date;
  time: string;
  customer: string;
  service: string;
  provider: string;
  room?: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export const CalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      date: new Date(2024, 0, 15),
      time: '09:00',
      customer: 'Sarah Johnson',
      service: 'HVAC Maintenance',
      provider: 'Dr. Smith',
      room: 'Room 3',
      status: 'confirmed'
    },
    {
      id: '2',
      date: new Date(2024, 0, 15),
      time: '14:30',
      customer: 'Mike Wilson',
      service: 'Plumbing Repair',
      provider: 'Dr. Jones',
      room: 'Room 1',
      status: 'pending'
    },
    {
      id: '3',
      date: new Date(2024, 0, 16),
      time: '10:00',
      customer: 'Emma Davis',
      service: 'Electrical Installation',
      provider: 'Dr. Wilson',
      room: 'Room 4',
      status: 'confirmed'
    }
  ];

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Fill in days from previous/next month to complete the grid
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dayAppointments = getAppointmentsForDate(date);
    if (dayAppointments.length > 0) {
      toast({
        title: `${format(date, 'EEEE, MMMM d')} Appointments`,
        description: `${dayAppointments.length} appointment(s) scheduled for this day.`,
      });
    } else {
      toast({
        title: format(date, 'EEEE, MMMM d'),
        description: "No appointments scheduled for this day.",
      });
    }
  };

  const handleBookAppointment = (date: Date) => {
    toast({
      title: "Book Appointment",
      description: `Opening booking interface for ${format(date, 'MMMM d, yyyy')}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-2xl font-bold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCurrentDate(new Date());
              setSelectedDate(new Date());
              toast({
                title: "Today's View",
                description: "Switched to today's date",
              });
            }}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              toast({
                title: "Calendar View Options",
                description: "Opening calendar view settings",
              });
              // Could open a modal with view options (month, week, day, etc.)
            }}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {allDays.map((day, index) => {
              const dayAppointments = getAppointmentsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={index}
                  className={`
                                        aspect-square border border-gray-200 rounded-lg p-2 cursor-pointer transition-all
                                        ${isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                                        ${isTodayDate ? 'ring-2 ring-blue-500' : ''}
                                        ${isSelected ? 'ring-2 ring-green-500 bg-green-50' : ''}
                                        hover:bg-blue-50 hover:border-blue-300
                                    `}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`
                                            text-sm font-medium
                                            ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                                            ${isTodayDate ? 'text-blue-600 font-bold' : ''}
                                        `}>
                      {format(day, 'd')}
                    </span>
                    {dayAppointments.length > 0 && (
                      <Badge className="text-xs px-1 py-0.5">
                        {dayAppointments.length}
                      </Badge>
                    )}
                  </div>

                  {/* Appointment Indicators */}
                  <div className="space-y-1">
                    {dayAppointments.slice(0, 2).map((apt, aptIndex) => (
                      <div
                        key={apt.id}
                        className={`
                                                    text-xs p-1 rounded truncate cursor-pointer
                                                    ${getStatusColor(apt.status)}
                                                    hover:opacity-80
                                                `}
                        onClick={(e) => {
                          e.stopPropagation();
                          toast({
                            title: apt.customer,
                            description: `${apt.service} at ${apt.time} with ${apt.provider}`,
                          });
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-2 h-2" />
                          <span className="truncate">{apt.time}</span>
                        </div>
                        <div className="truncate font-medium">{apt.customer}</div>
                      </div>
                    ))}
                    {dayAppointments.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayAppointments.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Quick Book Button */}
                  {isCurrentMonth && dayAppointments.length === 0 && (
                    <Button
                      size="sm"
                      className="w-full mt-2 text-xs h-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookAppointment(day);
                      }}
                    >
                      Book
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No appointments scheduled</p>
                <p className="text-sm">Click "Book" to schedule an appointment</p>
                <Button className="mt-4" onClick={() => handleBookAppointment(selectedDate)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {getAppointmentsForDate(selectedDate).map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{apt.customer}</div>
                        <div className="text-sm text-gray-600">{apt.service}</div>
                        <div className="text-xs text-gray-500">
                          {apt.time} • {apt.provider}
                          {apt.room && ` • ${apt.room}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(apt.status)}>
                        {apt.status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <User className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
