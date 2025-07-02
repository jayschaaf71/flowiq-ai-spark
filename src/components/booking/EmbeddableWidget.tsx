import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle
} from "lucide-react";

export const EmbeddableWidget = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: ""
  });
  const [step, setStep] = useState(1);

  const appointmentTypes = [
    { id: "consultation", name: "Initial Consultation", duration: 60, description: "Comprehensive sleep assessment" },
    { id: "followup", name: "Follow-up Visit", duration: 30, description: "Treatment progress review" },
    { id: "fitting", name: "Appliance Fitting", duration: 45, description: "Custom sleep appliance fitting" },
    { id: "adjustment", name: "Appliance Adjustment", duration: 30, description: "Device modification and tuning" }
  ];

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM"
  ];

  const handleSubmit = async () => {
    // Simulate booking submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep(4); // Success step
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Appointment Type</h3>
              <div className="grid gap-3">
                {appointmentTypes.map((type) => (
                  <div 
                    key={type.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      appointmentType === type.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setAppointmentType(type.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                      <Badge variant="outline">{type.duration} min</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => setStep(2)}
              disabled={!appointmentType}
              className="w-full"
            >
              Continue to Date & Time
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Select Date & Time</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Choose Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                    className="rounded-md border"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Available Times</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTime(time)}
                        className="justify-start"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={!selectedDate || !selectedTime}
                className="flex-1"
              >
                Continue to Details
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Your Information</h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <Label htmlFor="reason">Reason for Visit (Optional)</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Brief description of your sleep concerns"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            {/* Appointment Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Appointment Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {selectedDate?.toLocaleDateString()} at {selectedTime}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {appointmentTypes.find(t => t.id === appointmentType)?.name}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {appointmentTypes.find(t => t.id === appointmentType)?.duration} minutes
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button 
                onClick={handleSubmit}
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone}
                className="flex-1"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4 py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">Appointment Confirmed!</h3>
              <p className="text-gray-600">
                Your appointment has been successfully scheduled. You'll receive a confirmation email shortly.
              </p>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <h4 className="font-medium text-green-800 mb-2">Appointment Details</h4>
              <div className="space-y-1 text-sm text-green-700">
                <div>📅 {selectedDate?.toLocaleDateString()} at {selectedTime}</div>
                <div>👤 {formData.firstName} {formData.lastName}</div>
                <div>📧 {formData.email}</div>
                <div>📞 {formData.phone}</div>
                <div>🏥 {appointmentTypes.find(t => t.id === appointmentType)?.name}</div>
              </div>
            </div>
            
            <Button onClick={() => setStep(1)} variant="outline">
              Book Another Appointment
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CalendarIcon className="w-5 h-5" />
          Schedule Your Sleep Consultation
        </CardTitle>
        <CardDescription>
          Book an appointment with our dental sleep medicine specialists
        </CardDescription>
        
        {/* Progress Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {[1, 2, 3, 4].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step > stepNum ? <CheckCircle className="w-4 h-4" /> : stepNum}
            </div>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
};