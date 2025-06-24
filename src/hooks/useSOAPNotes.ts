
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  generated_by_ai: boolean;
  confidence_score?: number;
  status: string;
  signed_at?: string;
  signed_by?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export const useSOAPNotes = () => {
  const [soapNotes, setSOAPNotes] = useState<SOAPNote[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchSOAPNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('soap_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSOAPNotes(data || []);
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

  const createSOAPNote = async (soapData: Partial<SOAPNote>) => {
    try {
      const { data, error } = await supabase
        .from('soap_notes')
        .insert([soapData])
        .select()
        .single();

      if (error) throw error;

      setSOAPNotes(prev => [data, ...prev]);
      
      toast({
        title: "SOAP Note Created",
        description: "SOAP note has been saved successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating SOAP note:', error);
      toast({
        title: "Error",
        description: "Failed to create SOAP note",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateSOAPNote = async (id: string, updates: Partial<SOAPNote>) => {
    try {
      const { data, error } = await supabase
        .from('soap_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSOAPNotes(prev => prev.map(note => 
        note.id === id ? { ...note, ...data } : note
      ));
      
      toast({
        title: "SOAP Note Updated",
        description: "Changes have been saved successfully",
      });
      
      return data;
    } catch (error) {
      console.error('Error updating SOAP note:', error);
      toast({
        title: "Error",
        description: "Failed to update SOAP note",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchSOAPNotes();
  }, []);

  return {
    soapNotes,
    loading,
    fetchSOAPNotes,
    createSOAPNote,
    updateSOAPNote
  };
};
