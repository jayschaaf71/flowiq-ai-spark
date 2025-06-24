
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  FileText,
  TrendingUp
} from "lucide-react";

interface ClaimValidation {
  id: string;
  claimId: string;
  patientName: string;
  claimAmount: number;
  validationStatus: 'processing' | 'approved' | 'flagged' | 'rejected';
  confidenceScore: number;
  issues: string[];
  recommendations: string[];
  processingTime: number;
}

export const AIClaimsReviewEngine = () => {
  const [validations, setValidations] = useState<ClaimValidation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  // Simulate AI processing
  const processClaimsWithAI = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const mockClaims: ClaimValidation[] = [
      {
        id: '1',
        claimId: 'CLM-2024-001',
        patientName: 'John Smith',
        claimAmount: 350.00,
        validationStatus: 'approved',
        confidenceScore: 94,
        issues: [],
        recommendations: ['Claim ready for submission'],
        processingTime: 2.3
      },
      {
        id: '2',
        claimId: 'CLM-2024-002',
        patientName: 'Sarah Johnson',
        claimAmount: 275.50,
        validationStatus: 'flagged',
        confidenceScore: 67,
        issues: ['Missing procedure modifier', 'Diagnosis code mismatch'],
        recommendations: ['Add modifier -25 to procedure code', 'Verify diagnosis code D0150'],
        processingTime: 4.1
      },
      {
        id: '3',
        claimId: 'CLM-2024-003',
        patientName: 'Mike Wilson',
        claimAmount: 450.00,
        validationStatus: 'processing',
        confidenceScore: 0,
        issues: [],
        recommendations: [],
        processingTime: 0
      }
    ];

    // Simulate AI processing with progress
    for (let i = 0; i <= 100; i += 20) {
      setProcessingProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setValidations(mockClaims);
    setIsProcessing(false);

    toast({
      title: "AI Review Complete",
      description: `Processed ${mockClaims.length} claims with AI validation`,
    });
  };

  const getStatusBadge = (status: string, confidence: number) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved ({confidence}%)</Badge>;
      case 'flagged':
        return <Badge variant="secondary">Flagged ({confidence}%)</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected ({confidence}%)</Badge>;
      case 'processing':
        return <Badge variant="outline">Processing...</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const autoCorrectClaim = async (validationId: string) => {
    setValidations(prev => prev.map(v => 
      v.id === validationId 
        ? { ...v, validationStatus: 'approved' as const, confidenceScore: 89, issues: [], recommendations: ['Auto-corrected successfully'] }
        : v
    ));

    toast({
      title: "Auto-Correction Applied",
      description: "AI has automatically corrected the claim issues",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600" />
            AI Claims Review Engine
          </h3>
          <p className="text-gray-600">
            Advanced AI validation and auto-correction for claims processing
          </p>
        </div>
        <Button 
          onClick={processClaimsWithAI}
          disabled={isProcessing}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Zap className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Run AI Review'}
        </Button>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
                <div className="flex-1">
                  <p className="font-medium">AI Processing Claims...</p>
                  <p className="text-sm text-muted-foreground">
                    Validating billing codes, checking compliance, and identifying issues
                  </p>
                </div>
              </div>
              <Progress value={processingProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                {processingProgress}% Complete
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Review Results */}
      {validations.length > 0 && (
        <div className="space-y-4">
          {validations.map((validation) => (
            <Card key={validation.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">
                      {validation.claimId} - {validation.patientName}
                    </CardTitle>
                    <CardDescription>
                      Amount: ${validation.claimAmount.toFixed(2)} • 
                      Processing Time: {validation.processingTime}s
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(validation.validationStatus, validation.confidenceScore)}
                    {validation.validationStatus === 'processing' && (
                      <Clock className="w-4 h-4 text-gray-400 animate-spin" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {validation.issues.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Issues Detected
                    </h4>
                    <ul className="space-y-1">
                      {validation.issues.map((issue, index) => (
                        <li key={index} className="text-sm text-red-700 pl-6">
                          • {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.recommendations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      AI Recommendations
                    </h4>
                    <ul className="space-y-1">
                      {validation.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-blue-700 pl-6">
                          • {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {validation.validationStatus === 'flagged' && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => autoCorrectClaim(validation.id)}
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Correct
                    </Button>
                    <Button size="sm" variant="outline">
                      <FileText className="w-3 h-3 mr-1" />
                      Manual Review
                    </Button>
                  </div>
                )}
              </CardContent>

              {/* Confidence indicator */}
              <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-green-500 via-yellow-500 to-red-500" 
                   style={{ 
                     background: `linear-gradient(to bottom, 
                       ${validation.confidenceScore > 80 ? '#10B981' : 
                         validation.confidenceScore > 60 ? '#F59E0B' : '#EF4444'} 0%, 
                       transparent 100%)` 
                   }} 
              />
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {validations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              AI Review Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {validations.filter(v => v.validationStatus === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {validations.filter(v => v.validationStatus === 'flagged').length}
                </p>
                <p className="text-sm text-muted-foreground">Flagged</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {validations.filter(v => v.validationStatus === 'rejected').length}
                </p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {Math.round(validations.reduce((acc, v) => acc + v.confidenceScore, 0) / validations.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
