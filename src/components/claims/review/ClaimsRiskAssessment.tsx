
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClaimReviewResult } from "@/services/aiClaimsReview/reviewEngine";
import { ClaimValidationData } from "@/services/aiClaimsValidation";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown,
  Clock,
  DollarSign,
  FileX,
  CheckCircle
} from "lucide-react";

interface ClaimsRiskAssessmentProps {
  reviewResults: ClaimReviewResult[];
  selectedClaim: ClaimValidationData | null;
}

export const ClaimsRiskAssessment = ({ reviewResults, selectedClaim }: ClaimsRiskAssessmentProps) => {
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<string | null>(null);

  // Calculate risk metrics
  const riskMetrics = {
    totalClaims: reviewResults.length,
    highRiskClaims: reviewResults.filter(r => 
      r.riskFactors.some(rf => rf.severity === 'critical' || rf.severity === 'high')
    ).length,
    mediumRiskClaims: reviewResults.filter(r => 
      r.riskFactors.some(rf => rf.severity === 'medium') && 
      !r.riskFactors.some(rf => rf.severity === 'critical' || rf.severity === 'high')
    ).length,
    lowRiskClaims: reviewResults.filter(r => 
      r.riskFactors.every(rf => rf.severity === 'low') ||
      r.riskFactors.length === 0
    ).length
  };

  // Risk categories analysis
  const riskCategories = [
    {
      type: 'denial_risk',
      name: 'Denial Risk',
      icon: <FileX className="w-5 h-5 text-red-600" />,
      count: reviewResults.filter(r => r.riskFactors.some(rf => rf.type === 'denial_risk')).length,
      description: 'Claims likely to be denied by payers',
      color: 'red'
    },
    {
      type: 'compliance_risk',
      name: 'Compliance Risk',
      icon: <Shield className="w-5 h-5 text-orange-600" />,
      count: reviewResults.filter(r => r.riskFactors.some(rf => rf.type === 'compliance_risk')).length,
      description: 'Claims with regulatory compliance issues',
      color: 'orange'
    },
    {
      type: 'audit_risk',
      name: 'Audit Risk',
      icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
      count: reviewResults.filter(r => r.riskFactors.some(rf => rf.type === 'audit_risk')).length,
      description: 'Claims that may trigger payer audits',
      color: 'yellow'
    }
  ];

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskPercentage = () => {
    if (riskMetrics.totalClaims === 0) return 0;
    return Math.round(((riskMetrics.highRiskClaims + riskMetrics.mediumRiskClaims) / riskMetrics.totalClaims) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AI Risk Assessment Dashboard
          </CardTitle>
          <CardDescription>
            Machine learning-powered risk analysis for proactive claim management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{riskMetrics.totalClaims}</div>
              <p className="text-sm text-muted-foreground">Total Claims</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{riskMetrics.highRiskClaims}</div>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{riskMetrics.mediumRiskClaims}</div>
              <p className="text-sm text-muted-foreground">Medium Risk</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{riskMetrics.lowRiskClaims}</div>
              <p className="text-sm text-muted-foreground">Low Risk</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Risk Level</span>
              <span>{getRiskPercentage()}% of claims need attention</span>
            </div>
            <Progress value={getRiskPercentage()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Risk Categories Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {riskCategories.map((category) => (
          <Card 
            key={category.type}
            className={`cursor-pointer transition-all ${
              selectedRiskCategory === category.type ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedRiskCategory(
              selectedRiskCategory === category.type ? null : category.type
            )}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </div>
                <Badge variant="outline">{category.count}</Badge>
              </CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress 
                value={riskMetrics.totalClaims > 0 ? (category.count / riskMetrics.totalClaims) * 100 : 0} 
                className="h-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Risk Analysis */}
      {selectedRiskCategory && (
        <Card>
          <CardHeader>
            <CardTitle>
              {riskCategories.find(c => c.type === selectedRiskCategory)?.name} Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewResults
                .filter(r => r.riskFactors.some(rf => rf.type === selectedRiskCategory))
                .map((result, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{result.claimId}</h4>
                      <Badge variant="outline">Score: {result.overallScore}%</Badge>
                    </div>
                    <div className="space-y-2">
                      {result.riskFactors
                        .filter(rf => rf.type === selectedRiskCategory)
                        .map((risk, riskIndex) => (
                          <div 
                            key={riskIndex}
                            className={`p-3 rounded-lg border ${getRiskColor(risk.severity)}`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium capitalize">{risk.severity} Risk</span>
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <p className="text-sm mb-2">{risk.description}</p>
                            <p className="text-xs font-medium">Mitigation: {risk.mitigation}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Claim Risk Detail */}
      {selectedClaim && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileX className="w-5 h-5" />
              Risk Analysis: {selectedClaim.claimNumber}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock detailed risk analysis for selected claim */}
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  AI Analysis Complete: This claim has been thoroughly evaluated for risk factors.
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium">Risk Factors Detected</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Coding Accuracy</span>
                      <Badge variant="outline" className="text-green-600">Low Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <span className="text-sm">Documentation Quality</span>
                      <Badge variant="outline" className="text-yellow-600">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span className="text-sm">Payer Relations</span>
                      <Badge variant="outline" className="text-green-600">Low Risk</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium">Recommended Actions</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm">Review supporting documentation</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm">Verify insurance eligibility</span>
                    </div>
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                      <span className="text-sm">Submit within optimal timeframe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
