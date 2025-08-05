
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppointments, useCreateAppointment, useUpdateAppointment } from '@/hooks/useAppointments';
import {
  format, startOfWeek, endOfWeek, addDays, startOfDay, endOfDay,
  startOfMonth, endOfMonth, parseISO, isSameDay, isSameMonth, addWeeks, subWeeks, addMonths, subMonths,
  eachDayOfInterval, isSameWeek, isToday
} from 'date-fns';
import {
  Calendar,
  Clock,
  Users,
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Phone,
  MessageSquare,
  FileText,
  User,
  Settings,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
  X,
  Bell,
  Video,
  MapPin,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  Moon,
  Activity
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no-show';
  provider: string;
  room: string;
  notes: string;
  reminderSent: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  appointment?: Appointment;
}

export default function Schedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showEditAppointment, setShowEditAppointment] = useState(false);
  const [showMessageAppointment, setShowMessageAppointment] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isMounted, setIsMounted] = useState(false);

  // Validate and ensure selectedDate is always a valid Date
  const getValidDate = (date: Date): Date => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    return new Date();
  };

  const validSelectedDate = getValidDate(selectedDate);

  // Safe date formatting without date-fns
  const formatDateSafe = (date: Date, format: string): string => {
    if (!isMounted) {
      // Return safe fallback during initial render
      return date.toLocaleDateString();
    }

    try {
      switch (format) {
        case 'yyyy-MM-dd':
          return date.toISOString().split('T')[0];
        case 'EEEE, MMMM d, yyyy':
          return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        case 'MMMM yyyy':
          return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          });
        case 'MMM d':
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
        case 'MMM d, yyyy':
          return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
        default:
          return date.toLocaleDateString();
      }
    } catch (error) {
      return date.toLocaleDateString();
    }
  };

  // Safe week calculation without date-fns
  const getWeekDays = () => {
    if (!isMounted) return [];

    try {
      const start = startOfWeek(validSelectedDate);
      return eachDayOfInterval({ start, end: endOfWeek(validSelectedDate) });
    } catch (error) {
      // Fallback to simple week calculation
      const days = [];
      const today = new Date(validSelectedDate);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        days.push(day);
      }
      return days;
    }
  };

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock appointments data for Midwest Dental Sleep
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().split('T')[0];

    return [
      {
        id: '1',
        patientName: 'Sarah Johnson',
        patientEmail: 'sarah.johnson@email.com',
        patientPhone: '(555) 123-4567',
        date: todayStr,
        time: '09:00',
        duration: 60,
        type: 'Sleep Study Consultation',
        status: 'confirmed',
        provider: 'Dr. Gatsas',
        room: 'Exam Room 1',
        notes: 'CPAP follow-up appointment',
        reminderSent: true
      },
      {
        id: '2',
        patientName: 'Michael Chen',
        patientEmail: 'michael.chen@email.com',
        patientPhone: '(555) 234-5678',
        date: todayStr,
        time: '10:30',
        duration: 45,
        type: 'Initial Consultation',
        status: 'pending',
        provider: 'Dr. Gatsas',
        room: 'Exam Room 2',
        notes: 'New patient with sleep apnea symptoms',
        reminderSent: false
      },
      {
        id: '3',
        patientName: 'Emily Rodriguez',
        patientEmail: 'emily.rodriguez@email.com',
        patientPhone: '(555) 345-6789',
        date: tomorrowStr,
        time: '14:00',
        duration: 90,
        type: 'CPAP Fitting',
        status: 'confirmed',
        provider: 'Dr. Gatsas',
        room: 'Exam Room 1',
        notes: 'CPAP mask fitting and adjustment',
        reminderSent: true
      },
      {
        id: '4',
        patientName: 'David Wilson',
        patientEmail: 'david.wilson@email.com',
        patientPhone: '(555) 456-7890',
        date: dayAfterTomorrowStr,
        time: '11:00',
        duration: 60,
        type: 'Oral Appliance Fitting',
        status: 'confirmed',
        provider: 'Dr. Gatsas',
        room: 'Exam Room 3',
        notes: 'Custom oral appliance delivery',
        reminderSent: false
      }
    ];
  });

  const { toast } = useToast();

  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    date: '',
    time: '',
    duration: 60,
    type: '',
    provider: 'Dr. Gatsas',
    room: 'Exam Room 1',
    notes: ''
  });

  // Appointment types for Midwest Dental Sleep
  const appointmentTypes = [
    'Sleep Study Consultation',
    'CPAP Follow-up',
    'Oral Appliance Fitting',
    'Oral Appliance Adjustment',
    'Sleep Study Review',
    'TMJ Evaluation',
    'Airway Assessment',
    'Appliance Delivery',
    'Progress Check'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertTriangle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'no-show': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (time: string) => {
    if (typeof time !== 'string') return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  const getDayStats = (date: string) => {
    const dayAppointments = getAppointmentsForDate(date);
    return {
      total: dayAppointments.length,
      confirmed: dayAppointments.filter(a => a.status === 'confirmed').length,
      pending: dayAppointments.filter(a => a.status === 'pending').length,
      completed: dayAppointments.filter(a => a.status === 'completed').length
    };
  };

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const appointment = appointments.find(apt => apt.time === time && apt.date === formatDateSafe(validSelectedDate, 'yyyy-MM-dd'));
        slots.push({
          time,
          available: !appointment,
          appointment
        });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Navigation handlers
  const handleNavigateToDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(validSelectedDate);
    if (viewMode === 'day') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    } else if (viewMode === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else if (viewMode === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    }
    setSelectedDate(newDate);
  };

  const handleViewModeChange = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    if (mode === 'day') {
      setSelectedDate(new Date());
    }
  };

  // Action handlers
  const handleAddAppointment = () => {
    setNewAppointment({
      patientName: '',
      patientEmail: '',
      patientPhone: '',
      date: formatDateSafe(validSelectedDate, 'yyyy-MM-dd'),
      time: '',
      duration: 60,
      type: '',
      provider: 'Dr. Gatsas',
      room: 'Exam Room 1',
      notes: ''
    });
    setShowAddAppointment(true);
  };

  const handleCreateAppointment = () => {
    if (newAppointment.patientName && newAppointment.date && newAppointment.time) {
      const newAppointmentObj: Appointment = {
        id: (appointments.length + 1).toString(),
        patientName: newAppointment.patientName,
        patientEmail: newAppointment.patientEmail,
        patientPhone: newAppointment.patientPhone,
        date: newAppointment.date,
        time: newAppointment.time,
        duration: newAppointment.duration,
        type: newAppointment.type,
        status: 'pending',
        provider: newAppointment.provider,
        room: newAppointment.room,
        notes: newAppointment.notes,
        reminderSent: false
      };

      setAppointments([...appointments, newAppointmentObj]);

      toast({
        title: "Appointment Added",
        description: `Appointment for ${newAppointment.patientName} has been scheduled.`,
      });
      setNewAppointment({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        date: '',
        time: '',
        duration: 60,
        type: '',
        provider: 'Dr. Gatsas',
        room: 'Exam Room 1',
        notes: ''
      });
      setShowAddAppointment(false);
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowEditAppointment(true);
  };

  const handleUpdateAppointment = () => {
    if (selectedAppointment) {
      const updatedAppointments = appointments.map(apt =>
        apt.id === selectedAppointment.id ? selectedAppointment : apt
      );
      setAppointments(updatedAppointments);
      toast({
        title: "Appointment Updated",
        description: `Appointment for ${selectedAppointment.patientName} has been updated.`,
      });
      setShowEditAppointment(false);
      setSelectedAppointment(null);
    }
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleMessageAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowMessageAppointment(true);
  };

  const handleSendMessage = () => {
    if (selectedAppointment && messageText.trim()) {
      toast({
        title: "Message Sent",
        description: `Message sent to ${selectedAppointment.patientName}`,
      });
      setMessageText('');
      setShowMessageAppointment(false);
      setSelectedAppointment(null);
    }
  };

  const handleCallPatient = (appointment: Appointment) => {
    toast({
      title: "Call Initiated",
      description: `Calling ${appointment.patientName} at ${appointment.patientPhone}`,
    });
  };

  const handleSendReminder = (appointment: Appointment) => {
    toast({
      title: "Reminder Sent",
      description: `Reminder sent to ${appointment.patientName}`,
    });
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointment.id ? { ...apt, status: 'cancelled' as const } : apt
    );
    setAppointments(updatedAppointments);
    toast({
      title: "Appointment Cancelled",
      description: `Appointment for ${appointment.patientName} has been cancelled.`,
    });
  };

  const handleConfirmAppointment = (appointment: Appointment) => {
    const updatedAppointments = appointments.map(apt =>
      apt.id === appointment.id ? { ...apt, status: 'confirmed' as const } : apt
    );
    setAppointments(updatedAppointments);
    toast({
      title: "Appointment Confirmed",
      description: `Appointment for ${appointment.patientName} has been confirmed.`,
    });
  };

  const handleTimeSlotClick = (time: string) => {
    setNewAppointment({
      ...newAppointment,
      date: formatDateSafe(validSelectedDate, 'yyyy-MM-dd'),
      time: time
    });
    setShowAddAppointment(true);
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get current week days
  const weekDays = getWeekDays();

  // Get appointments for the current view
  const getAppointmentsForCurrentView = () => {
    if (viewMode === 'day') {
      return appointments.filter(apt => apt.date === formatDateSafe(validSelectedDate, 'yyyy-MM-dd'));
    } else if (viewMode === 'week') {
      const start = startOfWeek(validSelectedDate);
      const end = endOfWeek(validSelectedDate);
      return appointments.filter(apt => {
        const aptDate = parseISO(apt.date);
        return aptDate >= start && aptDate <= end;
      });
    } else if (viewMode === 'month') {
      const start = startOfMonth(validSelectedDate);
      const end = endOfMonth(validSelectedDate);
      return appointments.filter(apt => {
        const aptDate = parseISO(apt.date);
        return aptDate >= start && aptDate <= end;
      });
    }
    return appointments;
  };

  const currentViewAppointments = getAppointmentsForCurrentView();

  // Generate time slots for the current view
  const generateTimeSlotsForView = () => {
    if (viewMode === 'day') {
      const slots: TimeSlot[] = [];
      for (let hour = 8; hour <= 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const appointment = currentViewAppointments.find(apt => apt.time === time);
          slots.push({
            time,
            available: !appointment,
            appointment
          });
        }
      }
      return slots;
    }
    return timeSlots; // For week/month views, we'll handle differently
  };

  const currentTimeSlots = generateTimeSlotsForView();

  // Get filtered appointments for display
  const getDisplayAppointments = () => {
    if (statusFilter === 'all') {
      return currentViewAppointments;
    }
    return currentViewAppointments.filter(apt => apt.status === statusFilter);
  };

  const displayAppointments = getDisplayAppointments();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600">Manage appointments and scheduling for Midwest Dental Sleep</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/schedule-settings'}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleAddAppointment}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigateToDate('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {viewMode === 'month'
              ? validSelectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : viewMode === 'week'
                ? `${formatDateSafe(startOfWeek(validSelectedDate), 'MMM d')} - ${formatDateSafe(endOfWeek(validSelectedDate), 'MMM d, yyyy')}`
                : validSelectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
            }
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNavigateToDate('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('day')}
          >
            Day
          </Button>
          <Button
            variant={viewMode === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('month')}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('all')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold">{appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('confirmed')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('pending')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'pending').length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setStatusFilter('completed')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === 'day'
                  ? `${formatDateSafe(validSelectedDate, 'EEEE, MMMM d, yyyy')} Schedule`
                  : viewMode === 'week'
                    ? `${formatDateSafe(startOfWeek(validSelectedDate), 'MMM d')} - ${formatDateSafe(endOfWeek(validSelectedDate), 'MMM d, yyyy')} Schedule`
                    : `${formatDateSafe(validSelectedDate, 'MMMM yyyy')} Schedule`
                }
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="ml-2">
                    {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} only
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewMode === 'day' && (
                <div className="space-y-2">
                  {currentTimeSlots.map((slot) => (
                    <div key={slot.time} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-20 text-sm font-medium text-gray-600">
                        {formatTime(slot.time)}
                      </div>
                      <div className="flex-1">
                        {slot.appointment ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{slot.appointment.patientName}</div>
                              <div className="text-sm text-gray-600">{slot.appointment.type}</div>
                              <div className="text-xs text-gray-500">{slot.appointment.provider} • {slot.appointment.room}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(slot.appointment.status)}>
                                {slot.appointment.status}
                              </Badge>
                              <Button size="sm" variant="outline" onClick={() => handleViewAppointment(slot.appointment!)}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="text-gray-400 italic cursor-pointer hover:text-gray-600 transition-colors"
                            onClick={() => handleTimeSlotClick(slot.time)}
                          >
                            Click to schedule appointment
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {viewMode === 'week' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-8 border-b">
                    <div className="p-3 border-r bg-muted/50 font-medium">Time</div>
                    {weekDays.map((day) => (
                      <div key={day.toISOString()} className="p-3 border-r text-center">
                        <div className="font-medium">{formatDateSafe(day, 'EEE')}</div>
                        <div className={`text-sm ${isSameDay(day, new Date()) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {formatDateSafe(day, 'MMM d')}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="max-h-[600px] overflow-y-auto">
                    {timeSlots.map((timeSlot) => (
                      <div key={timeSlot.time} className="grid grid-cols-8 border-b min-h-16">
                        <div className="p-2 border-r bg-muted/30 text-sm font-medium flex items-center">
                          {(() => {
                            if (typeof timeSlot.time === 'string') {
                              const [hours, minutes] = timeSlot.time.split(':');
                              const hour = parseInt(hours);
                              const ampm = hour >= 12 ? 'PM' : 'AM';
                              const displayHour = hour % 12 || 12;
                              return `${displayHour}:${minutes} ${ampm}`;
                            }
                            return '';
                          })()}
                        </div>

                        {weekDays.map((day) => {
                          const dayDate = formatDateSafe(day, 'yyyy-MM-dd');
                          const dayAppointments = currentViewAppointments.filter(apt =>
                            apt.date === dayDate && apt.time === timeSlot.time
                          );

                          return (
                            <div
                              key={day.toISOString()}
                              className="border-r p-1 cursor-pointer hover:bg-muted/30 relative"
                              onClick={() => handleTimeSlotClick(timeSlot.time)}
                            >
                              {dayAppointments.map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`appointment-card p-1 rounded text-xs cursor-pointer
                                    ${apt.status === 'confirmed' ? 'bg-green-100 border-green-300' :
                                      apt.status === 'pending' ? 'bg-yellow-100 border-yellow-300' :
                                        apt.status === 'cancelled' ? 'bg-red-100 border-red-300' :
                                          apt.status === 'completed' ? 'bg-blue-100 border-blue-300' :
                                            'bg-gray-100 border-gray-300'} border mb-1`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAppointment(apt);
                                  }}
                                >
                                  <div className="font-medium truncate">{apt.patient_name || apt.patientName}</div>
                                  <div className="text-muted-foreground truncate">{apt.appointment_type || apt.type}</div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewMode === 'month' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-7">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="p-3 border-r border-b bg-muted/30 font-medium text-center">
                        {day}
                      </div>
                    ))}

                    {Array.from({ length: 42 }, (_, i) => {
                      const startOfMonthDate = startOfMonth(validSelectedDate);
                      const startOfCalendar = startOfWeek(startOfMonthDate);
                      const currentDate = addDays(startOfCalendar, i);
                      const isCurrentMonth = isSameMonth(currentDate, validSelectedDate);
                      const isToday = isSameDay(currentDate, new Date());
                      const dayDate = formatDateSafe(currentDate, 'yyyy-MM-dd');
                      const dayAppointments = currentViewAppointments.filter(apt => apt.date === dayDate);

                      return (
                        <div
                          key={i}
                          className={`min-h-20 border-r border-b p-1 cursor-pointer hover:bg-muted/30
                            ${!isCurrentMonth ? 'bg-muted/20 text-muted-foreground' : ''}
                            ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                          onClick={() => {
                            setSelectedDate(currentDate);
                            setViewMode('day');
                          }}
                        >
                          <div className={`text-sm font-medium mb-1 
                            ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                            {formatDateSafe(currentDate, 'd')}
                          </div>

                          {dayAppointments.length > 0 && (
                            <div className="space-y-1">
                              {dayAppointments.slice(0, 2).map((apt) => (
                                <div
                                  key={apt.id}
                                  className={`text-xs p-1 rounded truncate cursor-pointer
                                    ${apt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        apt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                          apt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                            'bg-gray-100 text-gray-800'}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewAppointment(apt);
                                  }}
                                >
                                  {apt.patient_name || apt.patientName}
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayAppointments
                  .filter(apt => apt.status === 'confirmed' || apt.status === 'pending')
                  .slice(0, 5)
                  .map((appointment) => (
                    <div key={appointment.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{appointment.patientName}</div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {appointment.type} • {appointment.provider}
                      </div>
                      <div className="text-sm text-gray-500">
                        {appointment.date} at {formatTime(appointment.time)}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallPatient(appointment)}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMessageAppointment(appointment)}
                        >
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Patient</th>
                  <th className="text-left py-2">Date & Time</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-left py-2">Provider</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayAppointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b">
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-gray-600">{appointment.patientEmail}</div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div>
                        <div className="font-medium">{appointment.date}</div>
                        <div className="text-sm text-gray-600">{formatTime(appointment.time)}</div>
                      </div>
                    </td>
                    <td className="py-3">{appointment.type}</td>
                    <td className="py-3">{appointment.provider}</td>
                    <td className="py-3">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditAppointment(appointment)}>
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleMessageAppointment(appointment)}>
                          <MessageSquare className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewAppointment(appointment)}>
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Appointment Modal */}
      <Dialog open={showAddAppointment} onOpenChange={setShowAddAppointment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientName" className="text-right">
                Patient Name
              </Label>
              <Input
                id="patientName"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientEmail" className="text-right">
                Email
              </Label>
              <Input
                id="patientEmail"
                type="email"
                value={newAppointment.patientEmail}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientEmail: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="patientPhone" className="text-right">
                Phone
              </Label>
              <Input
                id="patientPhone"
                value={newAppointment.patientPhone}
                onChange={(e) => setNewAppointment({ ...newAppointment, patientPhone: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newAppointment.date}
                onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newAppointment.time}
                onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({ ...newAppointment, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAppointment(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAppointment}>
              Create Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Appointment Modal */}
      <Dialog open={showEditAppointment} onOpenChange={setShowEditAppointment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPatientName" className="text-right">
                  Patient Name
                </Label>
                <Input
                  id="editPatientName"
                  value={selectedAppointment.patientName}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, patientName: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPatientEmail" className="text-right">
                  Email
                </Label>
                <Input
                  id="editPatientEmail"
                  type="email"
                  value={selectedAppointment.patientEmail}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, patientEmail: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editPatientPhone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="editPatientPhone"
                  value={selectedAppointment.patientPhone}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, patientPhone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editDate" className="text-right">
                  Date
                </Label>
                <Input
                  id="editDate"
                  type="date"
                  value={selectedAppointment.date}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, date: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editTime" className="text-right">
                  Time
                </Label>
                <Input
                  id="editTime"
                  type="time"
                  value={selectedAppointment.time}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, time: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editType" className="text-right">
                  Type
                </Label>
                <Select value={selectedAppointment.type} onValueChange={(value) => setSelectedAppointment({ ...selectedAppointment, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                  <SelectContent>
                    {appointmentTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editStatus" className="text-right">
                  Status
                </Label>
                <Select value={selectedAppointment.status} onValueChange={(value) => setSelectedAppointment({ ...selectedAppointment, status: value as any })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editNotes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="editNotes"
                  value={selectedAppointment.notes}
                  onChange={(e) => setSelectedAppointment({ ...selectedAppointment, notes: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditAppointment(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateAppointment}>
              Update Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={showMessageAppointment} onOpenChange={setShowMessageAppointment}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message to {selectedAppointment?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Enter your message..."
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageAppointment(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage}>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Appointment Details Modal */}
      <Dialog open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedAppointment.patientName}</h3>
                  <p className="text-sm text-gray-600">{selectedAppointment.patientEmail}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.patientPhone}</p>
                </div>
                <div>
                  <p className="font-medium">{selectedAppointment.type}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.provider} • {selectedAppointment.room}</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.date} at {formatTime(selectedAppointment.time)}</p>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <p className="font-medium">Notes</p>
                    <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleCallPatient(selectedAppointment)}>
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleMessageAppointment(selectedAppointment)}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleSendReminder(selectedAppointment)}>
                    <Bell className="w-4 h-4 mr-2" />
                    Send Reminder
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAppointmentDetails(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
