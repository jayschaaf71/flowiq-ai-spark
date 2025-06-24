
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle } from "lucide-react";

export const DenialPatternsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Denial Patterns & Auto-Correction Rules</CardTitle>
        <CardDescription>
          AI-identified patterns with automated correction capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>92% of CO-97 denials</strong> can be auto-corrected by updating provider NPI numbers
            </AlertDescription>
          </Alert>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>87% of CO-16 denials</strong> can be resolved by adding missing diagnosis codes
            </AlertDescription>
          </Alert>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>CO-24 fee schedule denials</strong> require manual review and potential appeals
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};
