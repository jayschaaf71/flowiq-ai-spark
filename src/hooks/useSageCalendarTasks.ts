import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

export type SageCalendarTask = Tables<"sage_calendar_tasks">;
export type NewSageCalendarTask = TablesInsert<"sage_calendar_tasks">;

export const useSageCalendarTasks = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery({
    queryKey: ['sage-calendar-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sage_calendar_tasks')
        .select(`
          *,
          appointments(patient_name, date, time, appointment_type),
          patients(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SageCalendarTask[];
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: NewSageCalendarTask) => {
      const { data, error } = await supabase
        .from('sage_calendar_tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sage-calendar-tasks'] });
      toast.success('SAGE task created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create SAGE task');
      console.error('Error creating SAGE task:', error);
    },
  });

  const updateTask = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<SageCalendarTask> }) => {
      const { data, error } = await supabase
        .from('sage_calendar_tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sage-calendar-tasks'] });
      toast.success('SAGE task updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update SAGE task');
      console.error('Error updating SAGE task:', error);
    },
  });

  const completeTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from('sage_calendar_tasks')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sage-calendar-tasks'] });
      toast.success('Task completed');
    },
    onError: (error) => {
      toast.error('Failed to complete task');
      console.error('Error completing task:', error);
    },
  });

  return {
    tasks,
    isLoading,
    error,
    createTask: createTask.mutate,
    updateTask: updateTask.mutate,
    completeTask: completeTask.mutate,
    isCreating: createTask.isPending,
    isUpdating: updateTask.isPending,
  };
};