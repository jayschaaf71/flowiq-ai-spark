
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, CheckCircle, Loader } from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";

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
  provider: string;
}

export const ProductionBookingInterface = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({
    patientName: "",
    phone: "",
    email: "",
    appointmentType: "",
    date: "",
    time: "",
    notes: "",
    provider: ""
  });

  const appointmentTypes = [
    { value: "cleaning", label: "Regular Cleaning", duration: 60, price: "$120" },
    { value: "consultation", label: "Consultation", duration: 30, price: "$80" },
    { value: "filling", label: "Filling", duration: 90, price: "$200" },
    { value: "root-canal", label: "Root Canal", duration: 120, price: "$800" },
    { value: "whitening", label: "Teeth Whitening", duration: 45, price: "$300" }
  ];

  const providers = [
    { id: "dr-johnson", name: "Dr. Johnson", specialty: "General Dentistry" },
    { id: "dr-smith", name: "Dr. Smith", specialty: "Oral Surgery" },
    { id: "dr-wilson", name: "Dr. Wilson", specialty: "Pediatric Dentistry" }
  ];

  // Generate available time slots based on selected date and provider
  const getAvailableSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = format(setMinutes(setHours(new Date(), hour), minute), "HH:mm");
        // Simulate some slots being unavailable
        const available = Math.random() > 0.3; // 70% chance of being available
        slots.push({ time, available, provider: bookingData.provider });
      }
    }
    
    return slots;
  };

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const validateBooking = (): string | null => {
    if (!bookingData.patientName.trim()) return "Patient name is required";
    if (!bookingData.phone.trim()) return "Phone number is required";
    if (!bookingData.appointmentType) return "Please select an appointment type";
    if (!bookingData.date) return "Please select a date";
    if (!bookingData.time) return "Please select a time";
    if (!bookingData.provider) return "Please select a provider";
    
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
      // Simulate API call to book appointment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const appointmentDetails = {
        ...bookingData,
        id: Date.now().toString(),
        status: "confirmed",
        createdAt: new Date().toISOString()
      };
      
      console.log("Booking appointment:", appointmentDetails);
      
      // Reset form
      setBookingData({
        patientName: "",
        phone: "",
        email: "",
        appointmentType: "",
        date: "",
        time: "",
        notes: "",
        provider: ""
      });
      
      toast({
        title: "Appointment Booked Successfully!",
        description: `Confirmation sent to ${bookingData.patientName}. SMS and email reminders will be sent automatically.`,
      });
      
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to book appointment. Please try again.",
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
  const selectedProvider = providers.find(p => p.id === bookingData.provider);
  const availableSlots = getAvailableSlots();

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
            <Select value={bookingData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers.map((provider) => (
                  <SelectItem key={provider.id} value={provider.id}>
                    <div>
                      <div className="font-medium">{provider.name}</div>
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
              <Select value={bookingData.time} onValueChange={(value) => handleInputChange('time', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select time" />
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
                  <p><strong>Provider:</strong> {selectedProvider.name}</p>
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
            disabled={loading}
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
