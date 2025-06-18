
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ProductionBookingInterface } from "@/components/schedule/ProductionBookingInterface";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/patient-auth" replace />;
  }

  const handleAppointmentBooked = () => {
    navigate("/patient-dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/patient-dashboard")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Book Appointment</h1>
                <p className="text-sm text-gray-600">Schedule your visit</p>
              </div>
            </div>
            
            <div></div> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductionBookingInterface onAppointmentBooked={handleAppointmentBooked} />
      </div>
    </div>
  );
};

export default BookAppointment;
