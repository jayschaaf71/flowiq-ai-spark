import React, { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, addDays, startOfDay, endOfDay, 
         startOfMonth, endOfMonth, parseISO, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAppointments } from '@/hooks/useAppointments';
import { CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { CalendarFilters } from './CalendarFilters';
import { CalendarIntegrations } from './CalendarIntegrations';
import { AppointmentModal } from './AppointmentModal';

type Appointment = Tables<"appointments">;

interface CalendarViewProps {
  onCreateAppointment?: (date?: Date, time?: string) => void;
  onViewAppointment?: (appointment: Appointment) => void;
}

export const CalendarView = ({ onCreateAppointment, onViewAppointment }: CalendarViewProps) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [activeTab, setActiveTab] = useState('calendar');
  
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
      endDate = endOfWeek(currentWeek);
    } else if (view === 'month') {
      startDate = startOfMonth(currentMonth);
      endDate = endOfMonth(currentMonth);
    } else { // day view
      startDate = startOfDay(currentWeek);
      endDate = endOfDay(currentWeek);
    }

    console.log('Calendar view filtering:', {
      view,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      totalAppointments: appointments?.length,
      currentWeek: format(currentWeek, 'yyyy-MM-dd'),
      currentMonth: format(currentMonth, 'yyyy-MM-dd')
    });

    if (!appointments) return [];

    const filtered = appointments.filter(apt => {
      const appointmentDate = parseISO(apt.date + 'T00:00:00');
      const isInRange = appointmentDate >= startDate && appointmentDate <= endDate;
      
      if (!isInRange) {
        console.log('Appointment outside range:', {
          appointment: apt.patient_name,
          date: apt.date,
          appointmentDate: format(appointmentDate, 'yyyy-MM-dd'),
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        });
      }
      
      return isInRange;
    });

    console.log('Filtered appointments for view:', filtered.length, filtered.map(a => ({ name: a.patient_name, date: a.date })));
    
    return filtered;
  };

  // Generate time slots for day/week view
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate week days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    return addDays(startOfWeek(currentWeek), i);
  });

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

  // Navigation functions
  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'day') {
      const newDate = direction === 'next' 
        ? addDays(currentWeek, 1)
        : addDays(currentWeek, -1);
      setCurrentWeek(newDate);
    } else if (view === 'week') {
      const change = direction === 'next' ? addWeeks : subWeeks;
      setCurrentWeek(change(currentWeek, 1));
    } else if (view === 'month') {
      const change = direction === 'next' ? addMonths : subMonths;
      setCurrentMonth(change(currentMonth, 1));
    }
  };

  const goToToday = () => {
    const today = new Date();
    console.log('Today button clicked! Current view:', view);
    console.log('Setting currentWeek to:', format(today, 'yyyy-MM-dd'));
    console.log('Setting currentMonth to:', format(today, 'yyyy-MM-dd'));
    setCurrentWeek(today);
    setCurrentMonth(today);
    // Force immediate re-render and state sync
    const forceUpdate = Math.random();
    setSearchTerm(prev => prev + forceUpdate.toString().slice(-1));
    setTimeout(() => setSearchTerm(prev => prev.slice(0, -1)), 50);
    console.log('Today navigation completed and forced update triggered');
  };

  const getDateRange = () => {
    if (view === 'day') {
      return format(currentWeek, 'EEEE, MMMM d, yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(currentWeek);
      const end = endOfWeek(currentWeek);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentMonth, 'MMMM yyyy');
    }
  };

  // Filter management
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

  // Event handlers
  const handleCreateAppointment = (date: Date, time?: string) => {
    setDefaultDate(date);
    setDefaultTime(time);
    setSelectedAppointment(undefined);
    setShowAppointmentModal(true);
    onCreateAppointment?.(date, time);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
    onViewAppointment?.(appointment);
  };

  const closeModal = () => {
    setShowAppointmentModal(false);
    setSelectedAppointment(undefined);
    setDefaultDate(undefined);
    setDefaultTime(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading calendar...</div>
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

      {/* Calendar Header - Only show navigation controls on calendar tab */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {activeTab === 'calendar' && (
                <>
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
                </>
              )}
              
              {activeTab === 'integrations' && (
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Calendar Integrations
                </CardTitle>
              )}
            </div>
            
            {activeTab === 'calendar' && (
              <div className="flex items-center gap-2">
                {/* View Toggle */}
                <Tabs value={view} onValueChange={(value: 'day' | 'week' | 'month') => setView(value)} className="mr-4">
                  <TabsList>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button onClick={() => handleCreateAppointment(new Date())}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Main Calendar Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4">
          {/* Calendar Grid */}
          <Card>
            <CardContent className="p-0">
              {view === 'day' && (
                <>
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold text-lg">
                      {format(currentWeek, 'EEEE, MMMM d, yyyy')}
                    </h3>
                  </div>
                  
                  {/* Day view - single column with time slots */}
                  <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((time) => {
                      const dayDate = format(currentWeek, 'yyyy-MM-dd');
                      const dayAppointments = filteredAppointments.filter(apt => 
                        apt.date === dayDate && apt.time === time
                      );
                      
                      return (
                        <div key={time} className="grid grid-cols-4 border-b min-h-16 hover:bg-muted/30">
                          {/* Time label */}
                          <div className="p-3 border-r bg-muted/30 text-sm font-medium flex items-center">
                            {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                          </div>
                          
                          {/* Appointment slot */}
                          <div 
                            className="col-span-3 p-2 cursor-pointer relative"
                            onClick={() => handleCreateAppointment(currentWeek, time)}
                          >
                            {dayAppointments.length > 0 ? (
                              dayAppointments.map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`appointment-card p-2 rounded mb-1 text-xs cursor-pointer
                                    ${apt.status === 'confirmed' ? 'bg-green-100 border-green-300' : 
                                      apt.status === 'scheduled' ? 'bg-blue-100 border-blue-300' :
                                      apt.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                                      apt.status === 'completed' ? 'bg-purple-100 border-purple-300' :
                                      'bg-yellow-100 border-yellow-300'} border`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAppointment(apt);
                                  }}
                                >
                                  <div className="font-medium truncate">{apt.patient_name || 'No Name'}</div>
                                  <div className="text-muted-foreground truncate">{apt.appointment_type}</div>
                                </div>
                              ))
                            ) : (
                              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                Click to schedule
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

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
                          const dayDate = format(day, 'yyyy-MM-dd');
                          const dayAppointments = filteredAppointments.filter(apt => 
                            apt.date === dayDate && apt.time === time
                          );
                          
                          return (
                            <div 
                              key={day.toISOString()} 
                              className="border-r p-1 cursor-pointer hover:bg-muted/30 relative"
                              onClick={() => handleCreateAppointment(day, time)}
                            >
                              {dayAppointments.map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`appointment-card p-1 rounded text-xs cursor-pointer
                                    ${apt.status === 'confirmed' ? 'bg-green-100 border-green-300' : 
                                      apt.status === 'scheduled' ? 'bg-blue-100 border-blue-300' :
                                      apt.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                                      apt.status === 'completed' ? 'bg-purple-100 border-purple-300' :
                                      'bg-yellow-100 border-yellow-300'} border mb-1`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAppointment(apt);
                                  }}
                                >
                                  <div className="font-medium truncate">{apt.patient_name || 'No Name'}</div>
                                  <div className="text-muted-foreground truncate">{apt.appointment_type}</div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {view === 'month' && (
                <>
                  <div className="border-b bg-muted/50 p-4">
                    <h3 className="font-semibold text-lg">
                      {format(currentMonth, 'MMMM yyyy')}
                    </h3>
                  </div>
                  
                  {/* Month grid */}
                  <div className="grid grid-cols-7">
                    {/* Day headers */}
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-3 border-r border-b bg-muted/30 font-medium text-center">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar days */}
                    {Array.from({ length: 42 }, (_, i) => {
                      const startOfMonthDate = startOfMonth(currentMonth);
                      const startOfCalendar = startOfWeek(startOfMonthDate);
                      const currentDate = addDays(startOfCalendar, i);
                      const isCurrentMonth = isSameMonth(currentDate, currentMonth);
                      const isToday = isSameDay(currentDate, new Date());
                      const dayDate = format(currentDate, 'yyyy-MM-dd');
                      const dayAppointments = filteredAppointments.filter(apt => apt.date === dayDate);
                      
                      return (
                        <div
                          key={i}
                          className={`min-h-20 border-r border-b p-1 cursor-pointer hover:bg-muted/30
                            ${!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''}
                            ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                          onClick={() => handleCreateAppointment(currentDate)}
                        >
                          <div className={`text-sm font-medium mb-1 
                            ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                            {format(currentDate, 'd')}
                          </div>
                          
                          {/* Show appointment count or dots */}
                          {dayAppointments.length > 0 && (
                            <div className="space-y-1">
                              {dayAppointments.slice(0, 2).map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`text-xs p-1 rounded truncate cursor-pointer
                                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                      apt.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                      apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                      apt.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                                      'bg-yellow-100 text-yellow-800'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAppointment(apt);
                                  }}
                                >
                                  {apt.patient_name}
                                </div>
                              ))}
                              {dayAppointments.length > 2 && (
                                <div className="text-xs text-muted-foreground">
                                  +{dayAppointments.length - 2} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Status Legend */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>No Show</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <CalendarIntegrations />
        </TabsContent>
      </Tabs>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={closeModal}
          appointment={selectedAppointment}
          defaultDate={defaultDate}
          defaultTime={defaultTime}
        />
      )}
    </div>
  );
};