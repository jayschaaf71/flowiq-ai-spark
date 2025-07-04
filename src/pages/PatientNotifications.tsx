import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { PatientNotificationCenter } from '@/components/notifications/PatientNotificationCenter';

const PatientNotifications = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/patient-dashboard')}
            className="mb-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Notifications</h1>
          <p className="text-gray-600">Stay updated with your healthcare information and appointments</p>
        </div>
        
        <PatientNotificationCenter />
      </div>
    </div>
  );
};

export default PatientNotifications;