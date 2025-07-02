
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking';
import { CalendarView } from '@/components/appointments/CalendarView';
import { AppointmentList } from '@/components/appointments/AppointmentList';

type ViewMode = 'calendar' | 'list' | 'booking';

const Schedule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <CalendarView onCreateAppointment={handleCreateAppointment} />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AppointmentList />
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <AppointmentBooking onSuccess={handleBookingSuccess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
