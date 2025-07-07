import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";
import { ValidationResult } from "@/services/aiClaimsValidation";

interface ValidationOverviewProps {
  validationResult: ValidationResult;
}

export const ValidationOverview = ({ validationResult }: ValidationOverviewProps) => {
  const getStatusIcon = () => {
    if (validationResult.isValid) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (validationResult.issues.some(issue => issue.severity === 'critical')) {
      return <XCircle className="w-6 h-6 text-red-600" />;
    } else {
      return <AlertTriangle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getStatusColor = () => {
    if (validationResult.isValid) return "bg-green-100 text-green-700";
    if (validationResult.issues.some(issue => issue.severity === 'critical')) return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Validation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">AI Confidence Score</span>
                <Badge className={getStatusColor()}>
                  {validationResult.confidence}%
                </Badge>
              </div>
              <Progress value={validationResult.confidence} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Issues:</span>
                <span className="ml-2 font-bold">{validationResult.issues.length}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Critical Issues:</span>
                <span className="ml-2 font-bold text-red-600">
                  {validationResult.issues.filter(issue => issue.severity === 'critical').length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Warnings:</span>
                <span className="ml-2 font-bold text-yellow-600">
                  {validationResult.issues.filter(issue => issue.severity === 'medium').length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Suggestions:</span>
                <span className="ml-2 font-bold text-blue-600">{validationResult.suggestions.length}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm">Validation Status</span>
              </div>
              <p className="text-sm text-gray-700">
                {validationResult.isValid 
                  ? "This claim has passed all validation checks and is ready for submission."
                  : "This claim has validation issues that should be addressed before submission."
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};