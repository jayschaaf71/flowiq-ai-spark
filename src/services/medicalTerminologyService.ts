interface MedicalTerm {
  term: string;
  standardized: string;
  category: 'medication' | 'condition' | 'procedure' | 'anatomy' | 'symptom' | 'other';
  confidence: number;
  icd10?: string;
  cptCode?: string;
}

interface MedicalAbbreviation {
  abbreviation: string;
  expansion: string;
  context: string;
}

interface DrugValidation {
  name: string;
  isValid: boolean;
  suggestions: string[];
  interactions?: string[];
  dosageGuidance?: string;
}

class MedicalTerminologyService {
  // Common medical abbreviations with context
  private medicalAbbreviations: MedicalAbbreviation[] = [
    { abbreviation: 'BP', expansion: 'blood pressure', context: 'vital signs' },
    { abbreviation: 'HR', expansion: 'heart rate', context: 'vital signs' },
    { abbreviation: 'RR', expansion: 'respiratory rate', context: 'vital signs' },
    { abbreviation: 'O2', expansion: 'oxygen', context: 'respiratory' },
    { abbreviation: 'SOB', expansion: 'shortness of breath', context: 'respiratory' },
    { abbreviation: 'DOE', expansion: 'dyspnea on exertion', context: 'respiratory' },
    { abbreviation: 'CP', expansion: 'chest pain', context: 'cardiovascular' },
    { abbreviation: 'MI', expansion: 'myocardial infarction', context: 'cardiovascular' },
    { abbreviation: 'CHF', expansion: 'congestive heart failure', context: 'cardiovascular' },
    { abbreviation: 'HTN', expansion: 'hypertension', context: 'cardiovascular' },
    { abbreviation: 'DM', expansion: 'diabetes mellitus', context: 'endocrine' },
    { abbreviation: 'URI', expansion: 'upper respiratory infection', context: 'respiratory' },
    { abbreviation: 'UTI', expansion: 'urinary tract infection', context: 'genitourinary' },
    { abbreviation: 'N/V', expansion: 'nausea and vomiting', context: 'gastrointestinal' },
    { abbreviation: 'abd', expansion: 'abdomen', context: 'anatomy' },
    { abbreviation: 'c/o', expansion: 'complains of', context: 'subjective' },
    { abbreviation: 'w/', expansion: 'with', context: 'general' },
    { abbreviation: 'w/o', expansion: 'without', context: 'general' },
    { abbreviation: 'pt', expansion: 'patient', context: 'general' },
    { abbreviation: 'hx', expansion: 'history', context: 'general' },
    { abbreviation: 'tx', expansion: 'treatment', context: 'general' },
    { abbreviation: 'dx', expansion: 'diagnosis', context: 'general' },
    { abbreviation: 'sx', expansion: 'symptoms', context: 'general' },
    { abbreviation: 'f/u', expansion: 'follow up', context: 'general' },
    { abbreviation: 'WNL', expansion: 'within normal limits', context: 'assessment' },
    { abbreviation: 'NAD', expansion: 'no acute distress', context: 'assessment' },
    { abbreviation: 'HEENT', expansion: 'head, eyes, ears, nose, throat', context: 'examination' },
    { abbreviation: 'CV', expansion: 'cardiovascular', context: 'examination' },
    { abbreviation: 'resp', expansion: 'respiratory', context: 'examination' },
    { abbreviation: 'GI', expansion: 'gastrointestinal', context: 'examination' },
    { abbreviation: 'GU', expansion: 'genitourinary', context: 'examination' },
    { abbreviation: 'neuro', expansion: 'neurological', context: 'examination' },
    { abbreviation: 'MSK', expansion: 'musculoskeletal', context: 'examination' },
    { abbreviation: 'psych', expansion: 'psychiatric', context: 'examination' },
    { abbreviation: 'BID', expansion: 'twice daily', context: 'medication' },
    { abbreviation: 'TID', expansion: 'three times daily', context: 'medication' },
    { abbreviation: 'QID', expansion: 'four times daily', context: 'medication' },
    { abbreviation: 'QD', expansion: 'once daily', context: 'medication' },
    { abbreviation: 'PRN', expansion: 'as needed', context: 'medication' },
    { abbreviation: 'PO', expansion: 'by mouth', context: 'medication' },
    { abbreviation: 'IV', expansion: 'intravenous', context: 'medication' },
    { abbreviation: 'IM', expansion: 'intramuscular', context: 'medication' },
    { abbreviation: 'SQ', expansion: 'subcutaneous', context: 'medication' },
  ];

  // Common medication names and their standardized forms
  private medicationDatabase: { [key: string]: { name: string; genericName?: string; category: string } } = {
    'tylenol': { name: 'Acetaminophen', genericName: 'acetaminophen', category: 'analgesic' },
    'advil': { name: 'Ibuprofen', genericName: 'ibuprofen', category: 'NSAID' },
    'motrin': { name: 'Ibuprofen', genericName: 'ibuprofen', category: 'NSAID' },
    'aspirin': { name: 'Aspirin', genericName: 'aspirin', category: 'antiplatelet' },
    'aleve': { name: 'Naproxen', genericName: 'naproxen', category: 'NSAID' },
    'lipitor': { name: 'Atorvastatin', genericName: 'atorvastatin', category: 'statin' },
    'crestor': { name: 'Rosuvastatin', genericName: 'rosuvastatin', category: 'statin' },
    'zocor': { name: 'Simvastatin', genericName: 'simvastatin', category: 'statin' },
    'metformin': { name: 'Metformin', genericName: 'metformin', category: 'antidiabetic' },
    'lisinopril': { name: 'Lisinopril', genericName: 'lisinopril', category: 'ACE inhibitor' },
    'amlodipine': { name: 'Amlodipine', genericName: 'amlodipine', category: 'calcium channel blocker' },
    'metoprolol': { name: 'Metoprolol', genericName: 'metoprolol', category: 'beta blocker' },
    'omeprazole': { name: 'Omeprazole', genericName: 'omeprazole', category: 'PPI' },
    'pantoprazole': { name: 'Pantoprazole', genericName: 'pantoprazole', category: 'PPI' },
    'synthroid': { name: 'Levothyroxine', genericName: 'levothyroxine', category: 'thyroid hormone' },
    'warfarin': { name: 'Warfarin', genericName: 'warfarin', category: 'anticoagulant' },
    'eliquis': { name: 'Apixaban', genericName: 'apixaban', category: 'anticoagulant' },
    'xarelto': { name: 'Rivaroxaban', genericName: 'rivaroxaban', category: 'anticoagulant' },
  };

  // Common medical conditions with ICD-10 codes
  private conditionDatabase: { [key: string]: { name: string; icd10: string; category: string } } = {
    'hypertension': { name: 'Essential Hypertension', icd10: 'I10', category: 'cardiovascular' },
    'diabetes': { name: 'Type 2 Diabetes Mellitus', icd10: 'E11.9', category: 'endocrine' },
    'copd': { name: 'Chronic Obstructive Pulmonary Disease', icd10: 'J44.1', category: 'respiratory' },
    'asthma': { name: 'Asthma', icd10: 'J45.9', category: 'respiratory' },
    'pneumonia': { name: 'Pneumonia', icd10: 'J18.9', category: 'respiratory' },
    'depression': { name: 'Major Depressive Disorder', icd10: 'F32.9', category: 'psychiatric' },
    'anxiety': { name: 'Anxiety Disorder', icd10: 'F41.9', category: 'psychiatric' },
    'migraine': { name: 'Migraine', icd10: 'G43.909', category: 'neurological' },
    'osteoarthritis': { name: 'Osteoarthritis', icd10: 'M19.9', category: 'musculoskeletal' },
    'hyperlipidemia': { name: 'Hyperlipidemia', icd10: 'E78.5', category: 'endocrine' },
  };

  /**
   * Expands medical abbreviations in text
   */
  expandAbbreviations(text: string): string {
    let expandedText = text;
    
    this.medicalAbbreviations.forEach(abbrev => {
      // Use word boundaries to avoid partial matches
      const regex = new RegExp(`\\b${abbrev.abbreviation}\\b`, 'gi');
      expandedText = expandedText.replace(regex, `${abbrev.abbreviation} (${abbrev.expansion})`);
    });
    
    return expandedText;
  }

  /**
   * Identifies and standardizes medical terms in text
   */
  identifyMedicalTerms(text: string): MedicalTerm[] {
    const terms: MedicalTerm[] = [];
    const words = text.toLowerCase().split(/\s+/);
    
    // Check for medications
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (this.medicationDatabase[cleanWord]) {
        const med = this.medicationDatabase[cleanWord];
        terms.push({
          term: word,
          standardized: med.name,
          category: 'medication',
          confidence: 0.9
        });
      }
    });
    
    // Check for conditions
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (this.conditionDatabase[cleanWord]) {
        const condition = this.conditionDatabase[cleanWord];
        terms.push({
          term: word,
          standardized: condition.name,
          category: 'condition',
          confidence: 0.85,
          icd10: condition.icd10
        });
      }
    });
    
    return terms;
  }

  /**
   * Validates medication names and suggests corrections
   */
  validateMedication(medicationName: string): DrugValidation {
    const cleanName = medicationName.toLowerCase().replace(/[^\w]/g, '');
    
    if (this.medicationDatabase[cleanName]) {
      const med = this.medicationDatabase[cleanName];
      return {
        name: medicationName,
        isValid: true,
        suggestions: [med.name],
        dosageGuidance: this.getDosageGuidance(med.name)
      };
    }
    
    // Find similar medications
    const suggestions = Object.keys(this.medicationDatabase)
      .filter(key => key.includes(cleanName) || cleanName.includes(key))
      .map(key => this.medicationDatabase[key].name)
      .slice(0, 3);
    
    return {
      name: medicationName,
      isValid: false,
      suggestions
    };
  }

  /**
   * Provides basic dosage guidance for common medications
   */
  private getDosageGuidance(medicationName: string): string {
    const dosageGuide: { [key: string]: string } = {
      'Acetaminophen': 'Adult: 325-650mg every 4-6 hours, max 4g/day',
      'Ibuprofen': 'Adult: 200-400mg every 4-6 hours, max 1.2g/day',
      'Aspirin': 'Adult: 325-650mg every 4 hours, max 4g/day',
      'Metformin': 'Adult: Start 500mg BID, may increase to max 2.5g/day',
      'Lisinopril': 'Adult: Start 10mg daily, may increase to max 40mg/day',
      'Amlodipine': 'Adult: Start 5mg daily, may increase to max 10mg/day'
    };
    
    return dosageGuide[medicationName] || 'Consult prescribing information for dosage';
  }

  /**
   * Spell-checks medical terms
   */
  spellCheckMedical(text: string): { originalText: string; suggestions: { term: string; suggestions: string[] }[] } {
    const words = text.split(/\s+/);
    const suggestions: { term: string; suggestions: string[] }[] = [];
    
    words.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      
      // Check if it's a known medical term
      const isKnownMedication = this.medicationDatabase[cleanWord];
      const isKnownCondition = this.conditionDatabase[cleanWord];
      const isKnownAbbreviation = this.medicalAbbreviations.find(
        abbrev => abbrev.abbreviation.toLowerCase() === cleanWord
      );
      
      if (!isKnownMedication && !isKnownCondition && !isKnownAbbreviation && cleanWord.length > 3) {
        // Find potential matches
        const medMatches = Object.keys(this.medicationDatabase)
          .filter(key => this.levenshteinDistance(key, cleanWord) <= 2)
          .map(key => this.medicationDatabase[key].name);
          
        const conditionMatches = Object.keys(this.conditionDatabase)
          .filter(key => this.levenshteinDistance(key, cleanWord) <= 2)
          .map(key => this.conditionDatabase[key].name);
        
        const allSuggestions = [...medMatches, ...conditionMatches];
        
        if (allSuggestions.length > 0) {
          suggestions.push({
            term: word,
            suggestions: allSuggestions.slice(0, 3)
          });
        }
      }
    });
    
    return { originalText: text, suggestions };
  }

  /**
   * Calculates Levenshtein distance for spell checking
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Suggests ICD-10 codes based on text content
   */
  suggestICD10Codes(text: string): { condition: string; icd10: string; confidence: number }[] {
    const suggestions: { condition: string; icd10: string; confidence: number }[] = [];
    const lowercaseText = text.toLowerCase();
    
    Object.entries(this.conditionDatabase).forEach(([key, value]) => {
      if (lowercaseText.includes(key)) {
        suggestions.push({
          condition: value.name,
          icd10: value.icd10,
          confidence: 0.8
        });
      }
    });
    
    return suggestions;
  }

  /**
   * Enhanced medical text processing that combines all features
   */
  processText(text: string): {
    processedText: string;
    medicalTerms: MedicalTerm[];
    spellingSuggestions: { term: string; suggestions: string[] }[];
    icd10Suggestions: { condition: string; icd10: string; confidence: number }[];
    confidence: number;
  } {
    // Expand abbreviations
    const expandedText = this.expandAbbreviations(text);
    
    // Identify medical terms
    const medicalTerms = this.identifyMedicalTerms(text);
    
    // Check spelling
    const spellCheck = this.spellCheckMedical(text);
    
    // Suggest ICD-10 codes
    const icd10Suggestions = this.suggestICD10Codes(text);
    
    // Calculate overall confidence based on recognized terms
    const totalWords = text.split(/\s+/).length;
    const recognizedTerms = medicalTerms.length;
    const confidence = Math.min(0.95, (recognizedTerms / totalWords) * 2 + 0.3);
    
    return {
      processedText: expandedText,
      medicalTerms,
      spellingSuggestions: spellCheck.suggestions,
      icd10Suggestions,
      confidence
    };
  }
}

export const medicalTerminologyService = new MedicalTerminologyService();
export type { MedicalTerm, DrugValidation };