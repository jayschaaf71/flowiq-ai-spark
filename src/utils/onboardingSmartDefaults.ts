
import { OnboardingData } from '@/hooks/useOnboardingFlow';

interface SmartDefaults {
  getSpecialtyDefaults: (specialty: string) => Partial<OnboardingData>;
  getPracticeDefaults: (practiceData: any) => Partial<OnboardingData>;
  getTeamDefaults: (specialty: string) => Partial<OnboardingData>;
}

export const smartDefaults: SmartDefaults = {
  getSpecialtyDefaults: (specialty: string) => {
    const specialtyConfigs = {
      chiropractic: {
        agentConfig: {
          receptionistAgent: true,
          schedulingAgent: true,
          billingAgent: false
        },
        scribeConfig: {
          enableScribeAgent: true,
          autoSOAPGeneration: true,
          realTimeTranscription: true
        }
      },
      'dental-sleep': {
        agentConfig: {
          receptionistAgent: true,
          schedulingAgent: true,
          billingAgent: true
        },
        scribeConfig: {
          enableScribeAgent: false,
          autoSOAPGeneration: false,
          realTimeTranscription: false
        }
      },
      'med-spa': {
        agentConfig: {
          receptionistAgent: true,
          schedulingAgent: true,
          billingAgent: true
        },
        paymentConfig: {
          enablePayments: true,
          subscriptionPlan: 'enterprise'
        }
      }
    };

    return specialtyConfigs[specialty as keyof typeof specialtyConfigs] || {};
  },

  getPracticeDefaults: (practiceData: any) => {
    const defaults: Partial<OnboardingData> = {};

    // Auto-populate brand name from practice name
    if (practiceData.practiceName) {
      defaults.templateConfig = {
        enableAutoGeneration: true,
        customizationPreferences: {
          includeBranding: true,
          primaryColor: '#007BFF',
          secondaryColor: '#6C757D',
          logoUrl: undefined,
          brandName: practiceData.practiceName
        }
      };
    }

    return defaults;
  },

  getTeamDefaults: (specialty: string) => {
    // Pre-populate common team roles based on specialty
    const rolesBySpecialty = {
      chiropractic: ['Chiropractor', 'Chiropractic Assistant', 'Front Desk'],
      'dental-sleep': ['Sleep Specialist', 'Dental Hygienist', 'Office Manager'],
      'med-spa': ['Aesthetician', 'Nurse Practitioner', 'Receptionist']
    };

    return {
      teamConfig: {
        inviteTeam: false,
        teamMembers: [],
        members: []
      }
    };
  }
};

export const applySmartDefaults = (
  currentData: OnboardingData,
  step: string,
  context: any
): OnboardingData => {
  let updates: Partial<OnboardingData> = {};

  switch (step) {
    case 'specialty':
      if (context.specialty) {
        updates = smartDefaults.getSpecialtyDefaults(context.specialty);
      }
      break;
    case 'practice':
      updates = smartDefaults.getPracticeDefaults(context.practiceData);
      break;
    case 'team':
      if (currentData.specialty) {
        updates = smartDefaults.getTeamDefaults(currentData.specialty);
      }
      break;
  }

  return { ...currentData, ...updates };
};
