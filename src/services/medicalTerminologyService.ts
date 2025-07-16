import type { SpecialtyType } from '@/utils/specialtyConfig';

interface MedicalTerm {
  term: string;
  standardized: string;
  category: 'medication' | 'condition' | 'procedure' | 'anatomy' | 'symptom' | 'other';
  confidence: number;
  icd10?: string;
  cptCode?: string;
  specialty?: SpecialtyType;
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

interface SpecialtyTerminology {
  abbreviations: MedicalAbbreviation[];
  medications: { [key: string]: { name: string; genericName?: string; category: string } };
  conditions: { [key: string]: { name: string; icd10: string; category: string } };
  procedures: { [key: string]: { name: string; cptCode: string; category: string } };
  clinicalFlags: string[];
}

class MedicalTerminologyService {
  // Specialty-specific medical terminology
  private specialtyTerminology: Record<SpecialtyType, SpecialtyTerminology> = {
    'dental-sleep': {
      abbreviations: [
        { abbreviation: 'OSA', expansion: 'obstructive sleep apnea', context: 'sleep medicine' },
        { abbreviation: 'AHI', expansion: 'apnea-hypopnea index', context: 'sleep study' },
        { abbreviation: 'RDI', expansion: 'respiratory disturbance index', context: 'sleep study' },
        { abbreviation: 'CPAP', expansion: 'continuous positive airway pressure', context: 'treatment' },
        { abbreviation: 'MAD', expansion: 'mandibular advancement device', context: 'oral appliance' },
        { abbreviation: 'MAS', expansion: 'mandibular advancement splint', context: 'oral appliance' },
        { abbreviation: 'PSG', expansion: 'polysomnography', context: 'sleep study' },
        { abbreviation: 'HST', expansion: 'home sleep test', context: 'sleep study' },
        { abbreviation: 'TST', expansion: 'total sleep time', context: 'sleep study' },
        { abbreviation: 'SE', expansion: 'sleep efficiency', context: 'sleep study' },
        { abbreviation: 'PLM', expansion: 'periodic limb movement', context: 'sleep disorder' },
        { abbreviation: 'REM', expansion: 'rapid eye movement', context: 'sleep stage' },
        { abbreviation: 'NREM', expansion: 'non-rapid eye movement', context: 'sleep stage' },
      ],
      medications: {
        'modafinil': { name: 'Modafinil', genericName: 'modafinil', category: 'wakefulness promoting' },
        'armodafinil': { name: 'Armodafinil', genericName: 'armodafinil', category: 'wakefulness promoting' },
        'melatonin': { name: 'Melatonin', genericName: 'melatonin', category: 'sleep aid' },
        'zolpidem': { name: 'Zolpidem', genericName: 'zolpidem', category: 'sleep aid' },
        'eszopiclone': { name: 'Eszopiclone', genericName: 'eszopiclone', category: 'sleep aid' },
      },
      conditions: {
        'sleep apnea': { name: 'Obstructive Sleep Apnea', icd10: 'G47.33', category: 'sleep disorder' },
        'central sleep apnea': { name: 'Central Sleep Apnea', icd10: 'G47.31', category: 'sleep disorder' },
        'insomnia': { name: 'Insomnia', icd10: 'G47.00', category: 'sleep disorder' },
        'snoring': { name: 'Snoring', icd10: 'R06.83', category: 'sleep disorder' },
        'hypersomnia': { name: 'Hypersomnia', icd10: 'G47.10', category: 'sleep disorder' },
        'restless legs': { name: 'Restless Legs Syndrome', icd10: 'G25.81', category: 'sleep disorder' },
      },
      procedures: {
        'oral appliance therapy': { name: 'Oral Appliance Therapy', cptCode: 'E0486', category: 'dme' },
        'sleep study': { name: 'Polysomnography', cptCode: '95810', category: 'diagnostic' },
        'home sleep test': { name: 'Home Sleep Apnea Test', cptCode: '95800', category: 'diagnostic' },
        'appliance adjustment': { name: 'Oral Appliance Adjustment', cptCode: 'D7880', category: 'follow-up' },
      },
      clinicalFlags: [
        'High AHI (>30) - Severe OSA',
        'Low oxygen saturation (<88%)',
        'Excessive daytime sleepiness',
        'Poor CPAP compliance',
        'Appliance side effects reported',
        'Weight gain since last visit'
      ]
    },
    'chiropractic': {
      abbreviations: [
        { abbreviation: 'ROM', expansion: 'range of motion', context: 'examination' },
        { abbreviation: 'SLR', expansion: 'straight leg raise', context: 'examination' },
        { abbreviation: 'DTR', expansion: 'deep tendon reflex', context: 'examination' },
        { abbreviation: 'HVLA', expansion: 'high velocity low amplitude', context: 'treatment' },
        { abbreviation: 'SMT', expansion: 'spinal manipulative therapy', context: 'treatment' },
        { abbreviation: 'CMT', expansion: 'chiropractic manipulative treatment', context: 'treatment' },
        { abbreviation: 'MET', expansion: 'muscle energy technique', context: 'treatment' },
        { abbreviation: 'ART', expansion: 'active release technique', context: 'treatment' },
        { abbreviation: 'IASTM', expansion: 'instrument assisted soft tissue mobilization', context: 'treatment' },
        { abbreviation: 'C-spine', expansion: 'cervical spine', context: 'anatomy' },
        { abbreviation: 'T-spine', expansion: 'thoracic spine', context: 'anatomy' },
        { abbreviation: 'L-spine', expansion: 'lumbar spine', context: 'anatomy' },
        { abbreviation: 'SI', expansion: 'sacroiliac', context: 'anatomy' },
      ],
      medications: {
        'ibuprofen': { name: 'Ibuprofen', genericName: 'ibuprofen', category: 'NSAID' },
        'naproxen': { name: 'Naproxen', genericName: 'naproxen', category: 'NSAID' },
        'diclofenac': { name: 'Diclofenac', genericName: 'diclofenac', category: 'NSAID' },
        'cyclobenzaprine': { name: 'Cyclobenzaprine', genericName: 'cyclobenzaprine', category: 'muscle relaxant' },
        'methocarbamol': { name: 'Methocarbamol', genericName: 'methocarbamol', category: 'muscle relaxant' },
        'tizanidine': { name: 'Tizanidine', genericName: 'tizanidine', category: 'muscle relaxant' },
      },
      conditions: {
        'low back pain': { name: 'Low Back Pain', icd10: 'M54.5', category: 'musculoskeletal' },
        'neck pain': { name: 'Neck Pain', icd10: 'M54.2', category: 'musculoskeletal' },
        'sciatica': { name: 'Sciatica', icd10: 'M54.3', category: 'musculoskeletal' },
        'herniated disc': { name: 'Intervertebral Disc Disorder', icd10: 'M51.9', category: 'musculoskeletal' },
        'spinal stenosis': { name: 'Spinal Stenosis', icd10: 'M48.06', category: 'musculoskeletal' },
        'scoliosis': { name: 'Scoliosis', icd10: 'M41.9', category: 'musculoskeletal' },
        'whiplash': { name: 'Whiplash Injury', icd10: 'S13.4', category: 'injury' },
      },
      procedures: {
        'spinal manipulation': { name: 'Spinal Manipulation', cptCode: '98940', category: 'manual therapy' },
        'manual therapy': { name: 'Manual Therapy', cptCode: '97140', category: 'manual therapy' },
        'therapeutic exercise': { name: 'Therapeutic Exercise', cptCode: '97110', category: 'therapy' },
        'x-ray': { name: 'Spinal X-ray', cptCode: '72100', category: 'diagnostic' },
      },
      clinicalFlags: [
        'Red flags - severe neurological symptoms',
        'Cauda equina syndrome symptoms',
        'Progressive neurological deficit',
        'Severe or worsening pain',
        'Failed conservative treatment',
        'Chronic pain >12 weeks'
      ]
    },
    'med-spa': {
      abbreviations: [
        { abbreviation: 'BTX', expansion: 'botulinum toxin', context: 'injection' },
        { abbreviation: 'HA', expansion: 'hyaluronic acid', context: 'filler' },
        { abbreviation: 'RF', expansion: 'radiofrequency', context: 'energy device' },
        { abbreviation: 'IPL', expansion: 'intense pulsed light', context: 'light therapy' },
        { abbreviation: 'PDT', expansion: 'photodynamic therapy', context: 'treatment' },
        { abbreviation: 'BBL', expansion: 'broad band light', context: 'light therapy' },
        { abbreviation: 'CO2', expansion: 'carbon dioxide laser', context: 'laser treatment' },
        { abbreviation: 'CRP', expansion: 'controlled radiofrequency pulse', context: 'energy device' },
      ],
      medications: {
        'lidocaine': { name: 'Lidocaine', genericName: 'lidocaine', category: 'local anesthetic' },
        'tretinoin': { name: 'Tretinoin', genericName: 'tretinoin', category: 'retinoid' },
        'hydroquinone': { name: 'Hydroquinone', genericName: 'hydroquinone', category: 'depigmenting agent' },
        'botox': { name: 'Botulinum Toxin A', genericName: 'onabotulinumtoxinA', category: 'neurotoxin' },
      },
      conditions: {
        'wrinkles': { name: 'Facial Wrinkles', icd10: 'L98.8', category: 'cosmetic' },
        'acne scars': { name: 'Acne Scars', icd10: 'L90.2', category: 'dermatologic' },
        'melasma': { name: 'Melasma', icd10: 'L81.1', category: 'pigmentation' },
        'rosacea': { name: 'Rosacea', icd10: 'L71.9', category: 'dermatologic' },
        'sun damage': { name: 'Solar Damage', icd10: 'L57.9', category: 'photoaging' },
      },
      procedures: {
        'botox injection': { name: 'Botulinum Toxin Injection', cptCode: '64612', category: 'injection' },
        'dermal filler': { name: 'Dermal Filler Injection', cptCode: '11950', category: 'injection' },
        'laser resurfacing': { name: 'Laser Skin Resurfacing', cptCode: '17106', category: 'laser' },
        'chemical peel': { name: 'Chemical Peel', cptCode: '17360', category: 'chemical' },
      },
      clinicalFlags: [
        'Allergy to anesthetics',
        'Previous adverse reaction to fillers',
        'Active skin infection',
        'Pregnancy/breastfeeding',
        'Unrealistic expectations',
        'History of keloid scarring'
      ]
    },
    'concierge': {
      abbreviations: [
        { abbreviation: 'HRA', expansion: 'health risk assessment', context: 'preventive' },
        { abbreviation: 'AWV', expansion: 'annual wellness visit', context: 'preventive' },
        { abbreviation: 'CCM', expansion: 'chronic care management', context: 'management' },
        { abbreviation: 'RPM', expansion: 'remote patient monitoring', context: 'monitoring' },
        { abbreviation: 'TCM', expansion: 'transitional care management', context: 'management' },
        { abbreviation: 'MTMP', expansion: 'medication therapy management program', context: 'medication' },
      ],
      medications: {
        'atorvastatin': { name: 'Atorvastatin', genericName: 'atorvastatin', category: 'statin' },
        'metformin': { name: 'Metformin', genericName: 'metformin', category: 'antidiabetic' },
        'lisinopril': { name: 'Lisinopril', genericName: 'lisinopril', category: 'ACE inhibitor' },
        'omeprazole': { name: 'Omeprazole', genericName: 'omeprazole', category: 'PPI' },
        'levothyroxine': { name: 'Levothyroxine', genericName: 'levothyroxine', category: 'thyroid hormone' },
      },
      conditions: {
        'hypertension': { name: 'Essential Hypertension', icd10: 'I10', category: 'cardiovascular' },
        'diabetes': { name: 'Type 2 Diabetes Mellitus', icd10: 'E11.9', category: 'endocrine' },
        'hyperlipidemia': { name: 'Hyperlipidemia', icd10: 'E78.5', category: 'endocrine' },
        'obesity': { name: 'Obesity', icd10: 'E66.9', category: 'endocrine' },
        'depression': { name: 'Major Depressive Disorder', icd10: 'F32.9', category: 'psychiatric' },
      },
      procedures: {
        'annual physical': { name: 'Comprehensive Preventive Medicine Evaluation', cptCode: '99397', category: 'preventive' },
        'executive physical': { name: 'Extended Preventive Medicine Evaluation', cptCode: '99401', category: 'preventive' },
        'wellness visit': { name: 'Annual Wellness Visit', cptCode: 'G0438', category: 'preventive' },
        'chronic care management': { name: 'Chronic Care Management', cptCode: '99490', category: 'management' },
      },
      clinicalFlags: [
        'Overdue for preventive screenings',
        'Multiple chronic conditions',
        'Medication adherence issues',
        'High healthcare utilization',
        'Risk stratification needed',
        'Care gaps identified'
      ]
    },
    'hrt': {
      abbreviations: [
        { abbreviation: 'HRT', expansion: 'hormone replacement therapy', context: 'treatment' },
        { abbreviation: 'TRT', expansion: 'testosterone replacement therapy', context: 'treatment' },
        { abbreviation: 'BHRT', expansion: 'bioidentical hormone replacement therapy', context: 'treatment' },
        { abbreviation: 'E2', expansion: 'estradiol', context: 'hormone' },
        { abbreviation: 'T3', expansion: 'triiodothyronine', context: 'thyroid hormone' },
        { abbreviation: 'T4', expansion: 'thyroxine', context: 'thyroid hormone' },
        { abbreviation: 'TSH', expansion: 'thyroid stimulating hormone', context: 'hormone' },
        { abbreviation: 'FSH', expansion: 'follicle stimulating hormone', context: 'hormone' },
        { abbreviation: 'LH', expansion: 'luteinizing hormone', context: 'hormone' },
        { abbreviation: 'DHEA', expansion: 'dehydroepiandrosterone', context: 'hormone' },
        { abbreviation: 'IGF-1', expansion: 'insulin-like growth factor 1', context: 'hormone' },
      ],
      medications: {
        'testosterone': { name: 'Testosterone', genericName: 'testosterone', category: 'androgen' },
        'estradiol': { name: 'Estradiol', genericName: 'estradiol', category: 'estrogen' },
        'progesterone': { name: 'Progesterone', genericName: 'progesterone', category: 'progestin' },
        'clomiphene': { name: 'Clomiphene', genericName: 'clomiphene', category: 'fertility drug' },
        'anastrozole': { name: 'Anastrozole', genericName: 'anastrozole', category: 'aromatase inhibitor' },
        'hcg': { name: 'Human Chorionic Gonadotropin', genericName: 'hcg', category: 'hormone' },
      },
      conditions: {
        'low testosterone': { name: 'Male Hypogonadism', icd10: 'E29.1', category: 'endocrine' },
        'menopause': { name: 'Menopausal State', icd10: 'N95.1', category: 'reproductive' },
        'andropause': { name: 'Male Climacteric', icd10: 'N50.89', category: 'reproductive' },
        'thyroid disorder': { name: 'Thyroid Disorder', icd10: 'E07.9', category: 'endocrine' },
        'adrenal fatigue': { name: 'Adrenal Insufficiency', icd10: 'E27.40', category: 'endocrine' },
      },
      procedures: {
        'hormone pellet insertion': { name: 'Hormone Pellet Implantation', cptCode: '11981', category: 'injection' },
        'testosterone injection': { name: 'Testosterone Injection', cptCode: '96372', category: 'injection' },
        'hormone monitoring': { name: 'Hormone Level Monitoring', cptCode: '80327', category: 'lab' },
        'comprehensive hormone panel': { name: 'Comprehensive Hormone Panel', cptCode: '82728', category: 'lab' },
      },
      clinicalFlags: [
        'Polycythemia risk with testosterone',
        'Cardiovascular risk assessment needed',
        'Prostate monitoring required',
        'Estrogen dominance symptoms',
        'Thyroid function abnormal',
        'Hormone levels outside target range'
      ]
    }
  };

  // Common medical abbreviations with context (shared across all specialties)
  private commonAbbreviations: MedicalAbbreviation[] = [
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
   * Get abbreviations for specialty
   */
  private getAbbreviations(specialty?: SpecialtyType): MedicalAbbreviation[] {
    const common = this.commonAbbreviations;
    if (!specialty) return common;
    
    const specialtyTerms = this.specialtyTerminology[specialty];
    return [...common, ...specialtyTerms.abbreviations];
  }

  /**
   * Get combined medical databases for specialty
   */
  private getMedicalData(specialty?: SpecialtyType) {
    const common = {
      medications: this.medicationDatabase,
      conditions: this.conditionDatabase
    };
    
    if (!specialty) return common;
    
    const specialtyTerms = this.specialtyTerminology[specialty];
    return {
      medications: { ...common.medications, ...specialtyTerms.medications },
      conditions: { ...common.conditions, ...specialtyTerms.conditions }
    };
  }

  /**
   * Expands medical abbreviations in text (specialty-aware)
   */
  expandAbbreviations(text: string, specialty?: SpecialtyType): string {
    let expandedText = text;
    const abbreviations = this.getAbbreviations(specialty);
    
    abbreviations.forEach(abbrev => {
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
      const isKnownAbbreviation = this.commonAbbreviations.find(
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
   * Get clinical flags for specialty
   */
  getClinicalFlags(specialty?: SpecialtyType): string[] {
    if (!specialty) return [];
    return this.specialtyTerminology[specialty].clinicalFlags;
  }

  /**
   * Get procedure suggestions for specialty
   */
  getProcedureSuggestions(text: string, specialty?: SpecialtyType): { name: string; cptCode: string; confidence: number }[] {
    if (!specialty) return [];
    
    const procedures = this.specialtyTerminology[specialty].procedures;
    const suggestions: { name: string; cptCode: string; confidence: number }[] = [];
    const lowercaseText = text.toLowerCase();
    
    Object.entries(procedures).forEach(([key, value]) => {
      if (lowercaseText.includes(key)) {
        suggestions.push({
          name: value.name,
          cptCode: value.cptCode,
          confidence: 0.85
        });
      }
    });
    
    return suggestions;
  }

  /**
   * Enhanced medical text processing with specialty awareness
   */
  processText(text: string, specialty?: SpecialtyType): {
    processedText: string;
    medicalTerms: MedicalTerm[];
    spellingSuggestions: { term: string; suggestions: string[] }[];
    icd10Suggestions: { condition: string; icd10: string; confidence: number }[];
    procedureSuggestions: { name: string; cptCode: string; confidence: number }[];
    clinicalFlags: string[];
    confidence: number;
    specialty?: SpecialtyType;
  } {
    const medicalData = this.getMedicalData(specialty);
    
    // Expand abbreviations with specialty awareness
    const expandedText = this.expandAbbreviations(text, specialty);
    
    // Identify medical terms with specialty-specific databases
    const medicalTerms = this.identifyMedicalTermsWithSpecialty(text, specialty);
    
    // Check spelling
    const spellCheck = this.spellCheckMedical(text);
    
    // Suggest ICD-10 codes with specialty awareness
    const icd10Suggestions = this.suggestICD10CodesWithSpecialty(text, specialty);
    
    // Get procedure suggestions
    const procedureSuggestions = this.getProcedureSuggestions(text, specialty);
    
    // Get clinical flags
    const clinicalFlags = this.getClinicalFlags(specialty);
    
    // Calculate overall confidence based on recognized terms and specialty match
    const totalWords = text.split(/\s+/).length;
    const recognizedTerms = medicalTerms.length;
    const specialtyBonus = specialty ? 0.1 : 0;
    const confidence = Math.min(0.95, (recognizedTerms / totalWords) * 2 + 0.3 + specialtyBonus);
    
    return {
      processedText: expandedText,
      medicalTerms,
      spellingSuggestions: spellCheck.suggestions,
      icd10Suggestions,
      procedureSuggestions,
      clinicalFlags,
      confidence,
      specialty
    };
  }

  /**
   * Specialty-aware medical term identification
   */
  private identifyMedicalTermsWithSpecialty(text: string, specialty?: SpecialtyType): MedicalTerm[] {
    const terms: MedicalTerm[] = [];
    const words = text.toLowerCase().split(/\s+/);
    const medicalData = this.getMedicalData(specialty);
    
    // Check for medications
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (medicalData.medications[cleanWord]) {
        const med = medicalData.medications[cleanWord];
        terms.push({
          term: word,
          standardized: med.name,
          category: 'medication',
          confidence: 0.9,
          specialty
        });
      }
    });
    
    // Check for conditions
    words.forEach((word, index) => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (medicalData.conditions[cleanWord]) {
        const condition = medicalData.conditions[cleanWord];
        terms.push({
          term: word,
          standardized: condition.name,
          category: 'condition',
          confidence: 0.85,
          icd10: condition.icd10,
          specialty
        });
      }
    });
    
    return terms;
  }

  /**
   * Specialty-aware ICD-10 code suggestions
   */
  private suggestICD10CodesWithSpecialty(text: string, specialty?: SpecialtyType): { condition: string; icd10: string; confidence: number }[] {
    const suggestions: { condition: string; icd10: string; confidence: number }[] = [];
    const lowercaseText = text.toLowerCase();
    const medicalData = this.getMedicalData(specialty);
    
    Object.entries(medicalData.conditions).forEach(([key, value]) => {
      if (lowercaseText.includes(key)) {
        const confidence = specialty ? 0.9 : 0.8; // Higher confidence for specialty-specific matches
        suggestions.push({
          condition: value.name,
          icd10: value.icd10,
          confidence
        });
      }
    });
    
    return suggestions;
  }
}

export const medicalTerminologyService = new MedicalTerminologyService();
export type { MedicalTerm, DrugValidation };