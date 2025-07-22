
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AIClaimsReviewCenter } from "./AIClaimsReviewCenter";
import { IntelligentClaimsAnalyzer } from "./review/IntelligentClaimsAnalyzer";
import { ClaimsRiskAssessment } from "./review/ClaimsRiskAssessment";
import { AutoCorrectionEngine } from "./review/AutoCorrectionEngine";
import { useClaimsData } from "@/hooks/useClaimsData";
import { aiClaimsReviewEngine, ClaimReviewResult } from "@/services/aiClaimsReview/reviewEngine";
import { ClaimValidationData } from "@/services/aiClaimsValidation";
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Shield
} from "lucide-react";

export const AIClaimsReviewEngine = () => {
  const { claims, loading } = useClaimsData();
  const [selectedClaim, setSelectedClaim] = useState<ClaimValidationData | null>(null);
  const [reviewResults, setReviewResults] = useState<ClaimReviewResult[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [activeView, setActiveView] = useState<'analyzer' | 'risk' | 'corrections' | 'center'>('analyzer');
  const { toast } = useToast();

  // Convert claim data to validation format
  const convertClaimToValidationData = (claim: { [key: string]: unknown }): ClaimValidationData => {
    return {
      claimNumber: String(claim.claim_number || ''),
      patientInfo: {
        id: String(claim.patient_id || ''),
        firstName: typeof claim.patient_name === 'string' ? claim.patient_name.split(' ')[0] : 'Unknown',
        lastName: typeof claim.patient_name === 'string' ? claim.patient_name.split(' ')[1] || '' : 'Patient',
        dateOfBirth: '1990-01-01',
        insuranceInfo: {
          provider: String(claim.insurance_name || 'Unknown Insurance'),
          policyNumber: 'POL123456',
          groupNumber: 'GRP789'
        }
      },
      providerInfo: {
        id: 'provider-1',
        firstName: 'Dr. John',
        lastName: 'Smith',
        npi: '1234567890',
        specialty: 'Family Medicine'
      },
      insuranceInfo: {
        name: String(claim.insurance_name || 'Unknown Insurance'),
        id: 'insurance-1'
      },
      serviceDate: String(claim.service_date || ''),
      billingCodes: [
        { code: '99213', codeType: 'CPT', description: 'Office visit', amount: 150 }
      ],
      totalAmount: typeof claim.total_amount === 'number' ? claim.total_amount : 0,
      diagnosis: 'Essential hypertension'
    };
  };

  const handleBatchReview = async () => {
    if (!claims || claims.length === 0) {
      toast({
        title: "No Claims Available",
        description: "No claims found to review",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingBatch(true);
    
    try {
      const claimsToReview = claims.slice(0, 5).map(claim => convertClaimToValidationData(claim as unknown as { [key: string]: unknown }));
      const results = await aiClaimsReviewEngine.batchReviewClaims(claimsToReview);
      setReviewResults(results);

      toast({
        title: "Batch Review Complete",
        description: `Processed ${results.length} claims with AI analysis`,
      });

    } catch (error) {
      console.error('Batch review error:', error);
      toast({
        title: "AI Review Failed",
        description: "Unable to complete intelligent batch review",
        variant: "destructive"
      });
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleReviewComplete = (result: ClaimReviewResult) => {
    setReviewResults(prev => {
      const existing = prev.findIndex(r => r.claimId === result.claimId);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = result;
        return updated;
      }
      return [...prev, result];
    });
  };

  // Enhanced statistics from review results
  const stats = {
    totalReviewed: reviewResults.length,
    averageScore: reviewResults.length > 0 
      ? Math.round(reviewResults.reduce((acc, r) => acc + r.overallScore, 0) / reviewResults.length)
      : 0,
    readyForSubmission: reviewResults.filter(r => r.submissionReady).length,
    needsAttention: reviewResults.filter(r => !r.submissionReady).length,
    autoCorrections: reviewResults.reduce((acc, r) => acc + r.autoCorrections.length, 0),
    highRiskClaims: reviewResults.filter(r => r.riskFactors.some(rf => rf.severity === 'critical')).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-6 h-6 animate-spin mr-2" />
        <span>Loading AI Claims Review Engine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">AI Claims Review Engine</h2>
            <p className="text-gray-600">Intelligent validation, risk assessment, and auto-correction</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-purple-100 text-purple-700">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            <Zap className="w-3 h-3 mr-1" />
            Auto-Correction
          </Badge>
          <Badge className="bg-orange-100 text-orange-700">
            <Target className="w-3 h-3 mr-1" />
            Risk Scoring
          </Badge>
        </div>
      </div>

      {/* Enhanced Statistics Dashboard */}
      {reviewResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalReviewed}</div>
              <p className="text-sm text-muted-foreground">Claims Reviewed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.averageScore}%</div>
              <p className="text-sm text-muted-foreground">Average Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.readyForSubmission}</div>
              <p className="text-sm text-muted-foreground">Ready to Submit</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.needsAttention}</div>
              <p className="text-sm text-muted-foreground">Need Attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.autoCorrections}</div>
              <p className="text-sm text-muted-foreground">Auto-Corrections</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-600">{stats.highRiskClaims}</div>
              <p className="text-sm text-muted-foreground">High Risk</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Batch Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Intelligent Batch Processing
          </CardTitle>
          <CardDescription>
            AI-powered analysis with risk assessment, pattern recognition, and auto-corrections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Button 
              onClick={handleBatchReview}
              disabled={isProcessingBatch || !claims || claims.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isProcessingBatch ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  AI Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Start AI Review
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              {claims ? `${claims.length} claims available for intelligent analysis` : 'No claims available'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Review Modules Navigation */}
      <div className="flex gap-2 border-b">
        <Button 
          variant={activeView === 'analyzer' ? 'default' : 'ghost'}
          onClick={() => setActiveView('analyzer')}
          className="flex items-center gap-2"
        >
          <Brain className="w-4 h-4" />
          Intelligent Analyzer
        </Button>
        <Button 
          variant={activeView === 'risk' ? 'default' : 'ghost'}
          onClick={() => setActiveView('risk')}
          className="flex items-center gap-2"
        >
          <Shield className="w-4 h-4" />
          Risk Assessment
        </Button>
        <Button 
          variant={activeView === 'corrections' ? 'default' : 'ghost'}
          onClick={() => setActiveView('corrections')}
          className="flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Auto-Corrections
        </Button>
        <Button 
          variant={activeView === 'center' ? 'default' : 'ghost'}
          onClick={() => setActiveView('center')}
          className="flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          Review Center
        </Button>
      </div>

      {/* Dynamic Content Based on Active View */}
      {activeView === 'analyzer' && (
        <IntelligentClaimsAnalyzer 
          claims={claims}
          reviewResults={reviewResults}
          onClaimSelect={setSelectedClaim}
        />
      )}

      {activeView === 'risk' && (
        <ClaimsRiskAssessment 
          reviewResults={reviewResults}
          selectedClaim={selectedClaim}
        />
      )}

      {activeView === 'corrections' && (
        <AutoCorrectionEngine 
          reviewResults={reviewResults}
          onCorrectionApplied={handleReviewComplete}
        />
      )}

      {activeView === 'center' && (
        <AIClaimsReviewCenter 
          claimData={selectedClaim}
          onReviewComplete={handleReviewComplete}
        />
      )}

      {/* Recent Review Results Summary */}
      {reviewResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent AI Review Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reviewResults.slice(0, 5).map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {result.submissionReady ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.claimId}</p>
                      <p className="text-sm text-muted-foreground">
                        Score: {result.overallScore}% • 
                        {result.riskFactors.length} risks • 
                        {result.autoCorrections.length} corrections • 
                        {result.processingTime.toFixed(1)}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.submissionReady ? "default" : "secondary"}>
                      {result.submissionReady ? 'AI Approved' : 'Needs Review'}
                    </Badge>
                    {result.riskFactors.some(r => r.severity === 'critical') && (
                      <Badge variant="destructive">High Risk</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
