
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, TrendingUp, Shield } from "lucide-react";
import { ValidationResult } from "@/services/aiClaimsValidation";

interface ValidationOverviewProps {
  validationResult: ValidationResult;
}

export const ValidationOverview = ({ validationResult }: ValidationOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {validationResult.isValid ? (
              <CheckCircle className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
            <div>
              <p className="font-semibold">
                {validationResult.isValid ? 'Valid' : 'Issues Found'}
              </p>
              <p className="text-sm text-gray-600">Overall Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold">{validationResult.confidence}%</p>
              <p className="text-sm text-gray-600">AI Confidence</p>
            </div>
          </div>
          <Progress value={validationResult.confidence} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold">{validationResult.issues.length}</p>
              <p className="text-sm text-gray-600">Issues Detected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
