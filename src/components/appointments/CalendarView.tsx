import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppointments } from '@/hooks/useAppointments';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfWeek, isSameDay, parseISO, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Eye,
  Clock,
  User,
  Filter,
  Settings
} from 'lucide-react';
import { AppointmentModal } from './AppointmentModal';
import { CalendarFilters } from './CalendarFilters';
import { CalendarIntegrations } from './CalendarIntegrations';

interface Appointment {
  id: string;
  date: string;
  time: string;
  title: string;
  appointment_type: string;
  status: string;
  duration: number;
  patient_id?: string;
  patient_name?: string;
  provider_id?: string;
  provider?: string;
  notes?: string;
}

interface CalendarViewProps {
  onCreateAppointment?: (date: Date, time?: string) => void;
  onViewAppointment?: (appointment: Appointment) => void;
}

export const CalendarView = ({ onCreateAppointment, onViewAppointment }: CalendarViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  
  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [defaultDate, setDefaultDate] = useState<Date | undefined>();
  const [defaultTime, setDefaultTime] = useState<string | undefined>();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [providerFilter, setProviderFilter] = useState('all');
  const [appointmentTypeFilter, setAppointmentTypeFilter] = useState('all');
  
  const { toast } = useToast();
  const { appointments, loading } = useAppointments();

  // Filter appointments based on view and date range
  const getFilteredAppointmentsByView = () => {
    let startDate, endDate;

    if (view === 'week') {
      startDate = startOfWeek(currentWeek);
      endDate = addDays(startDate, 6);
    } else if (view === 'month') {
      startDate = startOfMonth(currentMonth);
      endDate = endOfMonth(currentMonth);
    } else { // day view
      startDate = startOfDay(currentWeek);
      endDate = endOfDay(currentWeek);
    }

    return appointments.filter(apt => {
      const appointmentDate = parseISO(apt.date);
      return appointmentDate >= startDate && appointmentDate <= endDate;
    });
  };

  const weekStart = startOfWeek(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 7; // 7 AM to 11 PM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const getAppointmentsForDateTime = (date: Date, time: string) => {
    return appointments.filter(apt => 
      isSameDay(parseISO(apt.date), date) && 
      apt.time.startsWith(time.slice(0, 2)) // Match hour
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'week') {
      setCurrentWeek(prev => addDays(prev, direction === 'next' ? 7 : -7));
    } else if (view === 'month') {
      setCurrentMonth(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
        return newDate;
      });
    } else { // day
      setCurrentWeek(prev => addDays(prev, direction === 'next' ? 1 : -1));
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(today);
    setCurrentMonth(today);
  };

  // Filter appointments based on search and filters
  const viewFilteredAppointments = getFilteredAppointmentsByView();
  const filteredAppointments = viewFilteredAppointments.filter(apt => {
    const matchesSearch = !searchTerm || 
      apt.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.appointment_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesProvider = providerFilter === 'all' || apt.provider === providerFilter;
    const matchesType = appointmentTypeFilter === 'all' || apt.appointment_type === appointmentTypeFilter;
    
    return matchesSearch && matchesStatus && matchesProvider && matchesType;
  });

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter !== 'all') count++;
    if (providerFilter !== 'all') count++;
    if (appointmentTypeFilter !== 'all') count++;
    return count;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setProviderFilter('all');
    setAppointmentTypeFilter('all');
  };

  const handleCreateAppointment = (date: Date, time?: string) => {
    setDefaultDate(date);
    setDefaultTime(time);
    setSelectedAppointment(undefined);
    setShowAppointmentModal(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDefaultDate(undefined);
    setDefaultTime(undefined);
    setShowAppointmentModal(true);
  };

  const getDateRange = () => {
    if (view === 'week') {
      const weekStart = startOfWeek(currentWeek);
      return `Week of ${format(weekStart, 'MMMM d, yyyy')}`;
    } else if (view === 'month') {
      return format(currentMonth, 'MMMM yyyy');
    } else {
      return format(currentWeek, 'MMMM d, yyyy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <CalendarFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        providerFilter={providerFilter}
        onProviderFilterChange={setProviderFilter}
        appointmentTypeFilter={appointmentTypeFilter}
        onAppointmentTypeFilterChange={setAppointmentTypeFilter}
        onClearFilters={clearFilters}
        activeFiltersCount={getActiveFiltersCount()}
      />

      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigate('prev')}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigate('next')}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  {getDateRange()}
                </CardTitle>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <Tabs value={view} onValueChange={(value) => setView(value as any)} className="mr-4">
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button onClick={() => handleCreateAppointment(new Date())}>
                <Plus className="w-4 h-4 mr-2" />
                New Appointment
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Calendar Content */}
      <Tabs value="calendar" className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-0">
              {view === 'week' && (
                <>
                  <div className="grid grid-cols-8 border-b">
                    {/* Time column header */}
                    <div className="p-3 border-r bg-muted/50 font-medium">
                      Time
                    </div>
                    {/* Day headers */}
                    {weekDays.map((day) => (
                      <div key={day.toISOString()} className="p-3 border-r text-center">
                        <div className="font-medium">{format(day, 'EEE')}</div>
                        <div className={`text-sm ${isSameDay(day, new Date()) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {format(day, 'MMM d')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time slots and appointments */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time) => (
                      <div key={time} className="grid grid-cols-8 border-b min-h-16">
                        {/* Time label */}
                        <div className="p-2 border-r bg-muted/30 text-sm font-medium flex items-center">
                          {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                        </div>
                        
                        {/* Day columns */}
                        {weekDays.map((day) => {
                          const dayAppointments = filteredAppointments.filter(apt => 
                            isSameDay(parseISO(apt.date), day) && 
                            apt.time.startsWith(time.slice(0, 2))
                          );
                          
                          return (
                            <div 
                              key={`${day.toISOString()}-${time}`} 
                              className="border-r p-1 min-h-16 hover:bg-muted/30 cursor-pointer relative"
                              onClick={() => handleCreateAppointment(day, time)}
                            >
                              {dayAppointments.length > 0 ? (
                                <div className="space-y-1">
                                  {dayAppointments.map((appointment) => (
                                    <div
                                      key={appointment.id}
                                      className={`p-2 rounded text-xs border cursor-pointer hover:shadow-sm ${getStatusColor(appointment.status)}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewAppointment(appointment);
                                      }}
                                    >
                                      <div className="font-medium truncate">{appointment.title}</div>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{appointment.time}</span>
                                      </div>
                                      {appointment.patient_name && (
                                        <div className="flex items-center gap-1">
                                          <User className="h-3 w-3" />
                                          <span className="truncate">{appointment.patient_name}</span>
                                        </div>
                                      )}
                                      <Badge variant="secondary" className="text-xs mt-1">
                                        {appointment.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center opacity-0 hover:opacity-50 transition-opacity">
                                  <Plus className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Day View */}
              {view === 'day' && (
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-4">
                    {format(currentWeek, 'EEEE, MMMM d, yyyy')}
                  </h3>
                  <div className="space-y-2">
                    {filteredAppointments
                      .filter(apt => isSameDay(parseISO(apt.date), currentWeek))
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className={`p-4 rounded border cursor-pointer hover:shadow-sm ${getStatusColor(appointment.status)}`}
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{appointment.title}</h4>
                              <p className="text-sm text-muted-foreground">{appointment.patient_name}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{appointment.time}</p>
                              <Badge variant="secondary">{appointment.status}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Month View */}
              {view === 'month' && (
                <div className="p-4">
                  <div className="grid grid-cols-7 gap-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="p-2 text-center font-medium border-b">
                        {day}
                      </div>
                    ))}
                    {/* Calendar days would go here - simplified for now */}
                    <div className="col-span-7 p-8 text-center text-muted-foreground">
                      Month view coming soon - showing week view for now
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <CalendarIntegrations />
        </TabsContent>
      </Tabs>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        appointment={selectedAppointment}
        defaultDate={defaultDate}
        defaultTime={defaultTime}
      />
    </div>
  );
};