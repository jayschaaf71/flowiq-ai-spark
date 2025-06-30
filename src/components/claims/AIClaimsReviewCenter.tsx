
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { aiClaimsReviewEngine, ClaimReviewResult } from "@/services/aiClaimsReview/reviewEngine";
import { ClaimValidationData } from "@/services/aiClaimsValidation";
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Zap,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Eye
} from "lucide-react";

interface AIClaimsReviewCenterProps {
  claimData?: ClaimValidationData;
  onReviewComplete?: (result: ClaimReviewResult) => void;
}

export const AIClaimsReviewCenter = ({ claimData, onReviewComplete }: AIClaimsReviewCenterProps) => {
  const [reviewResult, setReviewResult] = useState<ClaimReviewResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewProgress, setReviewProgress] = useState(0);
  const { toast } = useToast();

  const handleAIReview = async () => {
    if (!claimData) {
      toast({
        title: "No Claim Data",
        description: "Please select a claim to review",
        variant: "destructive"
      });
      return;
    }

    setIsReviewing(true);
    setReviewProgress(0);

    try {
      // Simulate AI processing with progress updates
      const progressInterval = setInterval(() => {
        setReviewProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const result = await aiClaimsReviewEngine.reviewClaim(claimData);
      
      clearInterval(progressInterval);
      setReviewProgress(100);
      
      setReviewResult(result);
      onReviewComplete?.(result);

      toast({
        title: "AI Review Complete",
        description: `Overall Score: ${result.overallScore}% - ${result.submissionReady ? 'Ready for submission' : 'Requires attention'}`,
        variant: result.submissionReady ? "default" : "destructive"
      });

    } catch (error) {
      console.error('AI Review error:', error);
      toast({
        title: "Review Failed",
        description: "Unable to complete AI review",
        variant: "destructive"
      });
    } finally {
      setIsReviewing(false);
    }
  };

  const applyAutoCorrection = async (correctionIndex: number) => {
    if (!reviewResult) return;

    const correction = reviewResult.autoCorrections[correctionIndex];
    
    toast({
      title: "Auto-Correction Applied",
      description: `Updated ${correction.field}: ${correction.reasoning}`,
    });

    // Update the correction status
    const updatedResult = {
      ...reviewResult,
      autoCorrections: reviewResult.autoCorrections.map((c, i) => 
        i === correctionIndex ? { ...c, autoApplicable: false } : c
      )
    };
    setReviewResult(updatedResult);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-600">Excellent</Badge>;
    if (score >= 75) return <Badge className="bg-yellow-600">Good</Badge>;
    if (score >= 60) return <Badge className="bg-orange-600">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const getRiskIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Eye className="w-4 h-4 text-yellow-600" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Claims Review Center
          </h3>
          <p className="text-gray-600">
            Advanced AI analysis with auto-correction and risk assessment
          </p>
        </div>
        <Button 
          onClick={handleAIReview}
          disabled={isReviewing || !claimData}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isReviewing ? 'Analyzing...' : 'Run AI Review'}
        </Button>
      </div>

      {/* Processing Status */}
      {isReviewing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
                <div className="flex-1">
                  <p className="font-medium">AI Analysis in Progress...</p>
                  <p className="text-sm text-muted-foreground">
                    Validating codes, checking compliance, assessing risks
                  </p>
                </div>
              </div>
              <Progress value={reviewProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {reviewProgress}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Results */}
      {reviewResult && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="corrections">
              Auto-Corrections ({reviewResult.autoCorrections.length})
            </TabsTrigger>
            <TabsTrigger value="risks">
              Risks ({reviewResult.riskFactors.length})
            </TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(reviewResult.overallScore)}`}>
                    {reviewResult.overallScore}%
                  </div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  {getScoreBadge(reviewResult.overallScore)}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    {reviewResult.submissionReady ? (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-8 h-8 text-orange-600" />
                    )}
                  </div>
                  <p className="font-medium">
                    {reviewResult.submissionReady ? 'Ready' : 'Not Ready'}
                  </p>
                  <p className="text-sm text-muted-foreground">Submission Status</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-xl font-bold">{reviewResult.processingTime.toFixed(1)}s</div>
                  <p className="text-sm text-muted-foreground">Processing Time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-xl font-bold">{reviewResult.validationResults.confidence}%</div>
                  <p className="text-sm text-muted-foreground">AI Confidence</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{reviewResult.validationResults.aiAnalysis}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="corrections" className="space-y-4">
            {reviewResult.autoCorrections.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-medium">No Corrections Needed</p>
                  <p className="text-muted-foreground">All fields appear to be accurate</p>
                </CardContent>
              </Card>
            ) : (
              reviewResult.autoCorrections.map((correction, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-blue-600" />
                          <h4 className="font-medium">{correction.field.replace(/_/g, ' ').toUpperCase()}</h4>
                          <Badge variant="outline">{correction.confidence}% confidence</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{correction.reasoning}</p>
                        <div className="bg-gray-50 p-2 rounded text-sm">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="font-medium">Original:</span> {correction.originalValue}
                            </div>
                            <div>
                              <span className="font-medium">Suggested:</span> {correction.correctedValue}
                            </div>
                          </div>
                        </div>
                      </div>
                      {correction.autoApplicable && (
                        <Button
                          size="sm"
                          onClick={() => applyAutoCorrection(index)}
                          className="ml-4"
                        >
                          Apply Fix
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            {reviewResult.riskFactors.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <p className="text-lg font-medium">No Risks Detected</p>
                  <p className="text-muted-foreground">Claim appears compliant and low-risk</p>
                </CardContent>
              </Card>
            ) : (
              reviewResult.riskFactors.map((risk, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getRiskIcon(risk.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{risk.type.replace(/_/g, ' ').toUpperCase()}</h4>
                          <Badge variant={risk.severity === 'critical' ? 'destructive' : 'secondary'}>
                            {risk.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{risk.description}</p>
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4">
            {reviewResult.recommendedActions.map((action, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <h4 className="font-medium">{action.action}</h4>
                        <Badge variant={action.priority === 'immediate' ? 'destructive' : 'secondary'}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Impact:</span> {action.estimatedImpact}
                        </div>
                        <div>
                          <span className="font-medium">Timeframe:</span> {action.timeframe}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}

      {/* Submission Actions */}
      {reviewResult && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              {reviewResult.submissionReady ? (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve for Submission
                </Button>
              ) : (
                <Button variant="outline">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Fix Issues First
                </Button>
              )}
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" onClick={handleAIReview}>
                <Brain className="w-4 h-4 mr-2" />
                Re-run Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
