import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SpecialtyType } from '@/utils/specialtyConfig';

export const useSpecialtyDetection = () => {
  const location = useLocation();
  const [currentSpecialty, setCurrentSpecialty] = useState<SpecialtyType>('chiropractic');

  useEffect(() => {
    const detectSpecialtyFromRoute = (): SpecialtyType => {
      const path = location.pathname;
      
      // Route-based specialty detection
      if (path.includes('/agents/dental-sleep') || path.includes('/dental-sleep')) {
        return 'dental-sleep';
      }
      if (path.includes('/dental')) {
        return 'dental-sleep'; // Default dental to dental-sleep for now
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
      
      // Check persistent storage
      const storedSpecialty = localStorage.getItem('currentSpecialty') as SpecialtyType;
      if (storedSpecialty) {
        return storedSpecialty;
      }
      
      // Default to chiropractic
      return 'chiropractic';
    };

    const specialty = detectSpecialtyFromRoute();
    
    // Persist the detected specialty
    localStorage.setItem('currentSpecialty', specialty);
    setCurrentSpecialty(specialty);
    
    console.log('Specialty detected:', specialty, 'from route:', location.pathname);
  }, [location.pathname]);

  const setSpecialty = (specialty: SpecialtyType) => {
    localStorage.setItem('currentSpecialty', specialty);
    setCurrentSpecialty(specialty);
    console.log('Specialty manually set to:', specialty);
  };

  return {
    currentSpecialty,
    setSpecialty
  };
};