
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { MobileBookingInterface } from "@/components/booking/MobileBookingInterface";
import { useNavigate } from "react-router-dom";

export const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Allow anonymous booking for patients
  // Only redirect to auth if they're a staff member without authentication
  
  const handleAppointmentBooked = () => {
    // For anonymous users, just show success
    // For authenticated users, navigate to dashboard
    if (user) {
      navigate("/patient-dashboard");
    }
  };

  return (
    <MobileBookingInterface onAppointmentBooked={handleAppointmentBooked} />
  );
};

export default BookAppointment;
