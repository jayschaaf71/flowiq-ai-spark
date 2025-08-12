/**
 * Unified Specialty Detection System
 * Phase 2: Single source of truth for specialty detection
 */

import { parseTenantFromUrl } from '@/config/unifiedRouting';
import type { SpecialtyType as ConfigSpecialtyType } from '@/utils/specialtyConfig';

// Use the standard SpecialtyType from specialtyConfig
export type SpecialtyType = ConfigSpecialtyType;

export interface SpecialtyDetectionResult {
  specialty: SpecialtyType;
  source: 'database_tenant' | 'url_path' | 'database_profile' | 'localStorage' | 'default' | 'manual';
  confidence: 'high' | 'medium' | 'low';
  tenantId?: string;
  isProduction: boolean;
}

/**
 * Unified specialty detection with clear priority order
 * Priority: Database tenant specialty > URL path > Database profile specialty > localStorage > default
 */
export function detectSpecialty(
  userProfile?: { specialty?: string | null; current_tenant_id?: string | null } | null,
  currentPath?: string
): SpecialtyDetectionResult {
  const path = currentPath || window.location.pathname;

  console.log('🔍 Unified Specialty Detection:', {
    userProfile,
    currentPath: path,
    hostname: window.location.hostname
  });

  // Priority 1: Database tenant specialty (HIGHEST)
  const tenantRoute = parseTenantFromUrl();
  if (tenantRoute && userProfile?.current_tenant_id === tenantRoute.tenantId) {
    const mappedSpecialty = mapSpecialtyToType(tenantRoute.specialty);
    console.log('✅ Specialty from database tenant:', mappedSpecialty, 'source: database_tenant');
    return {
      specialty: mappedSpecialty,
      source: 'database_tenant',
      confidence: 'high',
      tenantId: tenantRoute.tenantId,
      isProduction: tenantRoute.isProduction
    };
  }

  // Priority 2: Production subdomain specialty (HIGH) - NEW PRIORITY
  if (tenantRoute && tenantRoute.isProduction) {
    const mappedSpecialty = mapSpecialtyToType(tenantRoute.specialty);
    console.log('✅ Specialty from production subdomain:', mappedSpecialty, 'source: production_subdomain');
    return {
      specialty: mappedSpecialty,
      source: 'production_subdomain',
      confidence: 'high',
      tenantId: tenantRoute.tenantId,
      isProduction: tenantRoute.isProduction
    };
  }

  // Priority 3: URL path detection (MEDIUM) - LOWERED PRIORITY
  const urlSpecialty = detectSpecialtyFromPath(path);
  if (urlSpecialty) { // If we detect any specialty from URL, use it
    console.log('✅ Specialty from URL path:', urlSpecialty, 'source: url_path');
    return {
      specialty: urlSpecialty,
      source: 'url_path',
      confidence: 'medium', // Lowered confidence
      tenantId: tenantRoute?.tenantId,
      isProduction: tenantRoute?.isProduction || false
    };
  }

  // Priority 4: Database profile specialty (MEDIUM)
  if (userProfile?.specialty) {
    const mappedSpecialty = mapSpecialtyToType(userProfile.specialty);
    console.log('✅ Specialty from database profile:', mappedSpecialty, 'source: database_profile');
    return {
      specialty: mappedSpecialty,
      source: 'database_profile',
      confidence: 'medium',
      tenantId: userProfile.current_tenant_id || undefined,
      isProduction: tenantRoute?.isProduction || false
    };
  }

  // Priority 5: localStorage (LOW)
  try {
    const storedSpecialty = localStorage.getItem('currentSpecialty') as SpecialtyType;
    if (storedSpecialty && isValidSpecialtyType(storedSpecialty)) {
      console.log('✅ Specialty from localStorage:', storedSpecialty, 'source: localStorage');
      return {
        specialty: storedSpecialty,
        source: 'localStorage',
        confidence: 'low',
        tenantId: tenantRoute?.tenantId,
        isProduction: tenantRoute?.isProduction || false
      };
    }
  } catch (error) {
    console.warn('Error reading from localStorage:', error);
  }

  // Priority 6: Default (LOWEST)
  console.log('⚠️ Using default specialty: chiropractic, source: default');
  return {
    specialty: 'chiropractic',
    source: 'default',
    confidence: 'low',
    tenantId: tenantRoute?.tenantId,
    isProduction: tenantRoute?.isProduction || false
  };
}

/**
 * Detect specialty from URL path
 */
function detectSpecialtyFromPath(path: string): SpecialtyType {
  // Specific path matching with priority - align with specialtyConfig
  if (path.includes('/dental-sleep-medicine') || path.includes('/dental-sleep')) {
    return 'dental-sleep';
  }
  if (path.includes('/chiropractic')) {
    return 'chiropractic';
  }
  if (path.includes('/dental')) {
    return 'dental-sleep'; // Map dental to dental-sleep
  }
  if (path.includes('/med-spa') || path.includes('/medspa')) {
    return 'med-spa';
  }
  if (path.includes('/concierge')) {
    return 'concierge';
  }
  if (path.includes('/hrt')) {
    return 'hrt';
  }

  return 'chiropractic'; // Default
}

/**
 * Consistent mapping between all specialty name variations
 */
export function mapSpecialtyToType(specialty: string): SpecialtyType {
  const specialtyMap: Record<string, SpecialtyType> = {
    // Dental Sleep Medicine variations
    'dental-sleep-medicine': 'dental-sleep',
    'dental-sleep': 'dental-sleep',

    // Chiropractic variations
    'chiropractic-care': 'chiropractic',
    'chiropractic': 'chiropractic',

    // Communication variations
    'communication': 'communication',

    // General Dentistry variations
    'general-dentistry': 'general-dentistry',
    'dental': 'general-dentistry', // Changed from dental-sleep to general-dentistry

    // Other specialties - align with specialtyConfig
    'med-spa': 'med-spa',
    'medspa': 'med-spa',
    'medical-spa': 'med-spa',
    'concierge': 'concierge',
    'concierge-medicine': 'concierge',
    'hrt': 'hrt',
    'hormone-replacement-therapy': 'hrt',

    // General fallbacks
    'orthodontics': 'general-dentistry', // Changed from dental-sleep to general-dentistry
    'veterinary': 'chiropractic',
    'physical-therapy': 'chiropractic',
    'mental-health': 'chiropractic',
    'dermatology': 'chiropractic',
    'urgent-care': 'chiropractic'
  };

  return specialtyMap[specialty] || 'chiropractic';
}

/**
 * Validate if a string is a valid SpecialtyType
 */
function isValidSpecialtyType(value: string): value is SpecialtyType {
  // Use the valid types from specialtyConfig
  const validTypes: SpecialtyType[] = ['chiropractic', 'dental-sleep', 'med-spa', 'concierge', 'hrt', 'communication', 'general-dentistry'];
  return validTypes.includes(value as SpecialtyType);
}

/**
 * Get tenant-specific brand name based on detection result
 */
export function getBrandName(detectionResult: SpecialtyDetectionResult): string {
  // Production tenant brand names
  if (detectionResult.isProduction && detectionResult.tenantId) {
    const brandMap: Record<string, string> = {
      'd52278c3-bf0d-4731-bfa9-a40f032fa305': 'Midwest Dental Sleep',
      '024e36c1-a1bc-44d0-8805-3162ba59a0c2': 'West County Spine'
    };

    const brandName = brandMap[detectionResult.tenantId];
    if (brandName) return brandName;
  }

  // Specialty-based brand names
  const specialtyBrands: Record<SpecialtyType, string> = {
    'dental-sleep': 'Dental Sleep iQ',
    'chiropractic': 'Chiropractic iQ',
    'med-spa': 'MedSpa iQ',
    'concierge': 'Concierge iQ',
    'hrt': 'HRT iQ'
  };

  return specialtyBrands[detectionResult.specialty];
}

/**
 * Persist specialty detection to localStorage
 */
export function persistSpecialtyDetection(detectionResult: SpecialtyDetectionResult): void {
  try {
    localStorage.setItem('currentSpecialty', detectionResult.specialty);
    localStorage.setItem('specialtyDetectionSource', detectionResult.source);
    localStorage.setItem('specialtyDetectionConfidence', detectionResult.confidence);
    console.log('📝 Persisted specialty detection:', detectionResult);
  } catch (error) {
    console.warn('Failed to persist specialty detection:', error);
  }
}
