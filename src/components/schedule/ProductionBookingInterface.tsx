
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EnhancedBookingFlow } from "./EnhancedBookingFlow";
import { RealTimeCalendar } from "./RealTimeCalendar";
import { SmartSchedulingSuggestions } from "./SmartSchedulingSuggestions";
import { Calendar, Clock, Brain, Zap, Users, TrendingUp } from "lucide-react";

interface ProductionBookingInterfaceProps {
  onAppointmentBooked?: () => void;
}

export const ProductionBookingInterface = ({ onAppointmentBooked }: ProductionBookingInterfaceProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingMode, setBookingMode] = useState<'calendar' | 'form'>('calendar');
  const [mockAppointments, setMockAppointments] = useState([
    { id: '1', title: 'John Doe', date: '2024-01-15', time: '09:00', duration: 60, status: 'confirmed', patient_id: '1' },
    { id: '2', title: 'Jane Smith', date: '2024-01-15', time: '10:30', duration: 45, status: 'pending', patient_id: '2' },
    { id: '3', title: 'Bob Johnson', date: '2024-01-15', time: '14:00', duration: 90, status: 'confirmed', patient_id: '3' },
  ]);

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setBookingMode('form');
  };

  const handleBookingComplete = (appointmentId: string) => {
    console.log('Appointment booked:', appointmentId);
    if (onAppointmentBooked) {
      onAppointmentBooked();
    }
    setBookingMode('calendar');
    setSelectedDate(undefined);
    setSelectedTime("");
  };

  const handleApplySuggestion = (suggestion: any) => {
    console.log('Applying suggestion:', suggestion);
    // In a real implementation, this would apply the optimization
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-gray-600">Today's Appointments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-gray-600">Schedule Utilization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-600">Available Slots</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-gray-600">AI Accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Live Schedule
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Quick Booking
            </TabsTrigger>
            <TabsTrigger value="ai-suggestions" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Suggestions
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </Badge>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <Zap className="w-4 h-4 mr-2" />
              AI Optimize
            </Button>
          </div>
        </div>

        <TabsContent value="schedule" className="space-y-4">
          {bookingMode === 'calendar' ? (
            <RealTimeCalendar
              onTimeSlotClick={handleTimeSlotClick}
              onAppointmentClick={(appointment) => {
                console.log('Appointment clicked:', appointment);
              }}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">New Appointment</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setBookingMode('calendar');
                    setSelectedDate(undefined);
                    setSelectedTime("");
                  }}
                >
                  Back to Calendar
                </Button>
              </div>
              <EnhancedBookingFlow
                onComplete={handleBookingComplete}
                preselectedDate={selectedDate}
                preselectedTime={selectedTime}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="booking" className="space-y-4">
          <EnhancedBookingFlow onComplete={handleBookingComplete} />
        </TabsContent>

        <TabsContent value="ai-suggestions" className="space-y-4">
          <SmartSchedulingSuggestions
            appointments={mockAppointments}
            onApplySuggestion={handleApplySuggestion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
