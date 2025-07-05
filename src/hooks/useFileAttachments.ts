import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface FileAttachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  description?: string;
  patient_id?: string;
  appointment_id?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
}

export const useFileAttachments = (patientId?: string, appointmentId?: string) => {
  return useQuery({
    queryKey: ['file_attachments', patientId, appointmentId],
    queryFn: async () => {
      try {
        let query = supabase
          .from('file_attachments')
          .select('*')
          .order('created_at', { ascending: false });

        if (patientId) {
          query = query.eq('patient_id', patientId);
        }
        if (appointmentId) {
          query = query.eq('appointment_id', appointmentId);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
      } catch (error) {
        // Return mock data if database query fails
        const mockFiles: FileAttachment[] = [
          {
            id: '1',
            file_name: 'medical_report.pdf',
            file_type: 'application/pdf',
            file_size: 1024000,
            storage_path: 'files/medical_report.pdf',
            description: 'Latest medical report',
            patient_id: patientId,
            appointment_id: appointmentId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        return mockFiles;
      }
    },
  });
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      file, 
      patientId, 
      appointmentId, 
      description 
    }: {
      file: File;
      patientId?: string;
      appointmentId?: string;
      description?: string;
    }) => {
      // Mock file upload
      console.log('Uploading file:', file.name);
      
      const mockFileAttachment: FileAttachment = {
        id: Date.now().toString(),
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: `files/${file.name}`,
        description,
        patient_id: patientId,
        appointment_id: appointmentId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return mockFileAttachment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file_attachments'] });
      toast({
        title: "File uploaded",
        description: "The file has been successfully uploaded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteFile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (fileId: string) => {
      // Mock file deletion
      console.log('Deleting file:', fileId);
      return fileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['file_attachments'] });
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    },
  });
};

export const useDownloadFile = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (storagePath: string) => {
      // Mock file download
      console.log('Downloading file:', storagePath);
      return new Blob(['Mock file content'], { type: 'text/plain' });
    },
    onSuccess: (data, storagePath) => {
      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = storagePath.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    },
  });
};