
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SetupTestingSection = () => {
  const navigate = useNavigate();

  const handleOnboardingClick = () => {
    navigate('/onboard-tenant');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Setup & Testing
        </CardTitle>
        <CardDescription>
          Access setup flows and testing tools
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-4">
        <Button 
          onClick={handleOnboardingClick}
          className="flex-1"
          variant="outline"
        >
          Go Through Onboarding Flow
        </Button>
        <Button 
          onClick={() => navigate('/agents')}
          className="flex-1"
          variant="outline"
        >
          Configure AI Agents
        </Button>
      </CardContent>
    </Card>
  );
};
