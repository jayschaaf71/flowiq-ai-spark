import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, MapPin, Phone, Mail, Search, Filter, ChevronLeft, ChevronRight, Plus, Edit, Trash2, Copy, MoreHorizontal } from 'lucide-react';
import { format, startOfWeek, endOfWeek, addDays, isSameDay, parseISO, addWeeks, subWeeks, addMonths, subMonths } from 'date-fns';
import { useAppointments } from '@/hooks/useAppointments';
import { DragDropCalendar } from './DragDropCalendar';

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  appointment_type: string;
  status: string;
  notes?: string;
  phone?: string;
  email?: string;
}

export const EnhancedCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'dragdrop'>('week');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  const { appointments, loading } = useAppointments();

  const filteredAppointments = appointments?.filter(apt => {
    const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.appointment_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }) || [];

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return filteredAppointments.filter(apt => apt.date === dateStr);
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewMode === 'week') {
      setCurrentDate(direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    } else {
      setCurrentDate(direction === 'next' ? addDays(currentDate, 1) : addDays(currentDate, -1));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const AppointmentCard = ({ appointment, isCompact = false }: { appointment: Appointment; isCompact?: boolean }) => (
    <div 
      className={`p-2 mb-2 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
        isCompact ? 'text-xs' : 'text-sm'
      }`}
      onClick={() => setSelectedAppointment(appointment)}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium truncate">{appointment.title}</span>
        <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-gray-600">
        <Clock className="w-3 h-3" />
        <span>{appointment.time}</span>
        <span>({appointment.duration}min)</span>
      </div>
      {!isCompact && appointment.phone && (
        <div className="flex items-center gap-2 text-gray-600 mt-1">
          <Phone className="w-3 h-3" />
          <span>{appointment.phone}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold">Enhanced Calendar</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {viewMode === 'week' 
                ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, 'MMMM d, yyyy')
              }
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Select value={viewMode} onValueChange={(value: 'week' | 'day' | 'dragdrop') => setViewMode(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="dragdrop">Drag & Drop</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex gap-2">
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      {viewMode === 'dragdrop' ? (
        <DragDropCalendar />
      ) : viewMode === 'week' ? (
        <div className="grid grid-cols-7 gap-2">
          {getWeekDays().map((day, index) => {
            const dayAppointments = getAppointmentsForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <Card key={index} className={`min-h-[300px] ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {format(day, 'EEE, MMM d')}
                    {isToday && <Badge className="ml-2 text-xs bg-blue-100 text-blue-700">Today</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  {dayAppointments.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm py-8">
                      No appointments
                    </div>
                  ) : (
                    dayAppointments.map(appointment => (
                      <AppointmentCard key={appointment.id} appointment={appointment} isCompact />
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
              {isSameDay(currentDate, new Date()) && (
                <Badge className="ml-2 bg-blue-100 text-blue-700">Today</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getAppointmentsForDate(currentDate).length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                No appointments scheduled for this day
              </div>
            ) : (
              <div className="space-y-3">
                {getAppointmentsForDate(currentDate).map(appointment => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredAppointments.length}</div>
              <div className="text-sm text-gray-600">Total Appointments</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredAppointments.filter(a => a.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {filteredAppointments.filter(a => a.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredAppointments.filter(a => a.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
