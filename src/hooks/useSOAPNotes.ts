import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SOAPNote {
  id: string;
  patient_id: string;
  provider_id?: string;
  appointment_id?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  transcription_text?: string;
  is_ai_generated: boolean;
  ai_confidence_score?: number;
  status: string;
  signed_at?: string;
  signed_by?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  visit_date: string;
  chief_complaint?: string;
  diagnosis_codes?: string[];
  vital_signs?: any;
}

export const useSOAPNotes = () => {
  const [soapNotes, setSOAPNotes] = useState<SOAPNote[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSOAPNotes = async () => {
    setLoading(true);
    try {
      // Fetch SOAP notes from voice_recordings table
      const { data: recordings, error } = await supabase
        .from('voice_recordings')
        .select(`
          id,
          patient_id,
          soap_notes,
          created_at,
          updated_at,
          transcription,
          confidence_score,
          status,
          user_id
        `)
        .not('soap_notes', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching SOAP notes:', error);
        throw error;
      }

      // Convert voice recordings with SOAP notes to SOAPNote format
      const convertedNotes: SOAPNote[] = (recordings || []).map(recording => {
        const soapData = recording.soap_notes as any;
        return {
          id: recording.id,
          patient_id: recording.patient_id || '',
          subjective: soapData?.subjective || '',
          objective: soapData?.objective || '',
          assessment: soapData?.assessment || '',
          plan: soapData?.plan || '',
          transcription_text: recording.transcription || '',
          is_ai_generated: true,
          ai_confidence_score: recording.confidence_score || 0.8,
          status: recording.status === 'completed' ? 'signed' : 'draft',
          created_at: recording.created_at,
          updated_at: recording.updated_at,
          created_by: recording.user_id,
          visit_date: recording.created_at.split('T')[0],
          chief_complaint: soapData?.chief_complaint || '',
          diagnosis_codes: soapData?.icd10Codes || [],
          vital_signs: soapData?.vital_signs || null
        };
      });
      
      setSOAPNotes(convertedNotes);
    } catch (error) {
      console.error('Error fetching SOAP notes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch SOAP notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSOAPNote = async (note: Omit<SOAPNote, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      // Get current user and tenant ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Authentication required');
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('current_tenant_id')
        .eq('id', user.id)
        .single();

      if (!profile?.current_tenant_id) {
        throw new Error('No tenant found for user');
      }

      // Create a new voice recording entry with SOAP note data
      const soapData = {
        subjective: note.subjective,
        objective: note.objective,
        assessment: note.assessment,
        plan: note.plan,
        chief_complaint: note.chief_complaint,
        icd10Codes: note.diagnosis_codes,
        vital_signs: note.vital_signs
      };

      const { data, error } = await supabase
        .from('voice_recordings')
        .insert({
          tenant_id: profile.current_tenant_id,
          user_id: user.id,
          patient_id: note.patient_id,
          soap_notes: soapData,
          transcription: note.transcription_text,
          ai_summary: `${note.subjective} ${note.assessment}`.substring(0, 500),
          source: 'Manual Entry',
          status: note.status === 'signed' ? 'completed' : 'processing',
          confidence_score: note.ai_confidence_score || 1.0
        })
        .select()
        .single();

      if (error) throw error;

      // Convert back to SOAPNote format and add to state
      const newNote: SOAPNote = {
        id: data.id,
        patient_id: data.patient_id || '',
        subjective: soapData.subjective || '',
        objective: soapData.objective || '',
        assessment: soapData.assessment || '',
        plan: soapData.plan || '',
        transcription_text: data.transcription || '',
        is_ai_generated: true,
        ai_confidence_score: data.confidence_score || 1.0,
        status: note.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
        created_by: data.user_id,
        visit_date: data.created_at.split('T')[0],
        chief_complaint: soapData.chief_complaint || '',
        diagnosis_codes: soapData.icd10Codes || [],
        vital_signs: soapData.vital_signs
      };

      setSOAPNotes(prev => [newNote, ...prev]);

      toast({
        title: "Success",
        description: "SOAP note created successfully",
      });

      return newNote;
    } catch (error) {
      console.error('Error creating SOAP note:', error);
      toast({
        title: "Error",
        description: "Failed to create SOAP note",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSOAPNote = async (id: string, updates: Partial<SOAPNote>) => {
    setLoading(true);
    try {
      // Update the SOAP note data in voice_recordings table
      const currentNote = soapNotes.find(note => note.id === id);
      if (!currentNote) {
        throw new Error('SOAP note not found');
      }

      const updatedSoapData = {
        subjective: updates.subjective || currentNote.subjective,
        objective: updates.objective || currentNote.objective,
        assessment: updates.assessment || currentNote.assessment,
        plan: updates.plan || currentNote.plan,
        chief_complaint: updates.chief_complaint || currentNote.chief_complaint,
        icd10Codes: updates.diagnosis_codes || currentNote.diagnosis_codes,
        vital_signs: updates.vital_signs || currentNote.vital_signs
      };

      const { error } = await supabase
        .from('voice_recordings')
        .update({
          soap_notes: updatedSoapData,
          status: updates.status === 'signed' ? 'completed' : 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setSOAPNotes(prev => 
        prev.map(note => 
          note.id === id 
            ? { ...note, ...updates, updated_at: new Date().toISOString() }
            : note
        )
      );

      toast({
        title: "Success",
        description: "SOAP note updated successfully",
      });

      return true;
    } catch (error) {
      console.error('Error updating SOAP note:', error);
      toast({
        title: "Error",
        description: "Failed to update SOAP note",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSOAPNote = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('voice_recordings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSOAPNotes(prev => prev.filter(note => note.id !== id));

      toast({
        title: "Success",
        description: "SOAP note deleted successfully",
      });

      return true;
    } catch (error) {
      console.error('Error deleting SOAP note:', error);
      toast({
        title: "Error",
        description: "Failed to delete SOAP note",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signSOAPNote = async (id: string, signedBy: string) => {
    return updateSOAPNote(id, {
      status: 'signed',
      signed_at: new Date().toISOString(),
      signed_by: signedBy
    });
  };

  useEffect(() => {
    fetchSOAPNotes();
  }, []);

  return {
    soapNotes,
    loading,
    createSOAPNote,
    updateSOAPNote,
    deleteSOAPNote,
    signSOAPNote,
    fetchSOAPNotes
  };
};