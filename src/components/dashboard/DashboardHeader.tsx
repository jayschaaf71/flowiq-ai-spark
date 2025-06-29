
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/contexts/DashboardContext";
import { useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const { profile } = useAuth();
  const { state } = useDashboard();
  const navigate = useNavigate();

  const handleAIAgentsClick = () => {
    navigate('/agents/scribe');
  };

  const handleAnalyticsClick = () => {
    navigate('/analytics');
  };

  return (
    <div className="flex items-center justify-between">
      <PageHeader 
        title="Clinic Dashboard"
        subtitle={`Daily operations overview and key performance indicators${profile?.tenant_id ? ` - ${profile.tenant_id.toUpperCase()} Tenant` : ''} - Active Module: ${state.activeModule}`}
      />
      <div className="flex gap-2">
        <Button 
          onClick={handleAIAgentsClick}
          variant="outline"
        >
          AI Agents
        </Button>
        <Button 
          onClick={handleAnalyticsClick}
        >
          View Analytics
        </Button>
      </div>
    </div>
  );
};
