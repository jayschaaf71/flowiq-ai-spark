
import { Button } from "@/components/ui/button";
import { Shield, Activity } from "lucide-react";

interface ComplianceHeaderProps {
  onRefresh: () => void;
}

export const ComplianceHeader = ({ onRefresh }: ComplianceHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-600" />
          HIPAA Compliance Monitor
        </h3>
        <p className="text-gray-600">
          Real-time monitoring of data security and compliance requirements
        </p>
      </div>
      <Button onClick={onRefresh}>
        <Activity className="w-4 h-4 mr-2" />
        Refresh Status
      </Button>
    </div>
  );
};
