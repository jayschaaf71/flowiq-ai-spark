
import { Button } from "@/components/ui/button";
import { ClinicMetrics } from "@/components/clinic/ClinicMetrics";
import { useNavigate } from "react-router-dom";

export const KPISection = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/analytics')}
        >
          View Detailed Analytics
        </Button>
      </div>
      <ClinicMetrics />
    </div>
  );
};
