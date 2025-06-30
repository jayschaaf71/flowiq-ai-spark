
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle, Eye } from "lucide-react";
import { ValidationIssue } from "@/services/aiClaimsValidation";

interface ValidationIssuesListProps {
  issues: ValidationIssue[];
}

export const ValidationIssuesList = ({ issues }: ValidationIssuesListProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Eye className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: "destructive",
      high: "destructive", 
      medium: "secondary",
      low: "outline"
    } as const;
    
    return <Badge variant={variants[severity as keyof typeof variants]}>{severity}</Badge>;
  };

  if (issues.length === 0) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          No issues detected. This claim appears ready for submission.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getSeverityIcon(issue.severity)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{issue.field.replace(/_/g, ' ').toUpperCase()}</h4>
                  {getSeverityBadge(issue.severity)}
                </div>
                <p className="text-sm text-gray-700 mb-2">{issue.issue}</p>
                {issue.suggestion && (
                  <p className="text-sm text-blue-600">
                    <strong>Suggestion:</strong> {issue.suggestion}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
