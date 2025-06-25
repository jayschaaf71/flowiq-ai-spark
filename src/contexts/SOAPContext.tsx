
import { createContext, useContext, ReactNode } from 'react';
import { useSOAPGeneration } from '@/hooks/useSOAPGeneration';

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface SOAPContextType {
  isGenerating: boolean;
  generatedSOAP: SOAPNote | null;
  generateSOAPFromTranscription: (transcription: string) => Promise<SOAPNote>;
  clearSOAP: () => void;
}

const SOAPContext = createContext<SOAPContextType | undefined>(undefined);

export const SOAPProvider = ({ children }: { children: ReactNode }) => {
  const soapGeneration = useSOAPGeneration();
  
  return (
    <SOAPContext.Provider value={soapGeneration}>
      {children}
    </SOAPContext.Provider>
  );
};

export const useSOAPContext = () => {
  const context = useContext(SOAPContext);
  if (context === undefined) {
    throw new Error('useSOAPContext must be used within a SOAPProvider');
  }
  return context;
};
