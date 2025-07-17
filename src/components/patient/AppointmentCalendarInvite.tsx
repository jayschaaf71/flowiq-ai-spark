import React from 'react';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AppointmentDetails {
  id: string;
  date: string;
  time: string;
  duration: number;
  appointmentType: string;
  providerName: string;
  practiceAddress?: string;
  practiceName?: string;
}

interface AppointmentCalendarInviteProps {
  appointment: AppointmentDetails;
  className?: string;
}

export const AppointmentCalendarInvite: React.FC<AppointmentCalendarInviteProps> = ({
  appointment,
  className
}) => {
  const generateCalendarLinks = () => {
    const { date, time, duration, appointmentType, providerName, practiceAddress } = appointment;
    
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));
    
    const title = encodeURIComponent(`${appointmentType} - ${providerName}`);
    const description = encodeURIComponent(`Appointment with ${providerName}\nType: ${appointmentType}\nDuration: ${duration} minutes`);
    const location = encodeURIComponent(practiceAddress || '');
    
    const formatGoogleDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const startFormatted = formatGoogleDate(startDateTime);
    const endFormatted = formatGoogleDate(endDateTime);
    
    return {
      google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${description}&location=${location}`,
      outlook: `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${description}&location=${location}`,
      office365: `https://outlook.office.com/calendar/0/deeplink/compose?subject=${title}&startdt=${startDateTime.toISOString()}&enddt=${endDateTime.toISOString()}&body=${description}&location=${location}`,
      yahoo: `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startFormatted}&dur=${duration * 60}&desc=${description}&in_loc=${location}`
    };
  };

  const generateICSFile = () => {
    const { date, time, duration, appointmentType, providerName, practiceAddress, practiceName } = appointment;
    
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + (duration * 60 * 1000));
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };
    
    const startFormatted = formatDate(startDateTime);
    const endFormatted = formatDate(endDateTime);
    const nowFormatted = formatDate(new Date());
    
    const uid = `appointment-${appointment.id}@scheduleiq.com`;
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Schedule iQ//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowFormatted}`,
      `DTSTART:${startFormatted}`,
      `DTEND:${endFormatted}`,
      `SUMMARY:${appointmentType} - ${providerName}`,
      `DESCRIPTION:Appointment with ${providerName}\\nType: ${appointmentType}\\nDuration: ${duration} minutes`,
      ...(practiceAddress ? [`LOCATION:${practiceName || 'Medical Practice'}\\n${practiceAddress}`] : []),
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'DESCRIPTION:Appointment Reminder',
      'ACTION:DISPLAY',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    return icsContent;
  };

  const downloadICS = () => {
    const icsContent = generateICSFile();
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${appointment.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const calendarLinks = generateCalendarLinks();

  const appointmentDate = new Date(appointment.date);
  const formattedDate = appointmentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <CardTitle>Add to Calendar</CardTitle>
        </div>
        <CardDescription>
          {formattedDate} at {appointment.time} • {appointment.duration} minutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(calendarLinks.google, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Google Calendar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(calendarLinks.outlook, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Outlook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(calendarLinks.office365, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Office 365
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(calendarLinks.yahoo, '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Yahoo
          </Button>
        </div>
        
        <div className="border-t pt-4">
          <Button
            onClick={downloadICS}
            variant="secondary"
            className="w-full flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Calendar File (.ics)
          </Button>
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Works with Apple Calendar, Google Calendar, Outlook, and most calendar apps
          </p>
        </div>
      </CardContent>
    </Card>
  );
};