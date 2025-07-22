import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface TimeSlot {
  time: string;
  available: boolean;
  provider?: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  nextAvailable: string;
}

const SelfSchedulingSystem = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedProvider, setSelectedProvider] = useState<string>();
  const [appointmentType, setAppointmentType] = useState<string>();
  const [formData, setFormData] = useState({
    reason: '',
    symptoms: '',
    urgency: 'routine',
    preferredContact: 'phone',
    notes: ''
  });

  // Mock data
  const appointmentTypes = [
    { id: 'annual', name: 'Annual Checkup', duration: 60, description: 'Comprehensive health evaluation' },
    { id: 'followup', name: 'Follow-up Visit', duration: 30, description: 'Review previous treatment' },
    { id: 'urgent', name: 'Urgent Care', duration: 45, description: 'Non-emergency urgent needs' },
    { id: 'consultation', name: 'Consultation', duration: 45, description: 'Discuss treatment options' },
    { id: 'telehealth', name: 'Telehealth Visit', duration: 30, description: 'Virtual appointment' }
  ];

  const providers: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Family Medicine',
      rating: 4.9,
      nextAvailable: 'Today 2:30 PM'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Internal Medicine',
      rating: 4.8,
      nextAvailable: 'Tomorrow 10:00 AM'
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Cardiology',
      rating: 4.9,
      nextAvailable: 'Jan 25 9:00 AM'
    }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '11:30 AM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: true },
    { time: '3:00 PM', available: false },
    { time: '3:30 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '4:30 PM', available: true }
  ];

  const handleSubmit = async () => {
    try {
      // Here you would make an API call to schedule the appointment
      toast({
        title: "Appointment Scheduled",
        description: `Your appointment has been scheduled for ${selectedDate ? format(selectedDate, 'PPP') : ''} at ${selectedTime}`,
      });
      
      // Reset form or redirect
      setStep(5); // Confirmation step
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Select Appointment Type
              </CardTitle>
              <CardDescription>Choose the type of appointment you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {appointmentTypes.map((type) => (
                <Card 
                  key={type.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    appointmentType === type.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setAppointmentType(type.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{type.duration} min</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button 
                onClick={() => setStep(2)} 
                disabled={!appointmentType}
                className="w-full"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Provider
              </CardTitle>
              <CardDescription>Choose your preferred healthcare provider</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {providers.map((provider) => (
                <Card 
                  key={provider.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedProvider === provider.id ? 'border-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedProvider(provider.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{provider.name}</h3>
                          <p className="text-sm text-muted-foreground">{provider.specialty}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">★ {provider.rating}</Badge>
                            <span className="text-xs text-muted-foreground">Next: {provider.nextAvailable}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!selectedProvider}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Select Date & Time
              </CardTitle>
              <CardDescription>Choose your preferred appointment date and time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                </div>
                
                {selectedDate && (
                  <div>
                    <Label className="text-base font-medium">Available Times</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="h-12"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>Provide additional information about your visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit</Label>
                <Input
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Brief description of your visit reason"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Current Symptoms (Optional)</Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  placeholder="Describe any symptoms you're experiencing"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Preferred Contact Method</Label>
                <Select value={formData.preferredContact} onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="text">Text Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Any additional information for your provider"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 5:
        return (
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Appointment Scheduled!</CardTitle>
              <CardDescription>Your appointment has been successfully scheduled</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-foreground">Appointment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">
                      {appointmentTypes.find(t => t.id === appointmentType)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Provider:</span>
                    <span className="font-medium">
                      {providers.find(p => p.id === selectedProvider)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {selectedDate ? format(selectedDate, 'PPP') : ''}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">What's Next?</h4>
                    <ul className="text-sm text-blue-800 mt-2 space-y-1">
                      <li>• You'll receive a confirmation email shortly</li>
                      <li>• Appointment reminders will be sent 24 hours before</li>
                      <li>• Please arrive 15 minutes early for check-in</li>
                      <li>• Bring your insurance card and ID</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Add to Calendar
                </Button>
                <Button className="flex-1">
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div 
                key={stepNumber}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  stepNumber <= step 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : 'border-muted-foreground text-muted-foreground'
                }`}
              >
                {stepNumber < step ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Schedule Appointment</h1>
            <p className="text-muted-foreground">
              Step {step} of 5: {
                step === 1 ? 'Appointment Type' :
                step === 2 ? 'Select Provider' :
                step === 3 ? 'Date & Time' :
                step === 4 ? 'Details' :
                'Confirmation'
              }
            </p>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default SelfSchedulingSystem;