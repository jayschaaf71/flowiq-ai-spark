import { useState, useEffect } from 'react';
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
      // Mock SOAP notes data
      const mockNotes: SOAPNote[] = [
        {
          id: '1',
          patient_id: 'patient-1',
          provider_id: 'provider-1',
          appointment_id: 'appointment-1',
          subjective: 'Patient reports lower back pain for 3 days',
          objective: 'Range of motion limited, tender to touch L4-L5',
          assessment: 'Acute lower back strain',
          plan: 'Chiropractic adjustment, ice therapy, follow up in 1 week',
          is_ai_generated: true,
          ai_confidence_score: 0.95,
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          visit_date: new Date().toISOString().split('T')[0],
          chief_complaint: 'Lower back pain',
          diagnosis_codes: ['M54.5'],
          vital_signs: {
            blood_pressure: '120/80',
            heart_rate: 72,
            temperature: 98.6
          }
        }
      ];
      
      setSOAPNotes(mockNotes);
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
      // Mock SOAP note creation
      console.log('Creating SOAP note:', note);
      
      const newNote: SOAPNote = {
        ...note,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
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
      // Mock SOAP note update
      console.log('Updating SOAP note:', id, updates);

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
      // Mock SOAP note deletion
      console.log('Deleting SOAP note:', id);

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