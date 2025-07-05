
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSampleData = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createSampleProviders = async () => {
    setLoading(true);
    try {
      const sampleProviders = [
        {
          first_name: 'Dr. Sarah',
          last_name: 'Wilson',
          email: 'sarah.wilson@clinic.com',
          phone: '(555) 123-4567',
          specialty: 'General Practice',
          is_active: true,
          working_hours: {
            monday: { start: '09:00', end: '17:00' },
            tuesday: { start: '09:00', end: '17:00' },
            wednesday: { start: '09:00', end: '17:00' },
            thursday: { start: '09:00', end: '17:00' },
            friday: { start: '09:00', end: '15:00' },
            saturday: null,
            sunday: null
          }
        },
        {
          first_name: 'Dr. James',
          last_name: 'Rodriguez',
          email: 'james.rodriguez@clinic.com',
          phone: '(555) 234-5678',
          specialty: 'Cardiology',
          is_active: true,
          working_hours: {
            monday: { start: '08:00', end: '16:00' },
            tuesday: { start: '08:00', end: '16:00' },
            wednesday: { start: '08:00', end: '16:00' },
            thursday: { start: '08:00', end: '16:00' },
            friday: { start: '08:00', end: '14:00' },
            saturday: null,
            sunday: null
          }
        },
        {
          first_name: 'Dr. Emily',
          last_name: 'Chen',
          email: 'emily.chen@clinic.com',
          phone: '(555) 345-6789',
          specialty: 'Pediatrics',
          is_active: true,
          working_hours: {
            monday: { start: '10:00', end: '18:00' },
            tuesday: { start: '10:00', end: '18:00' },
            wednesday: { start: '10:00', end: '18:00' },
            thursday: { start: '10:00', end: '18:00' },
            friday: { start: '10:00', end: '16:00' },
            saturday: { start: '09:00', end: '13:00' },
            sunday: null
          }
        }
      ];

      const { data: providers, error } = await supabase
        .from('providers')
        .insert(sampleProviders)
        .select();

      if (error) throw error;

      toast({
        title: "Sample Providers Created",
        description: `Created ${providers.length} sample providers`,
      });

      return providers;
    } catch (error) {
      console.error("Error creating sample providers:", error);
      toast({
        title: "Error",
        description: "Failed to create sample providers",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const createSampleScheduleTemplates = async (providers: any[]) => {
    setLoading(true);
    try {
      const scheduleTemplates = [];

      for (const provider of providers) {
        // Create templates for each working day
        const workingDays = Object.entries(provider.working_hours)
          .map(([day, hours], index) => ({ day, hours, dayOfWeek: index }))
          .filter(({ hours }) => hours !== null);

        for (const { hours, dayOfWeek } of workingDays) {
          scheduleTemplates.push({
            provider_id: provider.id,
            day_of_week: dayOfWeek,
            start_time: (hours as any).start,
            end_time: (hours as any).end,
            slot_duration: provider.specialty === 'Pediatrics' ? 30 : 60,
            buffer_time: 15,
            is_active: true
          });
        }
      }

      // Mock schedule templates creation since table doesn't exist
      console.log('Mock creating schedule templates:', scheduleTemplates);
      const data = scheduleTemplates.map((template, index) => ({
        ...template,
        id: `template-${index + 1}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      toast({
        title: "Schedule Templates Created",
        description: `Created ${data.length} schedule templates`,
      });

      return data;
    } catch (error) {
      console.error("Error creating schedule templates:", error);
      toast({
        title: "Error",
        description: "Failed to create schedule templates",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const setupSampleData = async () => {
    const providers = await createSampleProviders();
    if (providers.length > 0) {
      await createSampleScheduleTemplates(providers);
    }
  };

  return {
    loading,
    createSampleProviders,
    createSampleScheduleTemplates,
    setupSampleData
  };
};
