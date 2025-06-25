
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MobileBookingInterface } from "@/components/booking/MobileBookingInterface";

export const RescheduleAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const loadAppointment = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('id', appointmentId)
        .single();

      if (error) throw error;
      setAppointment(data);
    } catch (error) {
      console.error('Error loading appointment:', error);
      toast({
        title: "Error",
        description: "Could not load appointment details",
        variant: "destructive",
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleComplete = () => {
    toast({
      title: "Success!",
      description: "Your appointment has been rescheduled successfully.",
    });
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Appointment not found</p>
        </div>
      </div>
    );
  }

  return (
    <MobileBookingInterface
      existingAppointment={appointment}
      isRescheduling={true}
      onAppointmentBooked={handleRescheduleComplete}
    />
  );
};

export default RescheduleAppointment;
