import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { medicalTerminologyService, type MedicalTerm } from '@/services/medicalTerminologyService';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTranscription {
  originalText: string;
  enhancedText: string;
  medicalTerms: MedicalTerm[];
  confidence: number;
  spellingSuggestions: { term: string; suggestions: string[] }[];
  icd10Suggestions: { condition: string; icd10: string; confidence: number }[];
  processingTime: number;
}

interface EnhancedSOAPNotes {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  icd10Codes: string[];
  suggestedCPTCodes: string[];
  clinicalFlags: string[];
  confidence: number;
}

export const useEnhancedMedicalAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedTranscription, setEnhancedTranscription] = useState<EnhancedTranscription | null>(null);
  const [enhancedSOAP, setEnhancedSOAP] = useState<EnhancedSOAPNotes | null>(null);
  const { toast } = useToast();

  /**
   * Enhanced transcription with medical terminology processing
   */
  const enhanceTranscription = useCallback(async (rawTranscription: string) => {
    if (!rawTranscription?.trim()) {
      toast({
        title: "No transcription to enhance",
        description: "Please provide a transcription to process.",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      console.log('🔬 Enhancing transcription with medical AI...');
      
      // Process with medical terminology service
      const processed = medicalTerminologyService.processText(rawTranscription);
      
      const enhancement: EnhancedTranscription = {
        originalText: rawTranscription,
        enhancedText: processed.processedText,
        medicalTerms: processed.medicalTerms,
        confidence: processed.confidence,
        spellingSuggestions: processed.spellingSuggestions,
        icd10Suggestions: processed.icd10Suggestions,
        processingTime: Date.now() - startTime
      };

      setEnhancedTranscription(enhancement);
      
      toast({
        title: "Transcription Enhanced",
        description: `Processed ${processed.medicalTerms.length} medical terms with ${Math.round(processed.confidence * 100)}% confidence.`,
      });

      return enhancement;
    } catch (error) {
      console.error('❌ Enhancement error:', error);
      toast({
        title: "Enhancement Failed",
        description: "Failed to enhance transcription with medical AI.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast]);

  /**
   * Generate enhanced SOAP notes with medical intelligence
   */
  const generateEnhancedSOAP = useCallback(async (transcription: string, patientContext?: any) => {
    if (!transcription?.trim()) {
      toast({
        title: "No transcription provided",
        description: "Please provide a transcription to generate SOAP notes.",
        variant: "destructive",
      });
      return null;
    }

    setIsProcessing(true);

    try {
      console.log('🏥 Generating enhanced SOAP notes...');

      // First enhance the transcription
      const enhanced = await enhanceTranscription(transcription);
      if (!enhanced) return null;

      // Generate enhanced SOAP using AI with medical context
      const { data, error } = await supabase.functions.invoke('ai-soap-generation', {
        body: {
          transcription: enhanced.enhancedText,
          medicalTerms: enhanced.medicalTerms,
          icd10Suggestions: enhanced.icd10Suggestions,
          patientContext,
          enhancedProcessing: true
        }
      });

      if (error) {
        throw new Error(error.message || 'SOAP generation failed');
      }

      // Parse and enhance the SOAP response
      const soapData = typeof data === 'string' ? JSON.parse(data) : data;
      
      const enhancedSOAP: EnhancedSOAPNotes = {
        subjective: soapData.subjective || '',
        objective: soapData.objective || '',
        assessment: soapData.assessment || '',
        plan: soapData.plan || '',
        icd10Codes: enhanced.icd10Suggestions.map(s => s.icd10),
        suggestedCPTCodes: soapData.cptCodes || [],
        clinicalFlags: soapData.clinicalFlags || [],
        confidence: Math.min(enhanced.confidence, soapData.confidence || 0.8)
      };

      setEnhancedSOAP(enhancedSOAP);

      toast({
        title: "Enhanced SOAP Generated",
        description: `Generated with ${enhancedSOAP.icd10Codes.length} ICD-10 codes and ${enhancedSOAP.clinicalFlags.length} clinical flags.`,
      });

      return enhancedSOAP;
    } catch (error) {
      console.error('❌ Enhanced SOAP generation error:', error);
      toast({
        title: "SOAP Generation Failed",
        description: "Failed to generate enhanced SOAP notes.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast, enhanceTranscription]);

  /**
   * Validate medication mentions in text
   */
  const validateMedications = useCallback((text: string) => {
    const medications = text.match(/\b\w+\s*(?:mg|mcg|g|ml|tablet|capsule|pill)\b/gi) || [];
    
    return medications.map(med => {
      const medName = med.split(/\s+/)[0];
      return medicalTerminologyService.validateMedication(medName);
    });
  }, []);

  /**
   * Check for potential drug interactions
   */
  const checkDrugInteractions = useCallback(async (medications: string[]) => {
    // This could be enhanced with a real drug interaction API
    const interactions: string[] = [];
    
    // Basic interaction checks
    if (medications.includes('warfarin') && medications.includes('aspirin')) {
      interactions.push('⚠️ Warfarin + Aspirin: Increased bleeding risk');
    }
    
    if (medications.includes('metformin') && medications.includes('alcohol')) {
      interactions.push('⚠️ Metformin + Alcohol: Risk of lactic acidosis');
    }
    
    return interactions;
  }, []);

  /**
   * Reset all enhanced data
   */
  const resetEnhancedData = useCallback(() => {
    setEnhancedTranscription(null);
    setEnhancedSOAP(null);
  }, []);

  return {
    isProcessing,
    enhancedTranscription,
    enhancedSOAP,
    enhanceTranscription,
    generateEnhancedSOAP,
    validateMedications,
    checkDrugInteractions,
    resetEnhancedData
  };
};