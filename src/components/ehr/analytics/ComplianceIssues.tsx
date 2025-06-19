
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export const ComplianceIssues = () => {
  const complianceIssues = [
    {
      issue: "Unsigned notes older than 24h",
      count: 3,
      severity: "high" as const,
      action: "Sign pending notes"
    },
    {
      issue: "Missing patient insurance info",
      count: 12,
      severity: "medium" as const,
      action: "Update patient records"
    },
    {
      issue: "Incomplete SOAP templates",
      count: 5,
      severity: "low" as const,
      action: "Complete note sections"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Compliance Issues
        </CardTitle>
        <CardDescription>Items requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {complianceIssues.map((issue, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{issue.issue}</span>
                  <Badge 
                    variant={
                      issue.severity === 'high' ? 'destructive' :
                      issue.severity === 'medium' ? 'default' : 'secondary'
                    }
                    className="text-xs"
                  >
                    {issue.severity}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{issue.action}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {issue.count}
                </Badge>
                <Button size="sm" variant="outline">
                  Fix
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
