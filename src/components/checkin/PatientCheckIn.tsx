
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, User, CreditCard, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  appointment_type: string;
  patient_id: string;
  provider_id?: string;
  provider: string;
  status?: string; // Added optional status property
}

interface CheckInData {
  forms_completed: boolean;
  insurance_verified: boolean;
  copay_collected: boolean;
  copay_amount: number;
  notes: string;
}

export const PatientCheckIn = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [checkInData, setCheckInData] = useState<CheckInData>({
    forms_completed: false,
    insurance_verified: false,
    copay_collected: false,
    copay_amount: 0,
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTodaysAppointments();
  }, []);

  const loadTodaysAppointments = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('date', today)
        .eq('status', 'confirmed')
        .order('time', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load today's appointments",
        variant: "destructive",
      });
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    if (!selectedAppointment) return;
    
    setLoading(true);
    try {
      const appointment = appointments.find(apt => apt.id === appointmentId);
      if (!appointment) throw new Error('Appointment not found');

      const { error } = await supabase
        .from('patient_checkins')
        .insert({
          appointment_id: appointmentId,
          patient_id: appointment.patient_id,
          check_in_method: 'manual',
          forms_completed: checkInData.forms_completed,
          insurance_verified: checkInData.insurance_verified,
          copay_collected: checkInData.copay_collected,
          copay_amount: checkInData.copay_amount,
          notes: checkInData.notes
        });

      if (error) throw error;

      // Update appointment status
      await supabase
        .from('appointments')
        .update({ status: 'checked_in' })
        .eq('id', appointmentId);

      toast({
        title: "Check-in Complete",
        description: `Patient successfully checked in for ${appointment.title}`,
      });

      setSelectedAppointment(null);
      setCheckInData({
        forms_completed: false,
        insurance_verified: false,
        copay_collected: false,
        copay_amount: 0,
        notes: ''
      });
      
      loadTodaysAppointments();
    } catch (error) {
      console.error('Error checking in patient:', error);
      toast({
        title: "Check-in Failed",
        description: "Failed to check in patient. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patient Check-In</h2>
        <Badge variant="outline">
          <Clock className="w-4 h-4 mr-1" />
          {format(new Date(), 'MMM d, yyyy')}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments List */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No appointments scheduled for today
              </div>
            ) : (
              appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedAppointment === appointment.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedAppointment(appointment.id)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{appointment.title}</h3>
                      <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
                      <p className="text-sm text-gray-500">
                        {appointment.time}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      {appointment.status || 'confirmed'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Check-in Form */}
        {selectedAppointment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Check-In Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="forms"
                    checked={checkInData.forms_completed}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({ ...prev, forms_completed: !!checked }))
                    }
                  />
                  <label htmlFor="forms" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Intake forms completed
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance"
                    checked={checkInData.insurance_verified}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({ ...prev, insurance_verified: !!checked }))
                    }
                  />
                  <label htmlFor="insurance" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Insurance verified
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="copay"
                    checked={checkInData.copay_collected}
                    onCheckedChange={(checked) =>
                      setCheckInData(prev => ({ ...prev, copay_collected: !!checked }))
                    }
                  />
                  <label htmlFor="copay" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Copay collected
                  </label>
                </div>

                {checkInData.copay_collected && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Copay Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={checkInData.copay_amount}
                      onChange={(e) =>
                        setCheckInData(prev => ({ ...prev, copay_amount: parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="0.00"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea
                    value={checkInData.notes}
                    onChange={(e) =>
                      setCheckInData(prev => ({ ...prev, notes: e.target.value }))
                    }
                    placeholder="Any additional notes or special instructions..."
                    rows={3}
                  />
                </div>
              </div>

              <Button
                onClick={() => handleCheckIn(selectedAppointment)}
                disabled={loading}
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {loading ? 'Checking In...' : 'Complete Check-In'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
