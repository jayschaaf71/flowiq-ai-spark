
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AIClaimsReviewCenter } from "./AIClaimsReviewCenter";
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
  BarChart3
} from "lucide-react";

export const AIClaimsReviewEngine = () => {
  const { claims, loading } = useClaimsData();
  const [selectedClaim, setSelectedClaim] = useState<ClaimValidationData | null>(null);
  const [reviewResults, setReviewResults] = useState<ClaimReviewResult[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const { toast } = useToast();

  // Convert claim data to validation format
  const convertClaimToValidationData = (claim: any): ClaimValidationData => {
    return {
      claimNumber: claim.claim_number,
      patientInfo: {
        id: claim.patient_id,
        firstName: claim.patient_name?.split(' ')[0] || 'Unknown',
        lastName: claim.patient_name?.split(' ')[1] || 'Patient',
        dateOfBirth: '1990-01-01', // Mock data
        insuranceInfo: {
          provider: claim.insurance_name || 'Unknown Insurance',
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
        name: claim.insurance_name || 'Unknown Insurance',
        id: 'insurance-1'
      },
      serviceDate: claim.service_date,
      billingCodes: [
        { code: '99213', codeType: 'CPT', description: 'Office visit', amount: 150 }
      ],
      totalAmount: claim.total_amount,
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
      // Take first 5 claims for batch processing
      const claimsToReview = claims.slice(0, 5).map(convertClaimToValidationData);
      
      const results = await aiClaimsReviewEngine.batchReviewClaims(claimsToReview);
      setReviewResults(results);

      toast({
        title: "Batch Review Complete",
        description: `Processed ${results.length} claims`,
      });

    } catch (error) {
      console.error('Batch review error:', error);
      toast({
        title: "Batch Review Failed",
        description: "Unable to complete batch review",
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

  // Statistics from review results
  const stats = {
    totalReviewed: reviewResults.length,
    averageScore: reviewResults.length > 0 
      ? Math.round(reviewResults.reduce((acc, r) => acc + r.overallScore, 0) / reviewResults.length)
      : 0,
    readyForSubmission: reviewResults.filter(r => r.submissionReady).length,
    needsAttention: reviewResults.filter(r => !r.submissionReady).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-6 h-6 animate-spin mr-2" />
        <span>Loading claims data...</span>
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
            <p className="text-gray-600">Intelligent claim validation with auto-correction and risk assessment</p>
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
        </div>
      </div>

      {/* Statistics Dashboard */}
      {reviewResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        </div>
      )}

      {/* Batch Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Batch Processing
          </CardTitle>
          <CardDescription>
            Process multiple claims simultaneously with AI review
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
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Review All Claims
                </>
              )}
            </Button>
            <div className="text-sm text-muted-foreground">
              {claims ? `${claims.length} claims available for review` : 'No claims available'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Claim Review */}
      <Card>
        <CardHeader>
          <CardTitle>Individual Claim Review</CardTitle>
          <CardDescription>
            Select a specific claim for detailed AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims && claims.length > 0 ? (
              <div className="grid gap-2">
                <label className="text-sm font-medium">Select Claim:</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => {
                    const claim = claims.find(c => c.claim_number === e.target.value);
                    if (claim) {
                      setSelectedClaim(convertClaimToValidationData(claim));
                    }
                  }}
                >
                  <option value="">Choose a claim...</option>
                  {claims.map(claim => (
                    <option key={claim.id} value={claim.claim_number}>
                      {claim.claim_number} - {claim.patient_name} - ${claim.total_amount}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No claims available for review
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Review Center */}
      <AIClaimsReviewCenter 
        claimData={selectedClaim}
        onReviewComplete={handleReviewComplete}
      />

      {/* Recent Review Results */}
      {reviewResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Recent Review Results
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
                        Score: {result.overallScore}% • {result.processingTime.toFixed(1)}s
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.submissionReady ? "default" : "secondary"}>
                      {result.submissionReady ? 'Ready' : 'Needs Work'}
                    </Badge>
                    {result.autoCorrections.length > 0 && (
                      <Badge variant="outline">
                        {result.autoCorrections.length} corrections
                      </Badge>
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
