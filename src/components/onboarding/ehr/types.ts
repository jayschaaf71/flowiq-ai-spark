
export interface EHRSystem {
  id: string;
  name: string;
  logo: string;
  description: string;
  popularity: string;
  integration: string;
}

export interface EHRConfig {
  enableIntegration: boolean;
  selectedEHR: string;
  syncSettings: {
    patientData: boolean;
    appointments: boolean;
    clinicalNotes: boolean;
    billing: boolean;
  };
  apiCredentials: {
    endpoint: string;
    apiKey: string;
    clientId: string;
  };
}

export interface EHRIntegrationStepProps {
  specialty: any;
  ehrConfig: EHRConfig;
  onUpdateEHRConfig: (config: any) => void;
}
