
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  const generateSOAPFromTranscription = async (transcription: string): Promise<SOAPNote> => {
    setIsGenerating(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock SOAP generation based on transcription
      const soapNote: SOAPNote = {
        subjective: "Patient presents with chief complaint of severe tooth pain in upper right quadrant, onset 3 days ago. Pain described as sharp, throbbing, 8/10 severity. Worsens with cold stimuli. Difficulty sleeping. Denies fever, facial swelling.",
        objective: "Vital signs stable. Extraoral exam: No facial asymmetry or lymphadenopathy. Intraoral exam: Tooth #3 large mesial carious lesion, tender to percussion. Radiographic findings: Periapical radiolucency consistent with abscess.",
        assessment: "Acute apical abscess, tooth #3 (maxillary right first molar)",
        plan: "1. Emergency endodontic therapy\n2. Amoxicillin 500mg TID x 7 days\n3. Ibuprofen 600mg q6h PRN pain\n4. Follow-up in 1 week\n5. Patient education on oral hygiene"
      };
      
      setGeneratedSOAP(soapNote);
      
      toast({
        title: "SOAP Note Generated",
        description: "AI has structured your notes into SOAP format",
      });
      
      return soapNote;
    } catch (error) {
      console.error('Error generating SOAP note:', error);
      toast({
        title: "Generation Error",
        description: "Failed to generate SOAP note from transcription",
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
