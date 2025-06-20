
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAvailability } from "@/hooks/useAvailability";
import { useProviders } from "@/hooks/useProviders";
import { format, addDays, parseISO } from "date-fns";

export const useScheduleContext = (profile: any) => {
  const { toast } = useToast();
  const { checkAvailability } = useAvailability();
  const { providers } = useProviders();
  const [scheduleContext, setScheduleContext] = useState<any>(null);

  const loadScheduleContext = async () => {
    if (!profile) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = format(addDays(new Date(), 1), 'yyyy-MM-dd');

      // Load appointments based on user role
      let appointmentsQuery = supabase
        .from('appointments')
        .select('*')
        .gte('date', today)
        .order('date')
        .order('time');

      // If patient, only show their appointments
      if (profile.role === 'patient') {
        appointmentsQuery = appointmentsQuery.eq('email', profile.email);
      }

      const { data: appointments } = await appointmentsQuery.limit(100);

      // Load active providers with their details
      const { data: providersData } = await supabase
        .from('providers')
        .select('*')
        .eq('is_active', true);

      // Load team members
      const { data: teamMembers } = await supabase
        .from('team_members')
        .select('*')
        .eq('status', 'active');

      // Get real availability data for next few days
      const availabilityPromises = (providersData || []).map(async (provider) => {
        const slots = await checkAvailability(provider.id, today, 60);
        const tomorrowSlots = await checkAvailability(provider.id, tomorrow, 60);
        return {
          providerId: provider.id,
          providerName: `${provider.first_name} ${provider.last_name}`,
          specialty: provider.specialty,
          todayAvailable: slots.filter(slot => slot.available).length,
          tomorrowAvailable: tomorrowSlots.filter(slot => slot.available).length,
          nextSlots: slots.filter(slot => slot.available).slice(0, 3)
        };
      });

      const availabilityData = await Promise.all(availabilityPromises);
      
      const todaysAppointments = appointments?.filter(apt => apt.date === today).length || 0;
      const weekAppointments = appointments?.filter(apt => {
        const aptDate = parseISO(apt.date);
        const today = new Date();
        const weekFromNow = addDays(today, 7);
        return aptDate >= today && aptDate <= weekFromNow;
      }).length || 0;

      const totalAvailableSlots = availabilityData.reduce((sum, provider) => sum + provider.todayAvailable, 0);
      const nextAvailableSlots = availabilityData
        .filter(provider => provider.nextSlots.length > 0)
        .map(provider => ({
          provider: provider.providerName,
          providerId: provider.providerId,
          specialty: provider.specialty,
          slots: provider.nextSlots
        }));

      const contextData = {
        appointments: weekAppointments,
        providers: providersData?.map(p => `${p.first_name} ${p.last_name} (${p.specialty})`).join(', ') || 'None configured',
        availableSlots: totalAvailableSlots,
        todaysAppointments: todaysAppointments,
        totalProviders: (providersData?.length || 0) + (teamMembers?.length || 0),
        upcomingAppointments: appointments?.slice(0, 5) || [],
        userRole: profile.role,
        availabilityDetails: availabilityData,
        nextAvailableSlots: nextAvailableSlots,
        totalActiveProviders: providersData?.length || 0,
        providersData: providersData || [],
        realTimeData: {
          lastUpdated: new Date().toISOString(),
          todayDate: today,
          totalSlotsChecked: availabilityData.length * 18,
        }
      };

      setScheduleContext(contextData);

    } catch (error) {
      console.error('Error loading comprehensive schedule context:', error);
      toast({
        title: "Context Loading Error",
        description: "Some scheduling data may not be current",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (profile) {
      loadScheduleContext();
      
      // Refresh context every 30 seconds for real-time updates
      const interval = setInterval(loadScheduleContext, 30000);
      return () => clearInterval(interval);
    }
  }, [profile]);

  return {
    scheduleContext,
    loadScheduleContext
  };
};
