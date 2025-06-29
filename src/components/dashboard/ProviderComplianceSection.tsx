
import { ProviderSummary } from "@/components/clinic/ProviderSummary";
import { ComplianceMonitor } from "@/components/compliance/ComplianceMonitor";

export const ProviderComplianceSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ProviderSummary />
      </div>
      <div>
        <ComplianceMonitor />
      </div>
    </div>
  );
};
