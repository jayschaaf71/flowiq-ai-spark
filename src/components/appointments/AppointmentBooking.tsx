import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Save,
  X
} from 'lucide-react';

interface AppointmentFormData {
  patient_id?: string;
  provider_id?: string;
  date: Date;
  time: string;
  duration: number;
  appointment_type: string;
  title: string;
  notes?: string;
  patient_name?: string;
  phone?: string;
  email?: string;
}

interface Provider {
  id: string;
  name: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  patient_number: string;
}

interface AppointmentBookingProps {
  onSuccess?: (appointment: any) => void;
  onCancel?: () => void;
  selectedDate?: Date;
  selectedTime?: string;
  selectedProvider?: string;
}

export const AppointmentBooking = ({ 
  onSuccess, 
  onCancel,
  selectedDate,
  selectedTime,
  selectedProvider
}: AppointmentBookingProps) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    date: selectedDate || new Date(),
    time: selectedTime || '',
    duration: 60,
    appointment_type: '',
    title: '',
    notes: '',
    patient_name: '',
    phone: '',
    email: ''
  });
  
  const [providers, setProviders] = useState<Provider[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchPatient, setSearchPatient] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
    fetchPatients();
    if (selectedProvider) {
      setFormData(prev => ({ ...prev, provider_id: selectedProvider }));
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (formData.date && formData.provider_id) {
      fetchAvailableSlots();
    }
  }, [formData.date, formData.provider_id]);

  const fetchProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('id, first_name, last_name, specialty')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      
      setProviders(data?.map(provider => ({
        id: provider.id,
        name: `${provider.first_name} ${provider.last_name}${provider.specialty ? ` (${provider.specialty})` : ''}`
      })) || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('id, first_name, last_name, phone, email, patient_number')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      setPatients(data?.map(patient => ({
        id: patient.id,
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        patient_number: patient.patient_number || patient.phone || 'No phone'
      })) || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    }
  };

  const fetchAvailableSlots = async () => {
    if (!formData.provider_id || !formData.date) return;

    try {
      const dateStr = format(formData.date, 'yyyy-MM-dd');
      const dayOfWeek = formData.date.getDay();

      // Get provider schedule for the selected day
      const { data: schedule } = await supabase
        .from('provider_schedules')
        .select('start_time, end_time, break_start_time, break_end_time')
        .eq('provider_id', formData.provider_id)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true)
        .maybeSingle();

      if (!schedule) {
        console.log('No schedule found for this day');
        setAvailableSlots([]);
        return;
      }

      // Get existing appointments for this provider and date
      const { data: appointments } = await supabase
        .from('appointments')
        .select('time, duration')
        .eq('provider_id', formData.provider_id)
        .eq('date', dateStr)
        .neq('status', 'cancelled');

      // Generate available time slots
      const slots = generateTimeSlots(schedule, appointments || []);
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback to basic time slots if there's an error
      generateFallbackSlots();
    }
  };

  const generateFallbackSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    setAvailableSlots(slots);
  };

  const generateTimeSlots = (schedule: any, existingAppointments: any[]) => {
    const slots = [];
    const startTime = schedule.start_time;
    const endTime = schedule.end_time;
    const breakStart = schedule.break_start_time;
    const breakEnd = schedule.break_end_time;

    // Convert times to minutes for easier calculation
    const timeToMinutes = (time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const minutesToTime = (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    const breakStartMinutes = breakStart ? timeToMinutes(breakStart) : null;
    const breakEndMinutes = breakEnd ? timeToMinutes(breakEnd) : null;

    // Generate 30-minute slots
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const slotTime = minutesToTime(minutes);
      
      // Skip break time
      if (breakStartMinutes && breakEndMinutes && 
          minutes >= breakStartMinutes && minutes < breakEndMinutes) {
        continue;
      }

      // Check if slot conflicts with existing appointments
      const hasConflict = existingAppointments.some(apt => {
        const aptStart = timeToMinutes(apt.time);
        const aptEnd = aptStart + (apt.duration || 60);
        const slotEnd = minutes + 30; // 30-minute default slot
        
        return (minutes >= aptStart && minutes < aptEnd) ||
               (slotEnd > aptStart && slotEnd <= aptEnd) ||
               (minutes <= aptStart && slotEnd >= aptEnd);
      });

      if (!hasConflict) {
        slots.push(slotTime);
      }
    }

    return slots;
  };

  const handleInputChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const filteredPatients = patients.filter(patient => 
    searchPatient === '' || 
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchPatient.toLowerCase()) ||
    patient.patient_number.toLowerCase().includes(searchPatient.toLowerCase())
  );

  const validateForm = () => {
    if (!formData.date || !formData.time || !formData.appointment_type || !formData.title) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.patient_id && (!formData.patient_name || !formData.phone)) {
      toast({
        title: "Validation Error", 
        description: "Please select an existing patient or provide patient details",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const appointmentData = {
        patient_id: formData.patient_id || null,
        provider_id: formData.provider_id,
        date: format(formData.date, 'yyyy-MM-dd'),
        time: formData.time,
        duration: formData.duration,
        type: mapAppointmentTypeToDbValue(formData.appointment_type), // Use mapped value
        appointment_type: formData.appointment_type, // Keep display value
        title: formData.title,
        notes: formData.notes,
        status: 'scheduled',
        // Include contact info for new patients
        ...((!formData.patient_id) && {
          email: formData.email,
          phone: formData.phone,
          patient_name: formData.patient_name
        })
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Appointment booked successfully",
      });
      
      onSuccess?.(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up Visit', 
    'Spinal Adjustment',
    'Physical Therapy',
    'Pain Management',
    'Wellness Check',
    'Re-evaluation',
    'Emergency Visit'
  ];

  // Map display names to database values
  const mapAppointmentTypeToDbValue = (displayType: string): string => {
    const typeMap: { [key: string]: string } = {
      'Initial Consultation': 'initial-consultation',
      'Follow-up Visit': 'adjustment',
      'Spinal Adjustment': 'adjustment', 
      'Physical Therapy': 'adjustment',
      'Pain Management': 'adjustment',
      'Wellness Check': 'adjustment',
      'Re-evaluation': 'adjustment',
      'Emergency Visit': 'emergency'
    };
    return typeMap[displayType] || 'other';
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <CalendarIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle>Book New Appointment</CardTitle>
            <CardDescription>
              Schedule an appointment for a patient
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Provider Selection */}
          <div className="space-y-2">
            <Label htmlFor="provider">Provider *</Label>
            <Select 
              value={formData.provider_id} 
              onValueChange={(value) => handleInputChange('provider_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Appointment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange('date', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Select 
              value={formData.time} 
              onValueChange={(value) => handleInputChange('time', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableSlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {slot}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select 
              value={formData.duration.toString()} 
              onValueChange={(value) => handleInputChange('duration', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointment Type */}
          <div className="space-y-2">
            <Label htmlFor="appointment_type">Appointment Type *</Label>
            <Select 
              value={formData.appointment_type} 
              onValueChange={(value) => handleInputChange('appointment_type', value)}
            >
              <SelectTrigger>
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

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Appointment Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Initial Consultation"
              required
            />
          </div>

          {/* Patient Selection */}
          <div className="space-y-4">
            <Label>Patient Information *</Label>
            
            {/* Existing Patient Search */}
            <div className="space-y-2">
              <Label htmlFor="search-patient">Search Existing Patient</Label>
              <Input
                id="search-patient"
                placeholder="Search by name or patient number..."
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
              />
              
              {searchPatient && filteredPatients.length > 0 && (
                <div className="border rounded-lg max-h-32 overflow-y-auto">
                  {filteredPatients.slice(0, 5).map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      className="w-full text-left p-2 hover:bg-muted border-b last:border-0"
                      onClick={() => {
                        handleInputChange('patient_id', patient.id);
                        setSearchPatient(`${patient.first_name} ${patient.last_name} (${patient.patient_number})`);
                        // Clear new patient fields
                        handleInputChange('patient_name', '');
                        handleInputChange('phone', '');
                        handleInputChange('email', '');
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{patient.first_name} {patient.last_name}</span>
                        <span className="text-muted-foreground">({patient.patient_number})</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* New Patient Information */}
            {!formData.patient_id && (
              <div className="space-y-4 border-t pt-4">
                <Label className="text-sm font-medium">Or enter new patient details:</Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient_name">Patient Name *</Label>
                    <Input
                      id="patient_name"
                      value={formData.patient_name}
                      onChange={(e) => handleInputChange('patient_name', e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="patient@example.com"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes or special instructions..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
