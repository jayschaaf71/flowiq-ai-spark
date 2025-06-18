
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useProviders } from "@/hooks/useProviders";
import { useAvailability } from "@/hooks/useAvailability";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, CheckCircle, Loader } from "lucide-react";
import { format, addDays } from "date-fns";

interface TimeSlot {
  time: string;
  available: boolean;
  provider?: string;
}

interface BookingData {
  patientName: string;
  phone: string;
  email: string;
  appointmentType: string;
  date: string;
  time: string;
  notes: string;
  providerId: string;
}

interface ProductionBookingInterfaceProps {
  onAppointmentBooked?: () => void;
}

export const ProductionBookingInterface = ({ onAppointmentBooked }: ProductionBookingInterfaceProps) => {
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const { providers, loading: providersLoading } = useProviders();
  const { checkAvailability, loading: availabilityLoading } = useAvailability();
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  
  const [bookingData, setBookingData] = useState<BookingData>({
    patientName: profile?.first_name && profile?.last_name 
      ? `${profile.first_name} ${profile.last_name}` 
      : "",
    phone: profile?.phone || "",
    email: profile?.email || "",
    appointmentType: "",
    date: "",
    time: "",
    notes: "",
    providerId: ""
  });

  const appointmentTypes = [
    { value: "cleaning", label: "Regular Cleaning", duration: 60, price: "$120" },
    { value: "consultation", label: "Consultation", duration: 30, price: "$80" },
    { value: "filling", label: "Filling", duration: 90, price: "$200" },
    { value: "root-canal", label: "Root Canal", duration: 120, price: "$800" },
    { value: "whitening", label: "Teeth Whitening", duration: 45, price: "$300" }
  ];

  // Check availability when provider or date changes
  useEffect(() => {
    if (bookingData.providerId && bookingData.date) {
      const selectedType = appointmentTypes.find(t => t.value === bookingData.appointmentType);
      const duration = selectedType?.duration || 60;
      
      checkAvailability(bookingData.providerId, bookingData.date, duration)
        .then(setAvailableSlots);
    } else {
      setAvailableSlots([]);
    }
  }, [bookingData.providerId, bookingData.date, bookingData.appointmentType]);

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    
    // Clear time selection if provider or date changes
    if ((field === 'providerId' || field === 'date') && bookingData.time) {
      setBookingData(prev => ({ ...prev, time: "" }));
    }
  };

  const validateBooking = (): string | null => {
    if (!bookingData.patientName.trim()) return "Patient name is required";
    if (!bookingData.phone.trim()) return "Phone number is required";
    if (!bookingData.appointmentType) return "Please select an appointment type";
    if (!bookingData.date) return "Please select a date";
    if (!bookingData.time) return "Please select a time";
    if (!bookingData.providerId) return "Please select a provider";
    
    // Validate phone format
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(bookingData.phone)) {
      return "Please enter phone in format: (555) 123-4567";
    }
    
    // Validate email if provided
    if (bookingData.email && !/\S+@\S+\.\S+/.test(bookingData.email)) {
      return "Please enter a valid email address";
    }
    
    return null;
  };

  const handleBookAppointment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    const validationError = validateBooking();
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const selectedProvider = providers.find(p => p.id === bookingData.providerId);
      const selectedType = appointmentTypes.find(t => t.value === bookingData.appointmentType);
      
      const { data, error } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          provider_id: bookingData.providerId,
          title: `${selectedType?.label} with Dr. ${selectedProvider?.last_name}`,
          appointment_type: selectedType?.label || bookingData.appointmentType,
          date: bookingData.date,
          time: bookingData.time,
          duration: selectedType?.duration || 60,
          status: 'pending',
          notes: bookingData.notes,
          phone: bookingData.phone,
          email: bookingData.email
        })
        .select()
        .single();

      if (error) {
        console.error("Booking error:", error);
        throw error;
      }
      
      console.log("Appointment booked successfully:", data);
      
      // Reset form
      setBookingData({
        patientName: profile?.first_name && profile?.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : "",
        phone: profile?.phone || "",
        email: profile?.email || "",
        appointmentType: "",
        date: "",
        time: "",
        notes: "",
        providerId: ""
      });
      
      setAvailableSlots([]);
      
      toast({
        title: "Appointment Booked Successfully!",
        description: `Your ${selectedType?.label} appointment has been scheduled. You'll receive confirmation shortly.`,
      });
      
      // Notify parent component
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
      
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Unable to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const selectedType = appointmentTypes.find(type => type.value === bookingData.appointmentType);
  const selectedProvider = providers.find(p => p.id === bookingData.providerId);

  if (providersLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Book New Appointment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Patient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                placeholder="Enter full name"
                value={bookingData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="(555) 123-4567"
                value={bookingData.phone}
                onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="patient@email.com"
                value={bookingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="appointmentType">Appointment Type *</Label>
              <Select value={bookingData.appointmentType} onValueChange={(value) => handleInputChange('appointmentType', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex justify-between items-center w-full">
                        <span>{type.label}</span>
                        <span className="text-sm text-gray-500 ml-2">{type.duration}min • {type.price}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <Label htmlFor="provider">Provider *</Label>
            <Select value={bookingData.providerId} onValueChange={(value) => handleInputChange('providerId', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div>
                      <div className="font-medium">Dr. {provider.first_name} {provider.last_name}</div>
                      <div className="text-sm text-gray-500">{provider.specialty}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Preferred Date *</Label>
              <Input
                id="date"
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                max={format(addDays(new Date(), 90), "yyyy-MM-dd")}
                value={bookingData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="time">Available Times *</Label>
              <Select 
                value={bookingData.time} 
                onValueChange={(value) => handleInputChange('time', value)}
                disabled={!bookingData.providerId || !bookingData.date || availabilityLoading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={
                    availabilityLoading ? "Checking availability..." : 
                    !bookingData.providerId || !bookingData.date ? "Select provider and date first" :
                    "Select time"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem 
                      key={slot.time} 
                      value={slot.time} 
                      disabled={!slot.available}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {slot.time}
                        {!slot.available && <span className="text-red-500">(Unavailable)</span>}
                      </div>
                    </SelectItem>
                  ))}
                  {availableSlots.length === 0 && bookingData.providerId && bookingData.date && !availabilityLoading && (
                    <SelectItem value="" disabled>
                      No available slots for this date
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Booking Summary */}
          {selectedType && selectedProvider && bookingData.date && bookingData.time && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-900 mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <p><strong>Service:</strong> {selectedType.label} ({selectedType.duration} minutes)</p>
                  <p><strong>Provider:</strong> Dr. {selectedProvider.first_name} {selectedProvider.last_name}</p>
                  <p><strong>Date & Time:</strong> {format(new Date(bookingData.date), "EEEE, MMMM d, yyyy")} at {bookingData.time}</p>
                  <p><strong>Cost:</strong> {selectedType.price}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any special requests or medical conditions to note..."
              value={bookingData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Book Button */}
          <Button 
            onClick={handleBookAppointment}
            disabled={loading || availabilityLoading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Booking Appointment...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Book Appointment
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
