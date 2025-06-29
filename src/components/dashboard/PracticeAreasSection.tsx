
import { FinancialSummaryWidget } from "@/components/dashboard/FinancialSummaryWidget";
import { PatientExperienceWidget } from "@/components/dashboard/PatientExperienceWidget";
import { ComplianceWidget } from "@/components/dashboard/ComplianceWidget";

export const PracticeAreasSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FinancialSummaryWidget />
      <PatientExperienceWidget />
      <ComplianceWidget />
    </div>
  );
};
