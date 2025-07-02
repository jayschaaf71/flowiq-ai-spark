
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking';
import { CalendarView } from '@/components/appointments/CalendarView';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { EnhancedSchedulingInterface } from '@/components/schedule/EnhancedSchedulingInterface';
import { IntelligentConflictResolution } from '@/components/schedule/IntelligentConflictResolution';

type ViewMode = 'enhanced' | 'calendar' | 'list' | 'booking' | 'conflicts';

const Schedule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('enhanced');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  const handleCreateAppointment = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setViewMode('booking');
  };

  const handleBookingSuccess = () => {
    setViewMode('calendar');
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  const handleBookingCancel = () => {
    setViewMode('calendar');
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  if (viewMode === 'booking') {
    return (
      <div className="container mx-auto py-6">
        <AppointmentBooking
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSuccess={handleBookingSuccess}
          onCancel={handleBookingCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="enhanced">AI Scheduling</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="conflicts">Conflict Resolution</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced" className="mt-6">
          <EnhancedSchedulingInterface />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView onCreateAppointment={handleCreateAppointment} />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AppointmentList />
        </TabsContent>

        <TabsContent value="conflicts" className="mt-6">
          <IntelligentConflictResolution />
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <AppointmentBooking onSuccess={handleBookingSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
