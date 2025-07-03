import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  Clock, 
  User, 
  Mic, 
  Phone, 
  Mail, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  MapPin,
  CreditCard,
  Shield,
  Sparkles,
  MicIcon
} from 'lucide-react';

interface BookingData {
  appointmentType: string;
  provider: string;
  date: string;
  time: string;
  patientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    insurance: string;
  };
  notes: string;
}

export const EnhancedMobileBooking: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [currentStep, setCurrentStep] = useState(1);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceField, setVoiceField] = useState<string | null>(null);

  const [bookingData, setBookingData] = useState<BookingData>({
    appointmentType: '',
    provider: '',
    date: '',
    time: '',
    patientInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      insurance: ''
    },
    notes: ''
  });

  const appointmentTypes = [
    { value: 'new-patient', label: 'New Patient Consultation', duration: '60 min', icon: '👋' },
    { value: 'follow-up', label: 'Follow-up Visit', duration: '30 min', icon: '🔄' },
    { value: 'checkup', label: 'Annual Checkup', duration: '45 min', icon: '❤️' },
    { value: 'urgent', label: 'Urgent Care', duration: '30 min', icon: '🚨' },
    { value: 'telemedicine', label: 'Telemedicine', duration: '30 min', icon: '💻' }
  ];

  const providers = [
    { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Internal Medicine', rating: 4.9, nextAvailable: '9:00 AM' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Cardiology', rating: 4.8, nextAvailable: '10:30 AM' },
    { id: '3', name: 'Dr. Emily Davis', specialty: 'Family Medicine', rating: 4.9, nextAvailable: '2:00 PM' }
  ];

  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const steps = [
    { title: 'Appointment Type', description: 'Choose the type of visit' },
    { title: 'Select Provider', description: 'Choose your healthcare provider' },
    { title: 'Pick Date & Time', description: 'Select when you\'d like to come in' },
    { title: 'Your Information', description: 'Tell us about yourself' },
    { title: 'Confirmation', description: 'Review and confirm your appointment' }
  ];

  const handleVoiceInput = (fieldName: string) => {
    setVoiceField(fieldName);
    setIsVoiceActive(true);
    
    toast({
      title: "Voice Input Active",
      description: `Speaking for ${fieldName}. Tap again to stop.`,
    });

    // Simulate voice transcription after 3 seconds
    setTimeout(() => {
      setIsVoiceActive(false);
      setVoiceField(null);
      
      // Mock voice input based on field
      const mockInputs: Record<string, string> = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '555-123-4567',
        insurance: 'Blue Cross Blue Shield',
        notes: 'I have been experiencing some back pain and would like to get it checked out.'
      };

      if (mockInputs[fieldName]) {
        if (fieldName === 'notes') {
          setBookingData(prev => ({ ...prev, notes: mockInputs[fieldName] }));
        } else {
          setBookingData(prev => ({
            ...prev,
            patientInfo: {
              ...prev.patientInfo,
              [fieldName]: mockInputs[fieldName]
            }
          }));
        }
        
        toast({
          title: "Voice Input Complete",
          description: `"${mockInputs[fieldName]}" has been entered`,
        });
      }
    }, 3000);
  };

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1: return bookingData.appointmentType !== '';
      case 2: return bookingData.provider !== '';
      case 3: return bookingData.date !== '' && bookingData.time !== '';
      case 4: return (
        bookingData.patientInfo.firstName !== '' &&
        bookingData.patientInfo.lastName !== '' &&
        bookingData.patientInfo.email !== '' &&
        bookingData.patientInfo.phone !== ''
      );
      default: return true;
    }
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Appointment Booked!",
      description: "Your appointment has been successfully scheduled.",
    });
    
    setCurrentStep(5);
    setIsSubmitting(false);
  };

  const progressPercentage = (currentStep / 5) * 100;

  if (!isMobile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Mobile Booking - Desktop Version</h1>
        <div className="text-center p-8 bg-muted rounded-lg">
          <p>This is the mobile booking interface. Please use a mobile device for the optimized experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Book Appointment</h1>
              <p className="text-xs text-muted-foreground">Voice-enabled booking</p>
            </div>
          </div>
          
          <Badge variant="outline" className="text-xs">
            Step {currentStep} of 5
          </Badge>
        </div>
        
        <div className="mt-3">
          <Progress value={progressPercentage} className="h-1" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Step 1: Appointment Type */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Choose Appointment Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointmentTypes.map((type) => (
                <div
                  key={type.value}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    bookingData.appointmentType === type.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80'
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, appointmentType: type.value }))}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{type.label}</h3>
                      <p className="text-sm text-muted-foreground">{type.duration}</p>
                    </div>
                    {bookingData.appointmentType === type.value && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Provider Selection */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Select Provider
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                    bookingData.provider === provider.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80'
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, provider: provider.id }))}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{provider.name}</h3>
                      <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-warning">⭐ {provider.rating}</span>
                        <span className="text-xs text-muted-foreground">Next: {provider.nextAvailable}</span>
                      </div>
                    </div>
                    {bookingData.provider === provider.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Date & Time */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {generateDates().map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    return (
                      <button
                        key={dateStr}
                        className={`p-2 text-center border rounded-lg transition-all ${
                          bookingData.date === dateStr
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-border/80'
                        }`}
                        onClick={() => setBookingData(prev => ({ ...prev, date: dateStr }))}
                      >
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="font-semibold">
                          {date.getDate()}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Select Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      className={`p-3 text-sm border rounded-lg transition-all ${
                        bookingData.time === time
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-border/80'
                      }`}
                      onClick={() => setBookingData(prev => ({ ...prev, time }))}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Patient Information */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Information
                <Sparkles className="w-4 h-4 text-warning" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50">
                <Mic className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Tap the microphone next to any field to use voice input
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>First Name *</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={bookingData.patientInfo.firstName}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          patientInfo: { ...prev.patientInfo, firstName: e.target.value }
                        }))}
                        placeholder="John"
                      />
                      <Button
                        variant={voiceField === 'firstName' && isVoiceActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVoiceInput('firstName')}
                        className="min-w-[44px]"
                      >
                        <MicIcon className={`w-4 h-4 ${voiceField === 'firstName' && isVoiceActive ? 'animate-pulse' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Last Name *</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={bookingData.patientInfo.lastName}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          patientInfo: { ...prev.patientInfo, lastName: e.target.value }
                        }))}
                        placeholder="Doe"
                      />
                      <Button
                        variant={voiceField === 'lastName' && isVoiceActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVoiceInput('lastName')}
                        className="min-w-[44px]"
                      >
                        <MicIcon className={`w-4 h-4 ${voiceField === 'lastName' && isVoiceActive ? 'animate-pulse' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Email *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="email"
                      value={bookingData.patientInfo.email}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        patientInfo: { ...prev.patientInfo, email: e.target.value }
                      }))}
                      placeholder="john.doe@email.com"
                    />
                    <Button
                      variant={voiceField === 'email' && isVoiceActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVoiceInput('email')}
                      className="min-w-[44px]"
                    >
                      <MicIcon className={`w-4 h-4 ${voiceField === 'email' && isVoiceActive ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Phone Number *</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="tel"
                      value={bookingData.patientInfo.phone}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        patientInfo: { ...prev.patientInfo, phone: e.target.value }
                      }))}
                      placeholder="(555) 123-4567"
                    />
                    <Button
                      variant={voiceField === 'phone' && isVoiceActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVoiceInput('phone')}
                      className="min-w-[44px]"
                    >
                      <MicIcon className={`w-4 h-4 ${voiceField === 'phone' && isVoiceActive ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    value={bookingData.patientInfo.dateOfBirth}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      patientInfo: { ...prev.patientInfo, dateOfBirth: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Insurance Provider</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={bookingData.patientInfo.insurance}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        patientInfo: { ...prev.patientInfo, insurance: e.target.value }
                      }))}
                      placeholder="Blue Cross Blue Shield"
                    />
                    <Button
                      variant={voiceField === 'insurance' && isVoiceActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVoiceInput('insurance')}
                      className="min-w-[44px]"
                    >
                      <MicIcon className={`w-4 h-4 ${voiceField === 'insurance' && isVoiceActive ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <div className="flex gap-2 mt-1">
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Tell us about your symptoms or concerns..."
                      className="flex-1 min-h-[80px] px-3 py-2 border rounded-lg resize-none"
                    />
                    <Button
                      variant={voiceField === 'notes' && isVoiceActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVoiceInput('notes')}
                      className="min-w-[44px] self-start"
                    >
                      <MicIcon className={`w-4 h-4 ${voiceField === 'notes' && isVoiceActive ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Confirmation */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                Appointment Confirmed!
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-success/10 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">
                  {bookingData.patientInfo.firstName} {bookingData.patientInfo.lastName}
                </h3>
                <p className="text-muted-foreground mb-2">
                  {appointmentTypes.find(t => t.value === bookingData.appointmentType)?.label}
                </p>
                <p className="font-semibold">
                  {new Date(bookingData.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <p className="font-semibold">
                  {bookingData.time}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  with {providers.find(p => p.id === bookingData.provider)?.name}
                </p>
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Confirmation sent to {bookingData.patientInfo.email}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" />
                  Reminder will be sent to {bookingData.patientInfo.phone}
                </p>
                <p className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  123 Medical Center Drive, Suite 200
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Office
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!validateStep() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                'Booking...'
              ) : currentStep === 4 ? (
                'Book Appointment'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};