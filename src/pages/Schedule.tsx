
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking';
import { CalendarView } from '@/components/appointments/CalendarView';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentCalendar } from '@/components/schedule/AppointmentCalendar';
import { EnhancedSchedulingInterface } from '@/components/schedule/EnhancedSchedulingInterface';
import { IntelligentCalendarView } from '@/components/schedule/IntelligentCalendarView';
import { AppointmentQuickActions } from '@/components/schedule/AppointmentQuickActions';

import { useAppointments } from '@/hooks/useAppointments';

type ViewMode = 'enhanced' | 'calendar' | 'list' | 'booking' | 'actions';

const Schedule = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('enhanced');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const { appointments, refetch } = useAppointments();

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
          <TabsTrigger value="calendar">Intelligent Calendar</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced" className="mt-6">
          <EnhancedSchedulingInterface />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <IntelligentCalendarView onCreateAppointment={handleCreateAppointment} />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AppointmentList />
        </TabsContent>

        <TabsContent value="actions" className="mt-6">
          <AppointmentQuickActions 
            appointments={appointments}
            onAppointmentsUpdate={refetch}
          />
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <AppointmentBooking 
            onSuccess={() => {
              handleBookingSuccess();
              refetch(); // Refresh appointments after booking
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
