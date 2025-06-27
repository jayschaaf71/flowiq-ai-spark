import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, parseISO, isSameDay } from "date-fns";
import { useAuth } from "@/hooks/useAuth";

interface TimeSlot {
  time: string;
  available: boolean;
  providerId?: string;
  providerName?: string;
}

interface SchedulingEngineProps {
  onAppointmentBooked: (appointment: any) => void;
}

export const SchedulingEngine = ({ onAppointmentBooked }: SchedulingEngineProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    appointmentType: 'consultation'
  });
  const { toast } = useToast();
  const { user, profile } = useAuth();

  useEffect(() => {
    loadProviders();
    
    // Pre-fill user data if available
    if (profile) {
      setPatientInfo(prev => ({
        ...prev,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || prev.name,
        email: profile.email || prev.email,
        phone: profile.phone || prev.phone
      }));
    }
  }, [profile]);

  useEffect(() => {
    if (selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDate, selectedProvider]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setProviders(data || []);
      if (data && data.length > 0) {
        setSelectedProvider(data[0].id);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive",
      });
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedDate || !selectedProvider) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      // Get existing appointments for this date and provider
      const { data: appointments, error: apptError } = await supabase
        .from('appointments')
        .select('time, duration')
        .eq('provider_id', selectedProvider)
        .eq('date', dateStr)
        .in('status', ['confirmed', 'pending']);

      if (apptError) throw apptError;

      // Get provider info
      const provider = providers.find(p => p.id === selectedProvider);
      const providerName = provider ? `${provider.first_name} ${provider.last_name}` : 'Provider';

      // Generate time slots (9 AM to 5 PM, 30-minute intervals)
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Check if this slot is taken
          const isBooked = appointments?.some(apt => apt.time === timeStr);
          
          slots.push({
            time: timeStr,
            available: !isBooked,
            providerId: selectedProvider,
            providerName
          });
        }
      }

      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error loading availability:', error);
      toast({
        title: "Error",
        description: "Failed to load availability",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!selectedSlot || !patientInfo.name || !patientInfo.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book appointments",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Check if user has a patient record, create one if needed
      let patientId = null;
      
      const { data: existingPatient, error: patientCheckError } = await supabase
        .from('patients')
        .select('id')
        .eq('profile_id', user.id)
        .single();

      if (patientCheckError && patientCheckError.code === 'PGRST116') {
        // Create new patient linked to user profile
        const [firstName, ...lastNameParts] = patientInfo.name.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        
        const { data: newPatient, error: patientError } = await supabase
          .from('patients')
          .insert({
            profile_id: user.id,
            first_name: firstName,
            last_name: lastName,
            email: patientInfo.email,
            phone: patientInfo.phone,
            date_of_birth: '1990-01-01' // Default, will be updated during intake
          })
          .select()
          .single();

        if (patientError) throw patientError;
        patientId = newPatient.id;
      } else if (!patientCheckError) {
        patientId = existingPatient.id;
      }

      // Create appointment with both profile_id and patient_id
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          profile_id: user.id, // Direct link to user profile
          patient_id: patientId, // Link to patient record if exists
          provider_id: selectedProvider,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedSlot,
          duration: 60,
          title: patientInfo.name,
          appointment_type: patientInfo.appointmentType,
          status: 'confirmed',
          email: patientInfo.email,
          phone: patientInfo.phone
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      toast({
        title: "Appointment Booked",
        description: `Successfully booked appointment for ${patientInfo.name}`,
      });

      onAppointmentBooked(appointment);
      
      // Reset form
      setPatientInfo({ name: '', email: '', phone: '', appointmentType: 'consultation' });
      setSelectedSlot(null);
      loadAvailableSlots(); // Refresh availability

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  return (
    <div className="space-y-6">
      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Select Provider
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedProvider === provider.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedProvider(provider.id)}
              >
                <h3 className="font-semibold">{provider.first_name} {provider.last_name}</h3>
                <p className="text-sm text-gray-600">{provider.specialty}</p>
                <p className="text-xs text-gray-500 mt-1">
                  <Mail className="w-3 h-3 inline mr-1" />
                  {provider.email}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {generateDateOptions().map((date) => (
              <button
                key={date.toISOString()}
                className={`p-3 text-center border rounded-lg transition-all ${
                  isSameDay(selectedDate, date)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="text-xs text-gray-500">
                  {format(date, 'EEE')}
                </div>
                <div className="font-semibold">
                  {format(date, 'd')}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Slot Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Select Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading availability...</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  className={`p-2 text-sm border rounded-lg transition-all ${
                    selectedSlot === slot.time
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : slot.available
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => slot.available && setSelectedSlot(slot.time)}
                >
                  {format(parseISO(`2000-01-01T${slot.time}`), 'h:mm a')}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Information */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.email}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                className="w-full p-2 border rounded-lg"
                value={patientInfo.phone}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Appointment Type</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={patientInfo.appointmentType}
                onChange={(e) => setPatientInfo(prev => ({ ...prev, appointmentType: e.target.value }))}
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="procedure">Procedure</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary */}
      {selectedSlot && selectedProvider && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Provider:</strong> {availableSlots.find(s => s.time === selectedSlot)?.providerName}</p>
              <p><strong>Date:</strong> {format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {format(parseISO(`2000-01-01T${selectedSlot}`), 'h:mm a')}</p>
              <p><strong>Duration:</strong> 60 minutes</p>
              <p><strong>Type:</strong> {patientInfo.appointmentType}</p>
            </div>
            <Button
              onClick={bookAppointment}
              disabled={loading || !patientInfo.name || !patientInfo.email}
              className="w-full mt-4"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
