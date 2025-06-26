
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

interface ComplianceScoreCardProps {
  complianceScore: number;
}

export const ComplianceScoreCard = ({ complianceScore }: ComplianceScoreCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Overall Compliance Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Compliance Rating</span>
              <span className="text-2xl font-bold text-green-600">{complianceScore}%</span>
            </div>
            <Progress value={complianceScore} className="h-3" />
          </div>
          <div className="text-center">
            {complianceScore >= 95 ? (
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-1" />
            ) : complianceScore >= 85 ? (
              <AlertTriangle className="w-8 h-8 text-yellow-600 mx-auto mb-1" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-1" />
            )}
            <p className="text-sm font-medium">
              {complianceScore >= 95 ? 'Excellent' : complianceScore >= 85 ? 'Good' : 'Needs Attention'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
