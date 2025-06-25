
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { aiClaimsValidationService, ValidationResult, ValidationIssue } from "@/services/aiClaimsValidation";
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Loader2,
  Eye,
  Zap,
  TrendingUp,
  Shield
} from "lucide-react";

interface AIValidationPanelProps {
  claimData: any;
  onValidationComplete?: (result: ValidationResult) => void;
}

export const AIValidationPanel = ({ claimData, onValidationComplete }: AIValidationPanelProps) => {
  const { toast } = useToast();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidate = async () => {
    setIsValidating(true);
    try {
      const result = await aiClaimsValidationService.validateClaim({
        claimNumber: claimData.claim_number,
        patientInfo: claimData.patients,
        providerInfo: claimData.providers, 
        insuranceInfo: claimData.insurance_providers,
        serviceDate: claimData.service_date,
        billingCodes: [{ code: 'CPT-99213' }], // Mock billing codes
        totalAmount: claimData.total_amount,
        diagnosis: 'Sample diagnosis'
      });

      setValidationResult(result);
      onValidationComplete?.(result);

      toast({
        title: result.isValid ? "Validation Passed" : "Issues Found",
        description: `AI confidence: ${result.confidence}% - ${result.issues.length} issues detected`,
        variant: result.isValid ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Error",
        description: "Unable to complete AI validation",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Claims Validation Engine
        </CardTitle>
        <CardDescription>
          Advanced AI analysis to identify potential claim issues before submission
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {!validationResult && (
          <div className="text-center py-6">
            <Button 
              onClick={handleValidate} 
              disabled={isValidating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Claim...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Run AI Validation
                </>
              )}
            </Button>
          </div>
        )}

        {validationResult && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues ({validationResult.issues.length})</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
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

              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Analysis:</strong> {validationResult.aiAnalysis}
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              {validationResult.issues.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No issues detected. This claim appears ready for submission.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {validationResult.issues.map((issue, index) => (
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
                            {issue.suggestedFix && (
                              <p className="text-sm text-blue-600">
                                <strong>Suggested Fix:</strong> {issue.suggestedFix}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {validationResult.suggestions.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No specific suggestions needed. The claim validation is complete.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-2">
                  {validationResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <Zap className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleValidate}
            disabled={isValidating}
          >
            {isValidating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Re-run Validation
          </Button>
          
          {validationResult && validationResult.isValid && (
            <Button className="bg-green-600 hover:bg-green-700">
              Approve for Submission
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
