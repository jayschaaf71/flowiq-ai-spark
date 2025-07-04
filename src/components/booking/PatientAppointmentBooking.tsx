import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { CalendarDays, Clock, User } from 'lucide-react';

interface PatientAppointmentBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
}

export const PatientAppointmentBooking: React.FC<PatientAppointmentBookingProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const appointmentTypes = [
    { value: 'follow-up', label: 'Follow-up Visit' },
    { value: 'sleep-study', label: 'Sleep Study Review' },
    { value: 'device-adjustment', label: 'Device Adjustment' },
    { value: 'consultation', label: 'General Consultation' }
  ];

  // Mock providers - replace with real data
  useEffect(() => {
    setProviders([
      { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Dr. Sarah Wilson', specialty: 'Sleep Medicine' },
      { id: 'b2c3d4e5-f6g7-8901-bcde-f23456789012', name: 'Dr. Michael Chen', specialty: 'Pulmonology' },
      { id: 'c3d4e5f6-g7h8-9012-cdef-345678901234', name: 'Care Coordinator', specialty: 'Patient Care' }
    ]);
  }, []);

  // Generate time slots for selected date
  useEffect(() => {
    if (selectedDate) {
      const slots: TimeSlot[] = [];
      const startHour = 9; // 9 AM
      const endHour = 17; // 5 PM
      
      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          // Mock availability - in real app, check against existing appointments
          const available = Math.random() > 0.3; // 70% chance of being available
          slots.push({ time, available });
        }
      }
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedProvider || !appointmentType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        patient_id: user?.id,
        provider_id: selectedProvider,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        appointment_type: appointmentType,
        title: appointmentTypes.find(t => t.value === appointmentType)?.label || 'Appointment',
        notes: notes,
        status: 'pending',
        email: profile?.email,
        phone: '', // Could add phone field
        duration: 60 // Default 60 minutes
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (error) throw error;

      // Create notification for patient
      await supabase
        .from('patient_notifications')
        .insert([{
          patient_id: user?.id,
          type: 'appointment',
          title: 'Appointment Request Submitted',
          message: `Your ${appointmentTypes.find(t => t.value === appointmentType)?.label} request for ${selectedDate.toLocaleDateString()} at ${selectedTime} has been submitted and is pending confirmation.`,
          priority: 'normal',
          metadata: {
            appointment_date: selectedDate.toISOString().split('T')[0],
            appointment_time: selectedTime,
            appointment_type: appointmentType
          }
        }]);

      toast({
        title: "Appointment Requested",
        description: "Your appointment request has been submitted. You'll receive confirmation within 24 hours.",
      });

      // Reset form
      setSelectedDate(undefined);
      setSelectedTime('');
      setSelectedProvider('');
      setAppointmentType('');
      setNotes('');
      onOpenChange(false);

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your appointment request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-purple-600" />
            Schedule Appointment
          </DialogTitle>
          <DialogDescription>
            Request an appointment with your sleep medicine care team
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label>Healthcare Provider</Label>
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{provider.name}</div>
                        <div className="text-sm text-gray-500">{provider.specialty}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label>Appointment Type</Label>
            <Select value={appointmentType} onValueChange={setAppointmentType}>
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Preferred Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md border"
            />
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Available Times
              </Label>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    className={`text-sm ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes (Optional)</Label>
            <Textarea
              placeholder="Any specific concerns or requests for your appointment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleBookAppointment} 
            disabled={loading || !selectedDate || !selectedTime || !selectedProvider || !appointmentType}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? 'Booking...' : 'Request Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};