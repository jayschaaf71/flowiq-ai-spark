
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentBooking } from '@/components/appointments/AppointmentBooking';
import { EnhancedAppointmentBooking } from '@/components/appointments/EnhancedAppointmentBooking';
import { WaitlistManager } from '@/components/appointments/WaitlistManager';
import { CalendarView } from '@/components/appointments/CalendarView';
import { AppointmentList } from '@/components/appointments/AppointmentList';
import { AppointmentCalendar } from '@/components/schedule/AppointmentCalendar';
import { EnhancedSchedulingInterface } from '@/components/schedule/EnhancedSchedulingInterface';
import { IntelligentCalendarView } from '@/components/schedule/IntelligentCalendarView';
import { AppointmentQuickActions } from '@/components/schedule/AppointmentQuickActions';

import { useAppointments } from '@/hooks/useAppointments';

type ViewMode = 'enhanced' | 'calendar' | 'list' | 'booking' | 'waitlist' | 'actions';

const Schedule = () => {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('enhanced');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const { appointments, refetch } = useAppointments();

  // Check for booking mode from query parameter
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'booking') {
      setViewMode('booking');
    }
  }, [searchParams]);

  const handleCreateAppointment = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setViewMode('booking');
  };

  const handleBookingSuccess = () => {
    setViewMode('calendar');
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    refetch();
  };

  const handleBookingCancel = () => {
    setViewMode('calendar');
    setSelectedDate(undefined);
    setSelectedTime(undefined);
  };

  if (viewMode === 'booking') {
    return (
      <div className="container mx-auto py-6">
        <EnhancedAppointmentBooking
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Appointment Management</h1>
        <p className="text-muted-foreground">
          Advanced scheduling with real-time availability, automated reminders, and intelligent waitlist management
        </p>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="enhanced">AI Scheduling</TabsTrigger>
          <TabsTrigger value="calendar">Smart Calendar</TabsTrigger>
          <TabsTrigger value="booking">Enhanced Booking</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist Manager</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="actions">Quick Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="enhanced" className="mt-6">
          <EnhancedSchedulingInterface />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <IntelligentCalendarView onCreateAppointment={handleCreateAppointment} />
        </TabsContent>

        <TabsContent value="booking" className="mt-6">
          <EnhancedAppointmentBooking 
            onSuccess={() => {
              handleBookingSuccess();
              refetch(); // Refresh appointments after booking
            }}
          />
        </TabsContent>

        <TabsContent value="waitlist" className="mt-6">
          <WaitlistManager />
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
      </Tabs>
    </div>
  );
};

export default Schedule;
