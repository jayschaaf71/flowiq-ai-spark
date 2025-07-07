import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import { ValidationIssue } from "@/services/aiClaimsValidation";

interface ValidationIssuesListProps {
  issues: ValidationIssue[];
}

export const ValidationIssuesList = ({ issues }: ValidationIssuesListProps) => {
  const getIssueIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getIssueColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return "border-red-200 bg-red-50";
      case 'warning':
        return "border-yellow-200 bg-yellow-50";
      case 'info':
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      critical: "bg-red-100 text-red-700",
      warning: "bg-yellow-100 text-yellow-700",
      info: "bg-blue-100 text-blue-700"
    };
    
    return (
      <Badge className={colors[severity as keyof typeof colors] || "bg-gray-100 text-gray-700"}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  if (issues.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-green-600 mb-2">
            <XCircle className="w-8 h-8 mx-auto" />
          </div>
          <p className="font-medium text-green-700">No validation issues found</p>
          <p className="text-sm text-green-600">This claim passed all validation checks</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Validation Issues ({issues.length})
          </CardTitle>
          <CardDescription>
            Issues that need to be addressed before claim submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {issues.map((issue, index) => (
              <Alert key={index} className={getIssueColor(issue.severity)}>
                <div className="flex items-start gap-3">
                  {getIssueIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-sm">{issue.field}</p>
                      {getSeverityBadge(issue.severity)}
                    </div>
                    <AlertDescription className="text-sm">
                      {issue.issue}
                    </AlertDescription>
                    {issue.suggestion && (
                      <p className="text-xs text-gray-500 mt-1">Suggestion: {issue.suggestion}</p>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};