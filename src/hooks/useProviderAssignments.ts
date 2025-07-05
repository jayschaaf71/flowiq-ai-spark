import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface ProviderAssignment {
  id: string;
  patient_id: string;
  provider_id: string;
  assigned_by?: string;
  assigned_at: string;
  is_active: boolean;
  notes?: string;
  providers?: {
    id: string;
    first_name: string;
    last_name: string;
    specialty?: string;
    email?: string;
  };
}

interface NewProviderAssignment {
  patient_id: string;
  provider_id: string;
  notes?: string;
}

export const useProviderAssignments = (patientId?: string) => {
  return useQuery({
    queryKey: ['provider_assignments', patientId],
    queryFn: async () => {
      // Mock provider assignments data
      const mockAssignments: ProviderAssignment[] = [
        {
          id: '1',
          patient_id: patientId || 'patient-1',
          provider_id: 'provider-1',
          assigned_at: new Date().toISOString(),
          is_active: true,
          providers: {
            id: 'provider-1',
            first_name: 'Dr. John',
            last_name: 'Smith',
            specialty: 'Chiropractic',
            email: 'dr.smith@clinic.com'
          }
        }
      ];

      return patientId ? mockAssignments.filter(a => a.patient_id === patientId) : mockAssignments;
    },
    enabled: !!patientId,
  });
};

export const useAssignProvider = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignment: NewProviderAssignment) => {
      // Mock provider assignment
      console.log('Assigning provider:', assignment);
      
      const mockAssignment: ProviderAssignment = {
        id: Date.now().toString(),
        ...assignment,
        assigned_at: new Date().toISOString(),
        is_active: true,
        providers: {
          id: assignment.provider_id,
          first_name: 'Dr. John',
          last_name: 'Smith',
          specialty: 'Chiropractic',
          email: 'dr.smith@clinic.com'
        }
      };

      return mockAssignment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['provider_assignments', data.patient_id] });
      toast({
        title: "Provider assigned",
        description: "The provider has been successfully assigned to this patient.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to assign provider",
        variant: "destructive",
      });
    },
  });
};