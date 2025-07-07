import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const DentalSleepRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately redirect to Dental Sleep iQ
    navigate('/agents/dental-sleep');
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-purple-600">Switching to Dental Sleep iQ...</p>
      </div>
    </div>
  );
};