
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tables, TablesInsert } from "@/integrations/supabase/types";

type FileAttachment = Tables<"file_attachments">;
type NewFileAttachment = TablesInsert<"file_attachments">;

export const useFileAttachments = (patientId?: string, soapNoteId?: string, appointmentId?: string) => {
  return useQuery({
    queryKey: ['file_attachments', patientId, soapNoteId, appointmentId],
    queryFn: async () => {
      let query = supabase
        .from('file_attachments')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }
      if (soapNoteId) {
        query = query.eq('soap_note_id', soapNoteId);
      }
      if (appointmentId) {
        query = query.eq('appointment_id', appointmentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
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
      soapNoteId, 
      appointmentId, 
      description 
    }: {
      file: File;
      patientId?: string;
      soapNoteId?: string;
      appointmentId?: string;
      description?: string;
    }) => {
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patient-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create file attachment record
      const { data, error } = await supabase
        .from('file_attachments')
        .insert({
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: uploadData.path,
          description,
          patient_id: patientId,
          soap_note_id: soapNoteId,
          appointment_id: appointmentId,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
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
      // Get file info first
      const { data: fileData, error: fetchError } = await supabase
        .from('file_attachments')
        .select('storage_path')
        .eq('id', fileId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('patient-files')
        .remove([fileData.storage_path]);

      if (storageError) throw storageError;

      // Delete record
      const { error } = await supabase
        .from('file_attachments')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
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
      const { data, error } = await supabase.storage
        .from('patient-files')
        .download(storagePath);

      if (error) throw error;
      return data;
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
