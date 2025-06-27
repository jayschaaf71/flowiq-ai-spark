
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scheduleIQService } from '@/services/scheduleIQService';

export const AISchedulingAssistant: React.FC = () => {
  const { toast } = useToast();
  const [bookingRequest, setBookingRequest] = useState({
    patientName: '',
    phone: '',
    email: '',
    appointmentType: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await scheduleIQService.processBookingRequest(bookingRequest);
      setResult(response);
      
      if (response.success) {
        toast({
          title: "Appointment Booked!",
          description: response.message,
        });
        // Reset form
        setBookingRequest({
          patientName: '',
          phone: '',
          email: '',
          appointmentType: '',
          preferredDate: '',
          preferredTime: '',
          notes: '',
          priority: 'medium'
        });
      } else {
        toast({
          title: "Booking Assistance",
          description: response.message,
        });
      }
    } catch (error) {
      console.error('Error processing booking request:', error);
      toast({
        title: "Error",
        description: "Failed to process booking request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingRequest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">AI Scheduling Assistant</h2>
          <p className="text-gray-600">Let AI find the best appointment slots for your patients</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              New Booking Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Patient Name</label>
                  <Input
                    value={bookingRequest.patientName}
                    onChange={(e) => handleInputChange('patientName', e.target.value)}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input
                    value={bookingRequest.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={bookingRequest.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Email address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Appointment Type</label>
                  <Select value={bookingRequest.appointmentType} onValueChange={(value) => handleInputChange('appointmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <Select value={bookingRequest.priority} onValueChange={(value) => handleInputChange('priority', value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <Input
                    type="date"
                    value={bookingRequest.preferredDate}
                    onChange={(e) => handleInputChange('preferredDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <Input
                    type="time"
                    value={bookingRequest.preferredTime}
                    onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  value={bookingRequest.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes or requirements"
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Processing...' : 'Find Best Appointment Slots'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* AI Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Submit a booking request to see AI recommendations</p>
              </div>
            ) : result.success ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Appointment Booked Successfully!</span>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm">{result.message}</p>
                  {result.appointmentId && (
                    <p className="text-xs text-gray-600 mt-2">
                      Appointment ID: {result.appointmentId}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-medium">Multiple Options Available</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{result.message}</p>
                
                {result.suggestedSlots && result.suggestedSlots.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Suggested Time Slots:</h4>
                    {result.suggestedSlots.map((slot: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{slot.date} at {slot.time}</p>
                          <p className="text-sm text-gray-600">{slot.reasoning}</p>
                        </div>
                        <Badge variant="secondary">
                          {Math.round(slot.confidence * 100)}% match
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
