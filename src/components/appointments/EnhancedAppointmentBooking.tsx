import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useFormValidation } from '@/hooks/useFormValidation';
import { appointmentFormSchema, type AppointmentFormData } from '@/utils/validation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLoadingState } from '@/hooks/useLoadingState';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Users,
  Loader2
} from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  specialty?: string;
}

interface AvailableSlot {
  time_slot: string;
  is_available: boolean;
  appointment_id?: string;
}

interface EnhancedAppointmentBookingProps {
  onSuccess?: (appointment: any) => void;
  onCancel?: () => void;
  selectedDate?: Date;
  selectedTime?: string;
  selectedProvider?: string;
}

export const EnhancedAppointmentBooking: React.FC<EnhancedAppointmentBookingProps> = ({
  onSuccess,
  onCancel,
  selectedDate,
  selectedTime,
  selectedProvider
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_name: '',
    email: '',
    phone: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '',
    time: selectedTime || '',
    appointment_type: '',
    duration: 60,
    notes: ''
  });

  const [providers, setProviders] = useState<Provider[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState(selectedProvider || '');
  
  const { setLoading, isLoading } = useLoadingState(['providers', 'slots', 'booking']);
  const { toast } = useToast();

  const {
    errors,
    isSubmitting,
    handleSubmit,
    validateField,
    clearFieldError
  } = useFormValidation({
    schema: appointmentFormSchema,
    onSubmit: handleBooking
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    if (selectedProviderId && formData.date) {
      fetchAvailableSlots();
    }
  }, [selectedProviderId, formData.date]);

  const fetchProviders = async () => {
    try {
      setLoading('providers', true);
      const { data, error } = await supabase
        .from('providers')
        .select('id, first_name, last_name, specialty')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      
      setProviders(data?.map(provider => ({
        id: provider.id,
        name: `${provider.first_name} ${provider.last_name}`,
        specialty: provider.specialty
      })) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    } finally {
      setLoading('providers', false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedProviderId || !formData.date) return;

    try {
      setLoading('slots', true);
      
      // Use the new real-time availability function
      const { data, error } = await supabase
        .rpc('get_available_slots', {
          p_provider_id: selectedProviderId,
          p_date: formData.date,
          p_duration: formData.duration
        });

      if (error) throw error;
      
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      toast({
        title: "Error",
        description: "Failed to load available time slots",
        variant: "destructive",
      });
    } finally {
      setLoading('slots', false);
    }
  };

  async function handleBooking(validatedData: AppointmentFormData) {
    try {
      setLoading('booking', true);

      // Create appointment with enhanced data
      const appointmentData = {
        patient_name: validatedData.patient_name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        date: validatedData.date,
        time: validatedData.time,
        duration: validatedData.duration,
        appointment_type: validatedData.appointment_type,
        title: `${validatedData.appointment_type} - ${validatedData.patient_name}`,
        notes: validatedData.notes || null,
        provider_id: selectedProviderId,
        status: 'scheduled'
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select(`
          *,
          provider:providers(first_name, last_name, specialty)
        `)
        .single();

      if (error) throw error;

      toast({
        title: "Appointment Booked Successfully!",
        description: "Confirmation email will be sent shortly with appointment details.",
        duration: 5000,
      });

      onSuccess?.(data);
      
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading('booking', false);
    }
  }

  const handleInputChange = (field: keyof AppointmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearFieldError(field);
    
    // Validate field in real-time
    const error = validateField(field, value);
    if (error) {
      // Don't show errors immediately, let user finish typing
      setTimeout(() => validateField(field, value), 1000);
    }
  };

  const appointmentTypes = [
    'Initial Consultation',
    'Follow-up Visit',
    'Physical Therapy', 
    'Wellness Check',
    'Emergency Visit',
    'Telemedicine',
    'Specialist Consultation'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle>Enhanced Appointment Booking</CardTitle>
              <CardDescription>
                Real-time availability with automated reminders and waitlist management
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Provider Selection */}
              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Select 
                  value={selectedProviderId} 
                  onValueChange={(value) => {
                    setSelectedProviderId(value);
                    setAvailableSlots([]); // Clear slots when provider changes
                  }}
                  disabled={isLoading('providers')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoading('providers') ? "Loading providers..." : "Select a provider"} />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{provider.name}</span>
                          {provider.specialty && (
                            <Badge variant="secondary" className="ml-2">
                              {provider.specialty}
                            </Badge>
                          )}
                        </div>
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
                      {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date ? new Date(formData.date) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          handleInputChange('date', format(date, 'yyyy-MM-dd'));
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>

              {/* Time Selection */}
              <div className="space-y-2">
                <Label htmlFor="time">Available Time Slots *</Label>
                {isLoading('slots') ? (
                  <div className="flex items-center gap-2 p-4 border rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading available slots...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.filter(slot => slot.is_available).map((slot) => (
                      <Button
                        key={slot.time_slot}
                        type="button"
                        variant={formData.time === slot.time_slot ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('time', slot.time_slot)}
                        className="justify-start"
                      >
                        <Clock className="mr-2 h-3 w-3" />
                        {slot.time_slot}
                      </Button>
                    ))}
                  </div>
                )}
                {!selectedProviderId && (
                  <p className="text-sm text-muted-foreground">Please select a provider first</p>
                )}
                {selectedProviderId && !formData.date && (
                  <p className="text-sm text-muted-foreground">Please select a date first</p>
                )}
                {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
              </div>

              {/* Duration & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Select 
                    value={formData.duration.toString()} 
                    onValueChange={(value) => {
                      handleInputChange('duration', parseInt(value));
                      // Refresh slots when duration changes
                      if (selectedProviderId && formData.date) {
                        fetchAvailableSlots();
                      }
                    }}
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

                <div className="space-y-2">
                  <Label htmlFor="appointment_type">Type *</Label>
                  <Select 
                    value={formData.appointment_type} 
                    onValueChange={(value) => handleInputChange('appointment_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.appointment_type && <p className="text-sm text-destructive">{errors.appointment_type}</p>}
                </div>
              </div>

              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Patient Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="patient_name">Full Name *</Label>
                  <Input
                    id="patient_name"
                    value={formData.patient_name}
                    onChange={(e) => handleInputChange('patient_name', e.target.value)}
                    placeholder="Enter patient's full name"
                    className={errors.patient_name ? "border-destructive" : ""}
                  />
                  {errors.patient_name && <p className="text-sm text-destructive">{errors.patient_name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="patient@example.com"
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requirements or notes..."
                    rows={3}
                    className={errors.notes ? "border-destructive" : ""}
                  />
                  {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking Appointment...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Book Appointment
                    </>
                  )}
                </Button>
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Features Sidebar */}
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Real-time Availability</h4>
                <p className="text-sm text-muted-foreground">
                  See exactly which time slots are available as you select dates
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Automated Reminders</h4>
                <p className="text-sm text-muted-foreground">
                  Receive email and SMS reminders 24 hours and 2 hours before your appointment
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Intelligent Waitlist</h4>
                <p className="text-sm text-muted-foreground">
                  Get notified when earlier slots become available due to cancellations
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Conflict Prevention</h4>
                <p className="text-sm text-muted-foreground">
                  Smart scheduling prevents double-booking and scheduling conflicts
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};