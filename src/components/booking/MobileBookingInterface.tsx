
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, isSameDay, parseISO } from "date-fns";

interface MobileBookingInterfaceProps {
  onAppointmentBooked?: () => void;
}

export const MobileBookingInterface = ({ onAppointmentBooked }: MobileBookingInterfaceProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [providers, setProviders] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [patientInfo, setPatientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    appointmentType: "consultation",
    notes: ""
  });

  useEffect(() => {
    loadProviders();
  }, []);

  useEffect(() => {
    if (selectedProvider && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedProvider, selectedDate]);

  const loadProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      if (error) throw error;
      setProviders(data || []);
      if (data && data.length > 0) {
        setSelectedProvider(data[0].id);
      }
    } catch (error) {
      console.error('Error loading providers:', error);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedProvider || !selectedDate) return;

    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const { data: appointments, error } = await supabase
        .from('appointments')
        .select('time')
        .eq('provider_id', selectedProvider)
        .eq('date', dateStr)
        .in('status', ['confirmed', 'pending']);

      if (error) throw error;

      const bookedTimes = appointments?.map(apt => apt.time) || [];
      const allSlots = [];
      
      // Generate slots from 9 AM to 5 PM
      for (let hour = 9; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          if (!bookedTimes.includes(timeStr)) {
            allSlots.push(timeStr);
          }
        }
      }
      
      setAvailableSlots(allSlots);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!selectedProvider || !selectedDate || !selectedTime || !patientInfo.name || !patientInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: appointment, error } = await supabase
        .from('appointments')
        .insert({
          provider_id: selectedProvider,
          title: `${patientInfo.appointmentType} - ${patientInfo.name}`,
          appointment_type: patientInfo.appointmentType,
          date: format(selectedDate, 'yyyy-MM-dd'),
          time: selectedTime,
          duration: 60,
          status: 'confirmed',
          notes: patientInfo.notes,
          email: patientInfo.email,
          phone: patientInfo.phone
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: "We'll send you a confirmation email shortly.",
      });

      setCurrentStep(4);
      onAppointmentBooked?.();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      dates.push(addDays(new Date(), i));
    }
    return dates;
  };

  const formatTimeDisplay = (time: string) => {
    return format(parseISO(`2000-01-01T${time}`), 'h:mm a');
  };

  const stepTitles = [
    "Choose Provider",
    "Select Date & Time", 
    "Your Information",
    "Confirmation"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Mobile-friendly header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Book Appointment</h1>
          <Badge variant="outline" className="text-xs">
            Step {currentStep} of 4
          </Badge>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
        
        <p className="text-sm text-gray-600 mt-2 text-center">
          {stepTitles[currentStep - 1]}
        </p>
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Choose Your Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedProvider === provider.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <div className="font-semibold text-base">
                    Dr. {provider.first_name} {provider.last_name}
                  </div>
                  <div className="text-sm text-gray-600">{provider.specialty}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {generateDates().map((date) => (
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

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Available Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading times...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((time) => (
                      <button
                        key={time}
                        className={`p-3 text-sm border rounded-lg transition-all ${
                          selectedTime === time
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {formatTimeDisplay(time)}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Phone Number</Label>
                <Input
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label>Appointment Type</Label>
                <Select 
                  value={patientInfo.appointmentType} 
                  onValueChange={(value) => setPatientInfo(prev => ({ ...prev, appointmentType: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">New Patient Consultation</SelectItem>
                    <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                    <SelectItem value="checkup">Regular Checkup</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Additional Notes (Optional)</Label>
                <Input
                  value={patientInfo.notes}
                  onChange={(e) => setPatientInfo(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any special requests or notes..."
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-green-600">
                <CheckCircle className="w-5 h-5" />
                Appointment Confirmed!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="font-semibold">{patientInfo.name}</p>
                <p className="text-sm text-gray-600">
                  {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {formatTimeDisplay(selectedTime)}
                </p>
                <p className="text-sm text-gray-600">
                  with {providers.find(p => p.id === selectedProvider)?.first_name} {providers.find(p => p.id === selectedProvider)?.last_name}
                </p>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>✓ Confirmation email sent to {patientInfo.email}</p>
                <p>✓ Reminder will be sent 24 hours before</p>
                <p>✓ You can reschedule anytime by calling us</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation buttons */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            
            <Button
              onClick={() => {
                if (currentStep === 3) {
                  bookAppointment();
                } else {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={
                loading ||
                (currentStep === 1 && !selectedProvider) ||
                (currentStep === 2 && (!selectedDate || !selectedTime)) ||
                (currentStep === 3 && (!patientInfo.name || !patientInfo.email))
              }
              className="flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Booking...
                </>
              ) : currentStep === 3 ? (
                "Book Appointment"
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
