
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const useSOAPGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSOAP, setGeneratedSOAP] = useState<SOAPNote | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const generateSOAPFromTranscription = async (transcription: string): Promise<SOAPNote> => {
    setIsGenerating(true);
    try {
      console.log('Starting SOAP generation from transcription:', transcription.substring(0, 100) + '...');

      const { data, error } = await supabase.functions.invoke('ai-soap-generation', {
        body: {
          transcription,
          userId: user?.id,
          patientContext: null // Can be enhanced later with patient-specific context
        }
      });

      if (error) {
        throw error;
      }

      const soapNote = data.soapNote as SOAPNote;
      setGeneratedSOAP(soapNote);
      
      toast({
        title: "SOAP Note Generated",
        description: "AI has successfully structured your notes into SOAP format",
      });
      
      return soapNote;
    } catch (error) {
      console.error('Error generating SOAP note:', error);
      
      // Provide helpful error messages
      let errorMessage = "Failed to generate SOAP note";
      if (error.message?.includes('OpenAI API key')) {
        errorMessage = "AI service not configured. Please contact administrator.";
      } else if (error.message?.includes('network')) {
        errorMessage = "Network error. Please try again.";
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
    setGeneratedSOAP(null);
  };

  return {
    isGenerating,
    generatedSOAP,
    generateSOAPFromTranscription,
    clearSOAP
  };
};
