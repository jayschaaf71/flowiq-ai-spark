
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAvailabilitySlots } from "@/hooks/useAvailabilitySlots";
import { useNotificationQueue } from "@/hooks/useNotificationQueue";
import { Calendar, Clock, User, Phone, Mail, CreditCard, CheckCircle, AlertTriangle } from "lucide-react";
import { format, addDays } from "date-fns";

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface EnhancedBookingFlowProps {
  onComplete?: (appointmentId: string) => void;
  preselectedDate?: Date;
  preselectedTime?: string;
}

export const EnhancedBookingFlow = ({ onComplete, preselectedDate, preselectedTime }: EnhancedBookingFlowProps) => {
  const { toast } = useToast();
  const { slots, loadAvailabilitySlots, bookSlot } = useAvailabilitySlots();
  const { scheduleAppointmentReminders } = useNotificationQueue();

  const [currentStep, setCurrentStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    patientInfo: {
      name: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      isNewPatient: true
    },
    appointmentInfo: {
      type: '',
      date: preselectedDate ? format(preselectedDate, 'yyyy-MM-dd') : '',
      time: preselectedTime || '',
      duration: 60,
      notes: '',
      providerId: ''
    },
    preferences: {
      reminderEmail: true,
      reminderSms: true,
      confirmationRequired: true
    },
    payment: {
      requiresDeposit: false,
      depositAmount: 0,
      paymentMethod: ''
    }
  });

  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);

  const steps: BookingStep[] = [
    {
      id: 'patient-info',
      title: 'Patient Information',
      description: 'Basic patient details and contact information',
      completed: false
    },
    {
      id: 'appointment-details',
      title: 'Appointment Details',
      description: 'Select appointment type, date, and time',
      completed: false
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Notification and reminder preferences',
      completed: false
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Review and confirm appointment details',
      completed: false
    }
  ];

  const appointmentTypes = [
    { value: 'consultation', label: 'Initial Consultation', duration: 60, deposit: 50 },
    { value: 'follow-up', label: 'Follow-up Visit', duration: 30, deposit: 0 },
    { value: 'treatment', label: 'Treatment Session', duration: 90, deposit: 100 },
    { value: 'emergency', label: 'Emergency Appointment', duration: 45, deposit: 25 }
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Patient Info
        return bookingData.patientInfo.name && 
               bookingData.patientInfo.email && 
               bookingData.patientInfo.phone;
      case 1: // Appointment Details
        return bookingData.appointmentInfo.type && 
               bookingData.appointmentInfo.date && 
               bookingData.appointmentInfo.time;
      case 2: // Preferences
        return true; // No required fields
      case 3: // Confirmation
        return true;
      default:
        return true;
    }
  };

  const checkForConflicts = async () => {
    if (!bookingData.appointmentInfo.date || !bookingData.appointmentInfo.time) return;

    // Check for scheduling conflicts
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('*')
      .eq('date', bookingData.appointmentInfo.date)
      .eq('time', bookingData.appointmentInfo.time);

    if (existingAppointments && existingAppointments.length > 0) {
      setConflicts(['Time slot already booked']);
    } else {
      setConflicts([]);
    }
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      toast({
        title: "Please complete required fields",
        description: "All required information must be filled out to continue.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 1) {
      await checkForConflicts();
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleBookingComplete();
    }
  };

  const handleBookingComplete = async () => {
    setLoading(true);
    try {
      // Create the appointment
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          title: bookingData.patientInfo.name,
          appointment_type: bookingData.appointmentInfo.type,
          date: bookingData.appointmentInfo.date,
          time: bookingData.appointmentInfo.time,
          duration: bookingData.appointmentInfo.duration,
          notes: bookingData.appointmentInfo.notes,
          phone: bookingData.patientInfo.phone,
          email: bookingData.patientInfo.email,
          status: 'pending',
          patient_id: '00000000-0000-0000-0000-000000000000' // Would be actual patient ID
        })
        .select()
        .single();

      if (appointmentError) throw appointmentError;

      // Schedule reminders if enabled
      if (appointment && (bookingData.preferences.reminderEmail || bookingData.preferences.reminderSms)) {
        const appointmentDateTime = new Date(`${bookingData.appointmentInfo.date}T${bookingData.appointmentInfo.time}`);
        
        await scheduleAppointmentReminders(
          appointment.id,
          appointmentDateTime,
          bookingData.patientInfo.email,
          bookingData.preferences.reminderSms ? bookingData.patientInfo.phone : undefined
        );
      }

      // Book availability slot if using slot system
      const matchingSlot = slots.find(slot => 
        slot.date === bookingData.appointmentInfo.date && 
        slot.start_time === bookingData.appointmentInfo.time
      );
      
      if (matchingSlot) {
        await bookSlot(matchingSlot.id, appointment.id);
      }

      toast({
        title: "Appointment Booked Successfully!",
        description: `Your appointment is scheduled for ${format(new Date(bookingData.appointmentInfo.date), 'MMMM d, yyyy')} at ${bookingData.appointmentInfo.time}`,
      });

      if (onComplete) {
        onComplete(appointment.id);
      }

    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Patient Information
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={bookingData.patientInfo.name}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    patientInfo: { ...prev.patientInfo, name: e.target.value }
                  }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={bookingData.patientInfo.email}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    patientInfo: { ...prev.patientInfo, email: e.target.value }
                  }))}
                  placeholder="Enter your email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={bookingData.patientInfo.phone}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    patientInfo: { ...prev.patientInfo, phone: e.target.value }
                  }))}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={bookingData.patientInfo.dateOfBirth}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    patientInfo: { ...prev.patientInfo, dateOfBirth: e.target.value }
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 1: // Appointment Details
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Appointment Type *</Label>
              <Select
                value={bookingData.appointmentInfo.type}
                onValueChange={(value) => {
                  const selectedType = appointmentTypes.find(type => type.value === value);
                  setBookingData(prev => ({
                    ...prev,
                    appointmentInfo: { 
                      ...prev.appointmentInfo, 
                      type: value,
                      duration: selectedType?.duration || 60
                    },
                    payment: {
                      ...prev.payment,
                      requiresDeposit: (selectedType?.deposit || 0) > 0,
                      depositAmount: selectedType?.deposit || 0
                    }
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select appointment type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{type.label}</span>
                        <div className="flex gap-2 ml-4">
                          <Badge variant="secondary">{type.duration}min</Badge>
                          {type.deposit > 0 && (
                            <Badge variant="outline">${type.deposit} deposit</Badge>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date *</Label>
                <Input
                  id="date"
                  type="date"
                  min={format(new Date(), 'yyyy-MM-dd')}
                  max={format(addDays(new Date(), 90), 'yyyy-MM-dd')}
                  value={bookingData.appointmentInfo.date}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    appointmentInfo: { ...prev.appointmentInfo, date: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time *</Label>
                <Select
                  value={bookingData.appointmentInfo.time}
                  onValueChange={(value) => setBookingData(prev => ({
                    ...prev,
                    appointmentInfo: { ...prev.appointmentInfo, time: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={bookingData.appointmentInfo.notes}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  appointmentInfo: { ...prev.appointmentInfo, notes: e.target.value }
                }))}
                placeholder="Any additional information or special requests"
                rows={3}
              />
            </div>

            {conflicts.length > 0 && (
              <Alert variant="destructive">
                <AlertTriangle className="w-4 h-4" />
                <AlertDescription>
                  {conflicts.join(', ')}. Please select a different time slot.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 2: // Preferences
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notification Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Reminders</Label>
                  <p className="text-sm text-gray-600">Receive appointment reminders via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={bookingData.preferences.reminderEmail}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, reminderEmail: e.target.checked }
                  }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Reminders</Label>
                  <p className="text-sm text-gray-600">Receive appointment reminders via text message</p>
                </div>
                <input
                  type="checkbox"
                  checked={bookingData.preferences.reminderSms}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, reminderSms: e.target.checked }
                  }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Confirmation Required</Label>
                  <p className="text-sm text-gray-600">Require confirmation before appointment</p>
                </div>
                <input
                  type="checkbox"
                  checked={bookingData.preferences.confirmationRequired}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, confirmationRequired: e.target.checked }
                  }))}
                  className="rounded"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Confirmation
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Confirm Your Appointment</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{bookingData.patientInfo.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span>{bookingData.patientInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-600" />
                <span>{bookingData.patientInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span>
                  {format(new Date(bookingData.appointmentInfo.date), 'MMMM d, yyyy')} at {bookingData.appointmentInfo.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span>
                  {appointmentTypes.find(t => t.value === bookingData.appointmentInfo.type)?.label} 
                  ({bookingData.appointmentInfo.duration} minutes)
                </span>
              </div>
            </div>

            {bookingData.payment.requiresDeposit && (
              <Alert>
                <CreditCard className="w-4 h-4" />
                <AlertDescription>
                  A deposit of ${bookingData.payment.depositAmount} is required to secure this appointment.
                </AlertDescription>
              </Alert>
            )}

            {bookingData.appointmentInfo.notes && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Additional Notes:</h4>
                <p className="text-gray-700">{bookingData.appointmentInfo.notes}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Book Your Appointment
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${index <= currentStep 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`
                  w-8 h-0.5 mx-4
                  ${index < currentStep ? 'bg-purple-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[400px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={loading || (currentStep === 1 && conflicts.length > 0)}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Booking...
              </div>
            ) : currentStep === steps.length - 1 ? (
              'Confirm Booking'
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
