import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, User, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, parseISO, addMinutes } from 'date-fns';
import { useAppointments, useUpdateAppointment } from '@/hooks/useAppointments';

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
  patient_name?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  appointments: Appointment[];
}

const SortableAppointment = ({ appointment, isOverlay = false }: { appointment: Appointment; isOverlay?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: appointment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-l-green-500';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-l-yellow-500';
      case 'cancelled': return 'bg-red-100 text-red-800 border-l-red-500';
      case 'completed': return 'bg-blue-100 text-blue-800 border-l-blue-500';
      default: return 'bg-gray-100 text-gray-800 border-l-gray-500';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-3 border-l-4 rounded-lg cursor-move transition-all duration-200
        ${getStatusColor(appointment.status)}
        ${isDragging ? 'shadow-lg scale-105 z-10' : 'hover:shadow-md'}
        ${isOverlay ? 'rotate-3 shadow-xl' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-sm">{appointment.patient_name || appointment.title}</span>
        <Badge variant="outline" className="text-xs">
          {appointment.appointment_type}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
        <Clock className="w-3 h-3" />
        <span>{appointment.time} ({appointment.duration}min)</span>
      </div>
      
      {appointment.phone && (
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Phone className="w-3 h-3" />
          <span>{appointment.phone}</span>
        </div>
      )}
    </div>
  );
};

const TimeSlotContainer = ({ timeSlot, onDrop }: { timeSlot: TimeSlot; onDrop: (appointmentId: string, newTime: string) => void }) => {
  const [isOver, setIsOver] = useState(false);

  return (
    <div 
      className={`
        min-h-[120px] p-3 border-2 border-dashed rounded-lg transition-all duration-200
        ${isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
        ${timeSlot.available ? 'hover:border-green-400 hover:bg-green-50' : ''}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const appointmentId = e.dataTransfer.getData('text/plain');
        if (appointmentId && timeSlot.available) {
          onDrop(appointmentId, timeSlot.time);
        }
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-sm">{timeSlot.time}</span>
        {timeSlot.available ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-500" />
        )}
      </div>
      
      <div className="space-y-2">
        {timeSlot.appointments.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-xs">
            {timeSlot.available ? 'Available slot' : 'Unavailable'}
          </div>
        ) : (
          <SortableContext items={timeSlot.appointments.map(apt => apt.id)} strategy={verticalListSortingStrategy}>
            {timeSlot.appointments.map(appointment => (
              <SortableAppointment key={appointment.id} appointment={appointment} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export const DragDropCalendar = () => {
  const { toast } = useToast();
  const { appointments } = useAppointments();
  const updateMutation = useUpdateAppointment();
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [conflicts, setConflicts] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Generate time slots for the day (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = useCallback((): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          id: `slot-${time}`,
          time,
          available: true,
          appointments: []
        });
      }
    }

    // Populate slots with existing appointments
    const today = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments?.filter(apt => apt.date === today) || [];
    
    todayAppointments.forEach(appointment => {
      const slotIndex = slots.findIndex(slot => slot.time === appointment.time);
      if (slotIndex >= 0) {
        slots[slotIndex].appointments.push(appointment);
        slots[slotIndex].available = false;
      }
    });

    return slots;
  }, [appointments]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  // Detect scheduling conflicts
  const detectConflicts = useCallback((slots: TimeSlot[]): string[] => {
    const conflictIds: string[] = [];
    
    slots.forEach(slot => {
      if (slot.appointments.length > 1) {
        // Multiple appointments in same time slot
        slot.appointments.forEach(apt => conflictIds.push(apt.id));
      }
      
      slot.appointments.forEach(appointment => {
        // Check if appointment duration overlaps with next slots
        const duration = appointment.duration || 30;
        const endTime = addMinutes(parseISO(`2000-01-01T${appointment.time}:00`), duration);
        const endTimeStr = format(endTime, 'HH:mm');
        
        const overlappingSlots = slots.filter(s => 
          s.time > appointment.time && 
          s.time < endTimeStr && 
          s.appointments.length > 0
        );
        
        if (overlappingSlots.length > 0) {
          conflictIds.push(appointment.id);
          overlappingSlots.forEach(s => 
            s.appointments.forEach(apt => conflictIds.push(apt.id))
          );
        }
      });
    });
    
    return [...new Set(conflictIds)];
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const appointment = appointments?.find(apt => apt.id === event.active.id);
    if (appointment) {
      setActiveAppointment(appointment);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveAppointment(null);

    if (!over) return;

    const appointmentId = active.id as string;
    const appointment = appointments?.find(apt => apt.id === appointmentId);
    
    if (!appointment) return;

    // Extract target time from droppable ID
    let targetTime: string;
    if (over.id.toString().startsWith('slot-')) {
      targetTime = over.id.toString().replace('slot-', '');
    } else {
      // Dropped on another appointment - get its time slot
      const targetAppointment = appointments?.find(apt => apt.id === over.id);
      if (!targetAppointment) return;
      targetTime = targetAppointment.time;
    }

    if (appointment.time === targetTime) return;

    try {
      // Update appointment time
      await updateMutation.mutateAsync({ id: appointmentId, updates: { time: targetTime } });
      
      // Update local state
      const updatedSlots = generateTimeSlots();
      setTimeSlots(updatedSlots);
      
      // Check for conflicts
      const newConflicts = detectConflicts(updatedSlots);
      setConflicts(newConflicts);
      
      if (newConflicts.length > 0) {
        toast({
          title: "Schedule Conflict Detected",
          description: `Moving appointment to ${targetTime} created scheduling conflicts. Please review and resolve.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Appointment Moved",
          description: `${appointment.patient_name || appointment.title} rescheduled to ${targetTime}`,
        });
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to reschedule appointment",
        variant: "destructive",
      });
    }
  };

  const handleManualDrop = (appointmentId: string, newTime: string) => {
    const appointment = appointments?.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    handleDragEnd({
      active: { id: appointmentId },
      over: { id: `slot-${newTime}` }
    } as DragEndEvent);
  };

  const resolveConflicts = () => {
    // Auto-resolve conflicts by spacing out appointments
    const conflictedAppointments = appointments?.filter(apt => conflicts.includes(apt.id)) || [];
    
    // Group by time slot
    const conflictGroups = conflictedAppointments.reduce((groups, apt) => {
      if (!groups[apt.time]) groups[apt.time] = [];
      groups[apt.time].push(apt);
      return groups;
    }, {} as Record<string, Appointment[]>);

    // Resolve each conflict group
    Object.entries(conflictGroups).forEach(([time, appointments]) => {
      if (appointments.length <= 1) return;
      
      appointments.slice(1).forEach(async (apt, index) => {
        const newTime = addMinutes(parseISO(`2000-01-01T${time}:00`), (index + 1) * 30);
        const newTimeStr = format(newTime, 'HH:mm');
        await updateMutation.mutateAsync({ id: apt.id, updates: { time: newTimeStr } });
      });
    });

    setConflicts([]);
    setTimeSlots(generateTimeSlots());
    
    toast({
      title: "Conflicts Resolved",
      description: "Appointments have been automatically rescheduled to avoid conflicts",
    });
  };

  React.useEffect(() => {
    const slots = generateTimeSlots();
    setTimeSlots(slots);
    setConflicts(detectConflicts(slots));
  }, [generateTimeSlots, detectConflicts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Drag & Drop Calendar</h2>
          <p className="text-gray-600">Drag appointments to reschedule them instantly</p>
        </div>
        
        {conflicts.length > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {conflicts.length} Conflicts
            </Badge>
            <Button onClick={resolveConflicts} variant="outline" size="sm">
              Auto-Resolve
            </Button>
          </div>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {timeSlots.map(timeSlot => (
            <Card key={timeSlot.id} className={conflicts.some(id => timeSlot.appointments.some(apt => apt.id === id)) ? 'border-red-300' : ''}>
              <CardHeader className="p-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  {timeSlot.time}
                  {timeSlot.available ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <TimeSlotContainer 
                  timeSlot={timeSlot} 
                  onDrop={handleManualDrop}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <DragOverlay>
          {activeAppointment ? (
            <SortableAppointment appointment={activeAppointment} isOverlay />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calendar Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-l-4 border-l-green-500 rounded"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-100 border-l-4 border-l-yellow-500 rounded"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border-l-4 border-l-blue-500 rounded"></div>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-l-4 border-l-red-500 rounded"></div>
              <span>Cancelled</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};