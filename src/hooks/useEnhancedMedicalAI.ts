import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { medicalTerminologyService, type MedicalTerm } from '@/services/medicalTerminologyService';
import { useToast } from '@/hooks/use-toast';
import { useSpecialty } from '@/contexts/SpecialtyContext';
import type { SpecialtyType } from '@/utils/specialtyConfig';

interface EnhancedTranscription {
  originalText: string;
  enhancedText: string;
  medicalTerms: MedicalTerm[];
  confidence: number;
  spellingSuggestions: { term: string; suggestions: string[] }[];
  icd10Suggestions: { condition: string; icd10: string; confidence: number }[];
  procedureSuggestions: { name: string; cptCode: string; confidence: number }[];
  clinicalFlags: string[];
  processingTime: number;
  specialty?: SpecialtyType;
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
  specialty?: SpecialtyType;
}

export const useEnhancedMedicalAI = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [enhancedTranscription, setEnhancedTranscription] = useState<EnhancedTranscription | null>(null);
  const [enhancedSOAP, setEnhancedSOAP] = useState<EnhancedSOAPNotes | null>(null);
  const { toast } = useToast();
  const { specialty } = useSpecialty();

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
      
      // Process with medical terminology service (specialty-aware)
      const processed = medicalTerminologyService.processText(rawTranscription, specialty as SpecialtyType);
      
      const enhancement: EnhancedTranscription = {
        originalText: rawTranscription,
        enhancedText: processed.processedText,
        medicalTerms: processed.medicalTerms,
        confidence: processed.confidence,
        spellingSuggestions: processed.spellingSuggestions,
        icd10Suggestions: processed.icd10Suggestions,
        procedureSuggestions: processed.procedureSuggestions,
        clinicalFlags: processed.clinicalFlags,
        processingTime: Date.now() - startTime,
        specialty: processed.specialty
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

      // Process with medical terminology service directly
      const processed = medicalTerminologyService.processText(transcription, specialty as SpecialtyType);

      // Get current user for the edge function
      const { data: { user } } = await supabase.auth.getUser();
      
      // Generate enhanced SOAP using AI with medical context
      const { data, error } = await supabase.functions.invoke('ai-soap-generation', {
        body: {
          transcription: processed.processedText,
          userId: user?.id,
          medicalTerms: processed.medicalTerms,
          icd10Suggestions: processed.icd10Suggestions,
          patientContext,
          enhancedProcessing: true,
          specialty: specialty
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Failed to send a request to the Edge Function`);
      }

      // Parse and enhance the SOAP response
      const soapData = typeof data === 'string' ? JSON.parse(data) : data;
      
      const enhancedSOAP: EnhancedSOAPNotes = {
        subjective: soapData.subjective || '',
        objective: soapData.objective || '',
        assessment: soapData.assessment || '',
        plan: soapData.plan || '',
        icd10Codes: processed.icd10Suggestions.map(s => s.icd10),
        suggestedCPTCodes: soapData.cptCodes || [],
        clinicalFlags: soapData.clinicalFlags || [],
        confidence: Math.min(processed.confidence, soapData.confidence || 0.8)
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
  }, [toast, specialty]);

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
   * Update enhanced SOAP data
   */
  const updateEnhancedSOAP = useCallback((updatedSOAP: Partial<EnhancedSOAPNotes>) => {
    setEnhancedSOAP(prev => prev ? { ...prev, ...updatedSOAP } : null);
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
    updateEnhancedSOAP,
    validateMedications,
    checkDrugInteractions,
    resetEnhancedData
  };
};