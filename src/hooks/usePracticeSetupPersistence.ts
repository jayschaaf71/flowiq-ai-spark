import { useEffect, useCallback } from 'react';
import { SetupData } from '@/pages/PracticeSetup';

const STORAGE_KEY = 'practice-setup-data';
const STEP_STORAGE_KEY = 'practice-setup-step';

export const usePracticeSetupPersistence = (
  setupData: SetupData,
  setSetupData: (data: SetupData) => void,
  currentStep: number,
  setCurrentStep: (step: number) => void
) => {
  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    const savedStep = localStorage.getItem(STEP_STORAGE_KEY);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as SetupData;
        setSetupData(parsedData);
      } catch (error) {
        console.error('Failed to parse saved setup data:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    if (savedStep) {
      try {
        const parsedStep = parseInt(savedStep, 10);
        if (parsedStep >= 1 && parsedStep <= 5) {
          setCurrentStep(parsedStep);
        }
      } catch (error) {
        console.error('Failed to parse saved step:', error);
        localStorage.removeItem(STEP_STORAGE_KEY);
      }
    }
  }, [setSetupData, setCurrentStep]);

  // Save data to localStorage whenever setupData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setupData));
  }, [setupData]);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STEP_STORAGE_KEY, currentStep.toString());
  }, [currentStep]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_STORAGE_KEY);
  }, []);

  // Check if there's saved data
  const hasSavedData = useCallback(() => {
    return localStorage.getItem(STORAGE_KEY) !== null || localStorage.getItem(STEP_STORAGE_KEY) !== null;
  }, []);

  return {
    clearSavedData,
    hasSavedData
  };
};