
import { ScribeDashboardStats } from "./ScribeDashboardStats";
import { ScribeAIFeatures } from "./ScribeAIFeatures";
import { ScribeRecentTranscriptions } from "./ScribeRecentTranscriptions";

export const ScribeDashboardTab = () => {
  return (
    <div className="space-y-4">
      <ScribeDashboardStats />
      <ScribeAIFeatures />
      <ScribeRecentTranscriptions />
    </div>
  );
};
