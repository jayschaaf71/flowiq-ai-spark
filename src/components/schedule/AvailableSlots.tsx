import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Filter, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { format, addDays, startOfDay, endOfDay, addMinutes, isBefore, isAfter, parseISO } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

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
  const [viewMode, setViewMode] = useState<'all' | 'today' | 'week' | 'twoweeks'>('week');
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set());

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
        endDate = addDays(today, 7);
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

            // Check if this slot is already booked (mock logic)
            const isBooked = Math.random() > 0.7; // 30% chance of being booked

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

  const toggleDateExpansion = (date: string) => {
    const newExpanded = new Set(expandedDates);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDates(newExpanded);
  };

  const handleBookSlot = (slot: TimeSlot) => {
    toast({
      title: "Booking Slot",
      description: `Booking ${slot.time} with ${slot.provider} on ${format(parseISO(slot.date), 'MMM d, yyyy')}`,
    });
  };

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Available Slots</h3>
          <p className="text-sm text-gray-600">Quick booking overview</p>
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
            Week
          </Button>
        </div>
      </div>

      {/* Compact Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.availableCount}</div>
          <div className="text-xs text-blue-600">Available</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.utilizationRate}%</div>
          <div className="text-xs text-green-600">Utilized</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{Object.keys(slotsByDate).length}</div>
          <div className="text-xs text-purple-600">Days</div>
        </div>
      </div>

      {/* Compact Slots List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {Object.entries(slotsByDate)
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(0, 5) // Limit to first 5 days
          .map(([date, slots]) => {
            const isExpanded = expandedDates.has(date);
            const displaySlots = isExpanded ? slots : slots.slice(0, 3);

            return (
              <Card key={date} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-sm">
                        {format(parseISO(date + 'T00:00:00'), 'EEE, MMM d')}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {slots.length} slots
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleDateExpansion(date)}
                      className="h-6 w-6 p-0"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {displaySlots.map((slot, index) => (
                      <div
                        key={`${slot.date}-${slot.time}-${slot.provider}-${index}`}
                        className="border rounded p-2 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleBookSlot(slot)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{formatTime(slot.time)}</span>
                          <Badge className="bg-green-100 text-green-700 text-xs">Open</Badge>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{slot.duration} min</span>
                          </div>
                          <div className="truncate">{slot.provider}</div>
                          {slot.room && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{slot.room}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isExpanded && slots.length > 3 && (
                    <div className="text-center mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDateExpansion(date)}
                        className="text-xs"
                      >
                        Show {slots.length - 3} more slots
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button
          size="sm"
          className="flex-1"
          onClick={() => {
            toast({
              title: "Add Slots",
              description: "Opening slot creation interface",
            });
            // Could open a modal to add new time slots
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Slots
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="flex-1"
          onClick={() => {
            toast({
              title: "Filter Slots",
              description: "Opening slot filtering options",
            });
            // Could open a modal with filter options (by provider, time, date range, etc.)
          }}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  );
};