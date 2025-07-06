import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PatientRegistration } from '@/components/intake/PatientRegistration';
import { PatientAppointmentBooking } from '@/components/booking/PatientAppointmentBooking';
import { CheckCircle, Calendar, FileText, Clock, Phone, Mail, ArrowRight, User } from 'lucide-react';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'available';
  icon: React.ReactNode;
}

export const PatientJourneyOrchestrator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [showAppointmentBooking, setShowAppointmentBooking] = useState(false);
  const [completedSubmissions, setCompletedSubmissions] = useState<any[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);
  const [journeyData, setJourneyData] = useState({
    hasCompletedIntake: false,
    hasScheduledAppointment: false,
    hasCheckedIn: false,
    isNewPatient: true
  });

  const journeySteps: JourneyStep[] = [
    {
      id: 'intake',
      title: 'Complete Intake Forms',
      description: 'Fill out your medical history and patient information',
      status: journeyData.hasCompletedIntake ? 'completed' : 'available',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'appointment',
      title: 'Schedule Appointment',
      description: 'Book your first visit with our care team',
      status: journeyData.hasScheduledAppointment ? 'completed' : 
             journeyData.hasCompletedIntake ? 'available' : 'pending',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 'confirmation',
      title: 'Appointment Confirmation',
      description: 'Receive confirmation and pre-visit instructions',
      status: journeyData.hasScheduledAppointment ? 'completed' : 'pending',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'reminder',
      title: 'Pre-Visit Reminders',
      description: 'Get reminders and preparation instructions',
      status: journeyData.hasScheduledAppointment ? 'completed' : 'pending',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'checkin',
      title: 'Day of Visit Check-In',
      description: 'Complete check-in process and verify information',
      status: journeyData.hasCheckedIn ? 'completed' : 'pending',
      icon: <User className="w-5 h-5" />
    }
  ];

  useEffect(() => {
    if (user) {
      loadPatientJourneyStatus();
    }
  }, [user]);

  const loadPatientJourneyStatus = async () => {
    try {
      // Check for completed intake submissions
      const { data: submissions } = await supabase
        .from('intake_submissions')
        .select('*')
        .eq('patient_id', user?.id);

      // Check for scheduled appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user?.id)
        .gte('date', new Date().toISOString().split('T')[0]);

      // Check for check-ins
      const { data: checkins } = await supabase
        .from('patient_checkins')
        .select('*')
        .eq('patient_id', user?.id);

      setCompletedSubmissions(submissions || []);
      setUpcomingAppointments(appointments || []);

      setJourneyData({
        hasCompletedIntake: (submissions?.length || 0) > 0,
        hasScheduledAppointment: (appointments?.length || 0) > 0,
        hasCheckedIn: (checkins?.length || 0) > 0,
        isNewPatient: (submissions?.length || 0) === 0
      });

      // Determine current step
      if ((checkins?.length || 0) > 0) {
        setCurrentStepIndex(4); // Completed journey
      } else if ((appointments?.length || 0) > 0) {
        setCurrentStepIndex(3); // Waiting for visit
      } else if ((submissions?.length || 0) > 0) {
        setCurrentStepIndex(1); // Need to schedule
      } else {
        setCurrentStepIndex(0); // Need intake
      }

    } catch (error) {
      console.error('Error loading journey status:', error);
    }
  };

  const handleStepAction = (stepId: string) => {
    switch (stepId) {
      case 'intake':
        setShowIntakeForm(true);
        break;
      case 'appointment':
        setShowAppointmentBooking(true);
        break;
      case 'confirmation':
        toast({
          title: "Confirmation Sent",
          description: "Your appointment confirmation has been sent to your email and phone.",
        });
        break;
      case 'reminder':
        toast({
          title: "Reminders Active",
          description: "You'll receive reminders 24 hours and 2 hours before your appointment.",
        });
        break;
      case 'checkin':
        toast({
          title: "Check-In Available",
          description: "Check-in will be available 30 minutes before your appointment time.",
        });
        break;
    }
  };

  const handleIntakeComplete = () => {
    setShowIntakeForm(false);
    loadPatientJourneyStatus();
    toast({
      title: "Intake Complete!",
      description: "Your forms have been submitted. You can now schedule your appointment.",
    });
  };

  const handleAppointmentBooked = () => {
    setShowAppointmentBooking(false);
    loadPatientJourneyStatus();
    toast({
      title: "Appointment Requested!",
      description: "Your appointment request has been submitted. You'll receive confirmation soon.",
    });
  };

  const progressPercentage = ((currentStepIndex + 1) / journeySteps.length) * 100;

  if (showIntakeForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Patient Registration</h2>
          <Button variant="outline" onClick={() => setShowIntakeForm(false)}>
            Back to Journey
          </Button>
        </div>
        <PatientRegistration />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Patient Journey</span>
            <Badge variant="outline">
              Step {currentStepIndex + 1} of {journeySteps.length}
            </Badge>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="w-full" />
            <p className="text-sm text-muted-foreground">
              {Math.round(progressPercentage)}% Complete
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journeySteps.map((step, index) => (
              <div key={step.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100 text-green-600' :
                  step.status === 'available' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {step.id === 'intake' && completedSubmissions.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {completedSubmissions.length} form{completedSubmissions.length > 1 ? 's' : ''} completed
                    </p>
                  )}
                  
                  {step.id === 'appointment' && upcomingAppointments.length > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {upcomingAppointments.length} appointment{upcomingAppointments.length > 1 ? 's' : ''} scheduled
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={
                    step.status === 'completed' ? 'bg-green-100 text-green-800' :
                    step.status === 'available' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }>
                    {step.status === 'completed' ? 'Complete' :
                     step.status === 'available' ? 'Ready' :
                     step.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </Badge>
                  
                  {step.status === 'available' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleStepAction(step.id)}
                      className="ml-2"
                    >
                      Start
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Our care team is here to help you through every step of your journey.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="w-4 h-4 mr-2" />
                Call (555) 123-4567
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Send Secure Message
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journey Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Forms Completed:</span>
                <span className="text-sm font-medium">{completedSubmissions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Appointments Scheduled:</span>
                <span className="text-sm font-medium">{upcomingAppointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Progress:</span>
                <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Booking Modal */}
      <PatientAppointmentBooking
        open={showAppointmentBooking}
        onOpenChange={(open) => {
          setShowAppointmentBooking(open);
          if (!open) {
            handleAppointmentBooked();
          }
        }}
      />
    </div>
  );
};