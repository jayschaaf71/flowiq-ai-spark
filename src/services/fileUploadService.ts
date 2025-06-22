
import { supabase } from '@/integrations/supabase/client';

export interface FileUploadResult {
  success: boolean;
  file?: {
    id: string;
    path: string;
    name: string;
    size: number;
    type: string;
    url: string;
  };
  error?: string;
}

export class FileUploadService {
  static async uploadPatientFile(
    file: File,
    submissionId: string,
    description?: string
  ): Promise<FileUploadResult> {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${submissionId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('patient-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL for the file
      const { data: urlData } = supabase.storage
        .from('patient-files')
        .getPublicUrl(fileName);

      // Create file attachment record
      const { data: attachmentData, error: attachmentError } = await supabase
        .from('file_attachments')
        .insert({
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: fileName,
          description: description,
          // Link to submission instead of patient for intake files
          soap_note_id: null,
          patient_id: null,
          appointment_id: null
        })
        .select()
        .single();

      if (attachmentError) throw attachmentError;

      return {
        success: true,
        file: {
          id: attachmentData.id,
          path: fileName,
          name: file.name,
          size: file.size,
          type: file.type,
          url: urlData.publicUrl
        }
      };

    } catch (error: any) {
      console.error('File upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteFile(fileId: string): Promise<{ success: boolean; error?: string }> {
    try {
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

      // Delete attachment record
      const { error: dbError } = await supabase
        .from('file_attachments')
        .delete()
        .eq('id', fileId);

      if (dbError) throw dbError;

      return { success: true };
    } catch (error: any) {
      console.error('File deletion error:', error);
      return { success: false, error: error.message };
    }
  }

  static async getSubmissionFiles(submissionId: string) {
    // For now, we'll get files by linking through the submission
    // You might want to add a submission_id column to file_attachments table later
    const { data, error } = await supabase
      .from('file_attachments')
      .select('*')
      .is('patient_id', null)
      .is('soap_note_id', null)
      .is('appointment_id', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
