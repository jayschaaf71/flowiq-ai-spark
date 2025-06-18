
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const WorkflowAnalytics = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Performance</CardTitle>
        <CardDescription>Analytics and insights for your workflows</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <TrendingUp className="w-12 h-12 mx-auto mb-4" />
          <p>Workflow analytics coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
