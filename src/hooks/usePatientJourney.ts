import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface JourneyStatus {
  hasCompletedIntake: boolean;
  hasScheduledAppointment: boolean;
  hasReceivedConfirmation: boolean;
  hasReceivedReminders: boolean;
  hasCheckedIn: boolean;
  isNewPatient: boolean;
  completedSubmissions: any[];
  upcomingAppointments: any[];
  recentCheckIns: any[];
  currentStepIndex: number;
  progressPercentage: number;
}

export const usePatientJourney = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus>({
    hasCompletedIntake: false,
    hasScheduledAppointment: false,
    hasReceivedConfirmation: false,
    hasReceivedReminders: false,
    hasCheckedIn: false,
    isNewPatient: true,
    completedSubmissions: [],
    upcomingAppointments: [],
    recentCheckIns: [],
    currentStepIndex: 0,
    progressPercentage: 0
  });

  const loadJourneyStatus = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Load intake submissions
      const { data: submissions } = await supabase
        .from('intake_submissions')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      // Load upcoming appointments
      const { data: appointments } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', user.id)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });

      // Load check-ins
      const { data: checkIns } = await supabase
        .from('patient_checkins')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false });

      // Load notifications to check for confirmations/reminders
      const { data: notifications } = await supabase
        .from('patient_notifications')
        .select('*')
        .eq('patient_id', user.id)
        .in('type', ['appointment', 'reminder']);

      const hasIntake = (submissions?.length || 0) > 0;
      const hasAppointments = (appointments?.length || 0) > 0;
      const hasCheckIns = (checkIns?.length || 0) > 0;
      const hasConfirmation = notifications?.some(n => n.type === 'appointment') || false;
      const hasReminders = notifications?.some(n => n.type === 'reminder') || false;

      // Determine current step
      let currentStep = 0;
      if (hasCheckIns) {
        currentStep = 4; // Journey complete
      } else if (hasReminders) {
        currentStep = 3; // Pre-visit phase
      } else if (hasConfirmation) {
        currentStep = 2; // Confirmed
      } else if (hasAppointments) {
        currentStep = 2; // Scheduled
      } else if (hasIntake) {
        currentStep = 1; // Ready to schedule
      } else {
        currentStep = 0; // Need intake
      }

      const totalSteps = 5;
      const progress = ((currentStep + 1) / totalSteps) * 100;

      setJourneyStatus({
        hasCompletedIntake: hasIntake,
        hasScheduledAppointment: hasAppointments,
        hasReceivedConfirmation: hasConfirmation,
        hasReceivedReminders: hasReminders,
        hasCheckedIn: hasCheckIns,
        isNewPatient: !hasIntake,
        completedSubmissions: submissions || [],
        upcomingAppointments: appointments || [],
        recentCheckIns: checkIns || [],
        currentStepIndex: currentStep,
        progressPercentage: Math.round(progress)
      });

    } catch (error) {
      console.error('Error loading patient journey status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJourneyStatus();
  }, [user]);

  const refreshJourney = () => {
    loadJourneyStatus();
  };

  const getNextAction = () => {
    const status = journeyStatus;
    
    if (!status.hasCompletedIntake) {
      return {
        action: 'complete-intake',
        title: 'Complete Your Intake Forms',
        description: 'Start by filling out your medical history and patient information.'
      };
    }
    
    if (!status.hasScheduledAppointment) {
      return {
        action: 'schedule-appointment',
        title: 'Schedule Your First Appointment',
        description: 'Book a time to meet with your healthcare provider.'
      };
    }
    
    if (status.upcomingAppointments.length > 0) {
      const nextAppt = status.upcomingAppointments[0];
      return {
        action: 'prepare-for-visit',
        title: 'Prepare for Your Visit',
        description: `Your appointment is on ${new Date(nextAppt.date).toLocaleDateString()} at ${nextAppt.time}.`
      };
    }
    
    return {
      action: 'journey-complete',
      title: 'Journey Complete',
      description: 'You\'ve completed your patient onboarding journey.'
    };
  };

  return {
    journeyStatus,
    loading,
    refreshJourney,
    getNextAction
  };
};