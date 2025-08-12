
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

// Use sessionStorage to persist SOAP state across tab switches
const SOAP_STORAGE_KEY = 'scribe_generated_soap';

export const useSOAPGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSOAP, setGeneratedSOAP] = useState<SOAPNote | null>(() => {
    // Initialize from sessionStorage if available
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(SOAP_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Persist SOAP to sessionStorage whenever it changes
  useEffect(() => {
    if (generatedSOAP) {
      sessionStorage.setItem(SOAP_STORAGE_KEY, JSON.stringify(generatedSOAP));
    } else {
      sessionStorage.removeItem(SOAP_STORAGE_KEY);
    }
  }, [generatedSOAP]);

  const generateSOAPFromTranscription = async (transcription: string): Promise<SOAPNote> => {
    console.log('useSOAPGeneration: Starting generation process');
    setIsGenerating(true);

    try {
      console.log('useSOAPGeneration: Calling supabase function with transcription:', transcription.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('ai-soap-generation', {
        body: {
          transcription,
          userId: user?.id || 'demo-user',
          patientContext: null
        }
      });

      console.log('useSOAPGeneration: Supabase function response:', { data, error });

      if (error) {
        console.error('useSOAPGeneration: Supabase function error:', error);
        throw error;
      }

      // The edge function returns the SOAP note directly, not wrapped in a soapNote property
      const soapNote = data as SOAPNote;
      console.log('useSOAPGeneration: Parsed SOAP note:', soapNote);

      // Validate that we have the required SOAP fields
      if (!soapNote.subjective && !soapNote.objective && !soapNote.assessment && !soapNote.plan) {
        throw new Error('Invalid SOAP note format received from AI service');
      }

      setGeneratedSOAP(soapNote);

      toast({
        title: "SOAP Note Generated",
        description: "AI has successfully structured your notes into SOAP format",
      });

      return soapNote;
    } catch (error) {
      console.error('useSOAPGeneration: Error in generation process:', error);

      let errorMessage = "Failed to generate SOAP note";
      if (error.message?.includes('OpenAI API key')) {
        errorMessage = "AI service not configured. Please contact administrator.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please try again.";
      } else if (error.message?.includes('Invalid SOAP note format')) {
        errorMessage = "AI service returned invalid format. Please try again.";
      }

      toast({
        title: "Generation Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const clearSOAP = () => {
    console.log('useSOAPGeneration: Clearing SOAP note');
    setGeneratedSOAP(null);
    sessionStorage.removeItem(SOAP_STORAGE_KEY);
  };

  console.log('useSOAPGeneration: Current state - isGenerating:', isGenerating, 'generatedSOAP:', !!generatedSOAP);

  return {
    isGenerating,
    generatedSOAP,
    generateSOAPFromTranscription,
    clearSOAP
  };
};
