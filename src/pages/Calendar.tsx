import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { CalendarView } from '@/components/appointments/CalendarView';

export const Calendar = () => {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Calendar"
        subtitle="Complete appointment scheduling and patient management"
      />
      
      <CalendarView />
    </div>
  );
};