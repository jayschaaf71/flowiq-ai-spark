
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { scheduleIQService } from "@/services/scheduleIQService";

interface BookingRequest {
  patientName: string;
  phone: string;
  email: string;
  appointmentType: string;
  preferredDate: string;
  preferredTime: string;
  notes: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export const AISchedulingAssistant = () => {
  const [bookingRequest, setBookingRequest] = useState<BookingRequest>({
    patientName: '',
    phone: '',
    email: '',
    appointmentType: 'consultation',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    priority: 'medium'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleInputChange = (field: keyof BookingRequest, value: string) => {
    setBookingRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleAIBooking = async () => {
    if (!bookingRequest.patientName || !bookingRequest.phone) {
      toast({
        title: "Missing Information",
        description: "Patient name and phone are required",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await scheduleIQService.processBookingRequest({
        patientName: bookingRequest.patientName,
        phone: bookingRequest.phone,
        email: bookingRequest.email,
        appointmentType: bookingRequest.appointmentType,
        preferredDate: bookingRequest.preferredDate,
        preferredTime: bookingRequest.preferredTime,
        notes: bookingRequest.notes,
        priority: bookingRequest.priority
      });

      setResult(response);
      
      if (response.success) {
        toast({
          title: "Appointment Booked!",
          description: response.message,
        });
      } else {
        toast({
          title: "Booking Options Available",
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        title: "Booking Error",
        description: "Failed to process booking request",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestBooking = () => {
    setBookingRequest({
      patientName: 'John Smith',
      phone: '555-0123',
      email: 'john.smith@email.com',
      appointmentType: 'consultation',
      preferredDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      preferredTime: '14:00',
      notes: 'New patient consultation for back pain. Prefers afternoon appointments.',
      priority: 'medium'
    });
  };

  return (
    <div className="space-y-6">
      {/* AI Assistant Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Scheduling Assistant
            <Badge className="bg-purple-100 text-purple-700">
              <Sparkles className="w-3 h-3 mr-1" />
              Auto-Booking Enabled
            </Badge>
          </CardTitle>
          <CardDescription>
            Let AI find the perfect appointment slot and automatically book for patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              AI will analyze patient preferences, provider availability, and practice patterns to suggest or automatically book the best appointment slots.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Booking Request Form */}
      <Card>
        <CardHeader>
          <CardTitle>New Booking Request</CardTitle>
          <CardDescription>
            Enter patient details and let AI handle the scheduling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Patient Name *
              </label>
              <Input
                value={bookingRequest.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                placeholder="Enter patient name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </label>
              <Input
                value={bookingRequest.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                value={bookingRequest.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="patient@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Appointment Type</label>
              <select
                value={bookingRequest.appointmentType}
                onChange={(e) => handleInputChange('appointmentType', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="consultation">Consultation</option>
                <option value="follow-up">Follow-up</option>
                <option value="procedure">Procedure</option>
                <option value="screening">Screening</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Preferred Date
              </label>
              <Input
                type="date"
                value={bookingRequest.preferredDate}
                onChange={(e) => handleInputChange('preferredDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Preferred Time
              </label>
              <Input
                type="time"
                value={bookingRequest.preferredTime}
                onChange={(e) => handleInputChange('preferredTime', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Priority Level</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'urgent'] as const).map(priority => (
                <Button
                  key={priority}
                  variant={bookingRequest.priority === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleInputChange('priority', priority)}
                  className={
                    bookingRequest.priority === priority
                      ? priority === 'urgent' ? 'bg-red-600 hover:bg-red-700 text-white border-red-600' :
                        priority === 'high' ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600' :
                        priority === 'medium' ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' :
                        'bg-gray-600 hover:bg-gray-700 text-white border-gray-600'
                      : priority === 'urgent' ? 'border-red-300 text-red-700 hover:bg-red-50' :
                        priority === 'high' ? 'border-orange-300 text-orange-700 hover:bg-orange-50' :
                        priority === 'medium' ? 'border-blue-300 text-blue-700 hover:bg-blue-50' :
                        'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Notes
            </label>
            <Textarea
              value={bookingRequest.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any specific requirements or notes for scheduling..."
              className="min-h-[80px]"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleAIBooking}
              disabled={isProcessing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  AI Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Let AI Schedule
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleTestBooking}>
              Load Test Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* AI Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600" />
              )}
              AI Scheduling Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>
                  {result.message}
                </AlertDescription>
              </Alert>

              {result.success && result.appointmentId && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Appointment Confirmed</h4>
                  <p className="text-sm text-green-700">
                    Appointment ID: <code className="bg-green-100 px-1 rounded">{result.appointmentId}</code>
                  </p>
                </div>
              )}

              {result.suggestedSlots && result.suggestedSlots.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium">AI-Suggested Time Slots:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.suggestedSlots.map((slot: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg bg-blue-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{slot.date} at {slot.time}</p>
                            <p className="text-sm text-gray-600">{slot.provider || 'Available Provider'}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700">
                            {Math.round(slot.confidence * 100)}% match
                          </Badge>
                        </div>
                        <Button size="sm" className="w-full mt-2">
                          Book This Slot
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
