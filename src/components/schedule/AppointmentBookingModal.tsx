import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  selectedTime?: string;
  onAppointmentBooked: (appointment: any) => void;
}

export const AppointmentBookingModal = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  selectedTime,
  onAppointmentBooked 
}: AppointmentBookingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    phone: '',
    providerId: '',
    appointmentType: 'consultation',
    duration: 60,
    notes: '',
    date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    time: selectedTime || '09:00'
  });

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadProviders();
      if (selectedDate) {
        setFormData(prev => ({ ...prev, date: format(selectedDate, 'yyyy-MM-dd') }));
      }
      if (selectedTime) {
        setFormData(prev => ({ ...prev, time: selectedTime }));
      }
    }
  }, [isOpen, selectedDate, selectedTime]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setProviders(data || []);
      if (data && data.length > 0 && !formData.providerId) {
        setFormData(prev => ({ ...prev, providerId: data[0].id }));
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const createOrFindPatient = async (patientData: any) => {
    console.log('Creating or finding patient with data:', patientData);
    
    // First, try to find existing patient by email
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('email', patientData.email)
      .maybeSingle();

    if (existingPatient) {
      console.log('Found existing patient:', existingPatient.id);
      return existingPatient.id;
    }

    // Create new patient
    const nameParts = patientData.patientName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const newPatientData = {
      first_name: firstName,
      last_name: lastName,
      email: patientData.email,
      phone: patientData.phone || null,
      date_of_birth: '1990-01-01', // Default date, should be collected in a real app
      gender: 'not_specified'
    };

    console.log('Creating new patient:', newPatientData);

    const { data: newPatient, error: patientError } = await supabase
      .from('patients')
      .insert(newPatientData)
      .select('id')
      .single();

    if (patientError) {
      console.error('Patient creation error:', patientError);
      throw patientError;
    }

    console.log('Created new patient with ID:', newPatient.id);
    return newPatient.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patientName || !formData.email || !formData.providerId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('Starting appointment booking process...');
      
      // Create or find patient first
      const patientId = await createOrFindPatient({
        patientName: formData.patientName,
        email: formData.email,
        phone: formData.phone
      });

      // Create appointment with the patient ID
      const appointmentData = {
        patient_id: patientId,
        provider_id: formData.providerId,
        date: formData.date,
        time: formData.time,
        duration: formData.duration,
        title: formData.patientName,
        appointment_type: formData.appointmentType,
        status: 'confirmed',
        email: formData.email,
        phone: formData.phone,
        notes: formData.notes
      };

      console.log('Creating appointment with data:', appointmentData);

      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert(appointmentData)
        .select()
        .single();

      if (appointmentError) {
        console.error('Appointment creation error:', appointmentError);
        throw appointmentError;
      }

      console.log('Appointment created successfully:', appointment);

      toast({
        title: "Appointment Booked!",
        description: `Successfully scheduled ${formData.patientName} for ${format(parseISO(formData.date), 'MMM d, yyyy')} at ${formData.time}`,
      });

      onAppointmentBooked(appointment);
      onClose();
      
      // Reset form
      setFormData({
        patientName: '',
        email: '',
        phone: '',
        providerId: providers[0]?.id || '',
        appointmentType: 'consultation',
        duration: 60,
        notes: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        time: '09:00'
      });

    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: `There was an error booking the appointment: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'procedure', label: 'Procedure' },
    { value: 'screening', label: 'Screening' },
    { value: 'emergency', label: 'Emergency' }
  ];

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book New Appointment
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patientName">Patient Name *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    placeholder="patient@email.com"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider">Provider *</Label>
                <Select value={formData.providerId} onValueChange={(value) => setFormData(prev => ({ ...prev, providerId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.first_name} {provider.last_name} - {provider.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointmentType">Appointment Type</Label>
                <Select value={formData.appointmentType} onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
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
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select value={formData.duration.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value.toString()}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes or special requirements..."
                rows={3}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
