import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface RecurringAppointment {
  id: string;
  patient_name: string;
  patient_id?: string;
  appointment_type: string;
  duration: number;
  frequency: "daily" | "weekly" | "monthly";
  interval_count: number;
  days_of_week?: number[];
  start_date: string;
  end_date?: string;
  max_occurrences?: number;
  is_active: boolean;
  next_scheduled?: string;
  occurrences_created: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useRecurringAppointments = () => {
  const { toast } = useToast();
  const [recurringAppointments, setRecurringAppointments] = useState<RecurringAppointment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecurringAppointments();
  }, []);

  const loadRecurringAppointments = async () => {
    setLoading(true);
    try {
      // Mock recurring appointments data
      const mockData: RecurringAppointment[] = [
        {
          id: '1',
          patient_name: 'John Smith',
          patient_id: 'patient-1',
          appointment_type: 'Physical Therapy',
          duration: 60,
          frequency: 'weekly',
          interval_count: 1,
          days_of_week: [1, 3, 5], // Monday, Wednesday, Friday
          start_date: '2024-01-15',
          is_active: true,
          next_scheduled: '2024-01-22T10:00:00Z',
          occurrences_created: 3,
          notes: 'Weekly PT sessions',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      setRecurringAppointments(mockData);
    } catch (error) {
      console.error("Error loading recurring appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load recurring appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRecurringPattern = async (pattern: Omit<RecurringAppointment, 'id' | 'created_at' | 'updated_at' | 'occurrences_created'>) => {
    setLoading(true);
    try {
      // Mock creation
      console.log('Creating recurring pattern:', pattern);

      const newPattern: RecurringAppointment = {
        ...pattern,
        id: Date.now().toString(),
        occurrences_created: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setRecurringAppointments(prev => [...prev, newPattern]);

      toast({
        title: "Success",
        description: "Recurring appointment pattern created",
      });

      return newPattern;
    } catch (error) {
      console.error("Error creating recurring pattern:", error);
      toast({
        title: "Error",
        description: "Failed to create recurring appointment pattern",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateRecurringPattern = async (id: string, updates: Partial<RecurringAppointment>) => {
    setLoading(true);
    try {
      // Mock update
      console.log('Updating recurring pattern:', id, updates);

      setRecurringAppointments(prev => 
        prev.map(pattern => 
          pattern.id === id 
            ? { ...pattern, ...updates, updated_at: new Date().toISOString() }
            : pattern
        )
      );

      toast({
        title: "Success",
        description: "Recurring appointment pattern updated",
      });

      return true;
    } catch (error) {
      console.error("Error updating recurring pattern:", error);
      toast({
        title: "Error",
        description: "Failed to update recurring appointment pattern",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecurringPattern = async (id: string) => {
    setLoading(true);
    try {
      // Mock deletion
      console.log('Deleting recurring pattern:', id);

      setRecurringAppointments(prev => 
        prev.map(pattern => 
          pattern.id === id 
            ? { ...pattern, is_active: false, updated_at: new Date().toISOString() }
            : pattern
        )
      );

      toast({
        title: "Success",
        description: "Recurring appointment pattern deleted",
      });

      return true;
    } catch (error) {
      console.error("Error deleting recurring pattern:", error);
      toast({
        title: "Error",
        description: "Failed to delete recurring appointment pattern",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    recurringAppointments,
    loading,
    createRecurringPattern,
    updateRecurringPattern,
    deleteRecurringPattern,
    loadRecurringAppointments
  };
};