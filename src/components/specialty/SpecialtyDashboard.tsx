
import { useSpecialty } from '@/contexts/SpecialtyContext';
import { ChiropracticDashboard } from './dashboards/ChiropracticDashboard';
import { DentalSleepDashboard } from './dashboards/DentalSleepDashboard';
import { MedSpaDashboard } from './dashboards/MedSpaDashboard';
import { ConciergeDashboard } from './dashboards/ConciergeDashboard';
import { HRTDashboard } from './dashboards/HRTDashboard';

export const SpecialtyDashboard = () => {
  const { currentSpecialty } = useSpecialty();

  switch (currentSpecialty) {
    case 'chiropractic':
      return <ChiropracticDashboard />;
    case 'dental_sleep':
      return <DentalSleepDashboard />;
    case 'med_spa':
      return <MedSpaDashboard />;
    case 'concierge':
      return <ConciergeDashboard />;
    case 'hrt':
      return <HRTDashboard />;
    default:
      return <ChiropracticDashboard />;
  }
};
