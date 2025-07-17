import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Filter, MapPin } from 'lucide-react';
import { format, addDays, startOfDay, endOfDay, addMinutes, isBefore, isAfter, parseISO } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';

interface TimeSlot {
  date: string;
  time: string;
  duration: number;
  provider: string;
  room?: string;
  isAvailable: boolean;
}

export const AvailableSlots = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'week' | 'twoweeks'>('twoweeks');
  
  const { appointments, loading } = useAppointments();

  // Generate time slots for business hours (8 AM - 6 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    const providers = ['Dr. Smith', 'Dr. Jones', 'Dr. Wilson'];
    const today = new Date();
    
    let endDate;
    switch (viewMode) {
      case 'today':
        endDate = addDays(today, 1);
        break;
      case 'week':
        endDate = addDays(today, 7);
        break;
      case 'twoweeks':
        endDate = addDays(today, 14);
        break;
      default:
        endDate = addDays(today, 14);
    }

    // Generate slots for each day in the range
    for (let day = new Date(today); day < endDate; day.setDate(day.getDate() + 1)) {
      // Skip weekends for this example
      if (day.getDay() === 0 || day.getDay() === 6) continue;
      
      const dayStr = format(day, 'yyyy-MM-dd');
      
      // Generate time slots for each provider
      providers.forEach(provider => {
        for (let hour = 8; hour < 18; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            
            // Check if this slot is already booked
            const isBooked = appointments?.some(apt => 
              apt.date === dayStr && 
              apt.time === timeStr && 
              apt.provider === provider
            ) || false;
            
            slots.push({
              date: dayStr,
              time: timeStr,
              duration: 30,
              provider,
              room: `Room ${Math.floor(Math.random() * 5) + 1}`,
              isAvailable: !isBooked
            });
          }
        }
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();
  const availableSlots = timeSlots.filter(slot => slot.isAvailable);

  // Group slots by date
  const slotsByDate = availableSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return format(date, 'h:mm a');
  };

  const getDateStats = () => {
    const totalSlots = timeSlots.length;
    const availableCount = availableSlots.length;
    const utilizationRate = ((totalSlots - availableCount) / totalSlots * 100).toFixed(1);
    
    return {
      totalSlots,
      availableCount,
      utilizationRate: parseFloat(utilizationRate)
    };
  };

  const stats = getDateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Available Appointment Slots</h2>
          <p className="text-muted-foreground">Open slots for the next two weeks</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'today' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('today')}
          >
            Today
          </Button>
          <Button 
            variant={viewMode === 'week' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('week')}
          >
            This Week
          </Button>
          <Button 
            variant={viewMode === 'twoweeks' ? 'default' : 'outline'} 
            size="sm" 
            onClick={() => setViewMode('twoweeks')}
          >
            Next 2 Weeks
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.availableCount}</p>
                <p className="text-sm text-gray-600">Available Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.utilizationRate}%</p>
                <p className="text-sm text-gray-600">Schedule Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-600">{Object.keys(slotsByDate).length}</p>
                <p className="text-sm text-gray-600">Days with Openings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Plus className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">3</p>
                <p className="text-sm text-gray-600">Providers Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Slots Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Open Appointment Slots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : Object.keys(slotsByDate).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No available slots found for the selected period
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(slotsByDate)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([date, slots]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-3 border-b pb-2">
                    <h3 className="text-lg font-semibold">
                      {format(parseISO(date + 'T00:00:00'), 'EEEE, MMMM d, yyyy')}
                    </h3>
                    <Badge variant="secondary">{slots.length} available</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {slots
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((slot, index) => (
                      <div 
                        key={`${slot.date}-${slot.time}-${slot.provider}-${index}`}
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300"
                        onClick={() => {
                          console.log('Selected slot:', slot);
                          // Here you would implement the booking logic
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-lg">{formatTime(slot.time)}</span>
                          <Badge className="bg-green-100 text-green-700">Open</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{slot.duration} min</span>
                          </div>
                          <div>{slot.provider}</div>
                          {slot.room && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{slot.room}</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('Book appointment for:', slot);
                            // Implement booking logic here
                          }}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Book Slot
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};