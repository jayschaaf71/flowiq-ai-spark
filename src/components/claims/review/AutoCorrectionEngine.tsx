
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ClaimReviewResult, AutoCorrection } from "@/services/aiClaimsReview/reviewEngine";
import { 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  RefreshCw,
  Wand2,
  Target,
  Lightbulb
} from "lucide-react";

interface AutoCorrectionEngineProps {
  reviewResults: ClaimReviewResult[];
  onCorrectionApplied: (result: ClaimReviewResult) => void;
}

export const AutoCorrectionEngine = ({ reviewResults, onCorrectionApplied }: AutoCorrectionEngineProps) => {
  const [applyingCorrections, setApplyingCorrections] = useState<string[]>([]);
  const [selectedCorrection, setSelectedCorrection] = useState<AutoCorrection | null>(null);
  const { toast } = useToast();

  // Get all available corrections from review results
  const availableCorrections = reviewResults.flatMap(result => 
    result.autoCorrections.map(correction => ({
      ...correction,
      claimId: result.claimId,
      claimScore: result.overallScore
    }))
  );

  // Group corrections by type
  const correctionsByType = availableCorrections.reduce((acc, correction) => {
    const type = correction.field;
    if (!acc[type]) acc[type] = [];
    acc[type].push(correction);
    return acc;
  }, {} as Record<string, any[]>);

  const applyCorrection = async (correction: any) => {
    setApplyingCorrections(prev => [...prev, `${correction.claimId}-${correction.field}`]);
    
    try {
      // Simulate applying correction
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Find and update the review result
      const updatedResult = reviewResults.find(r => r.claimId === correction.claimId);
      if (updatedResult) {
        // Mark correction as applied and improve score
        const updatedCorrections = updatedResult.autoCorrections.map(c => 
          c.field === correction.field ? { ...c, autoApplicable: false } : c
        );
        
        const improvedResult = {
          ...updatedResult,
          autoCorrections: updatedCorrections,
          overallScore: Math.min(100, updatedResult.overallScore + 5) // Improve score
        };
        
        onCorrectionApplied(improvedResult);
      }

      toast({
        title: "Correction Applied",
        description: `Auto-correction for ${correction.field} has been applied successfully`,
      });

    } catch (error) {
      console.error('Error applying correction:', error);
      toast({
        title: "Correction Failed",
        description: "Unable to apply auto-correction",
        variant: "destructive"
      });
    } finally {
      setApplyingCorrections(prev => 
        prev.filter(id => id !== `${correction.claimId}-${correction.field}`)
      );
    }
  };

  const batchApplyCorrections = async () => {
    const autoApplicableCorrections = availableCorrections.filter(c => c.autoApplicable);
    
    if (autoApplicableCorrections.length === 0) {
      toast({
        title: "No Auto-Applicable Corrections",
        description: "All available corrections require manual review",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Batch Corrections Started",
      description: `Applying ${autoApplicableCorrections.length} auto-corrections...`,
    });

    for (const correction of autoApplicableCorrections) {
      await applyCorrection(correction);
      // Small delay between corrections
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast({
      title: "Batch Corrections Complete",
      description: `Applied ${autoApplicableCorrections.length} corrections successfully`,
    });
  };

  const getCorrectionIcon = (field: string) => {
    switch (field) {
      case 'billing_code_amount':
        return <Target className="w-4 h-4 text-blue-600" />;
      case 'provider_npi':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'insurance_policy':
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      default:
        return <Wand2 className="w-4 h-4 text-purple-600" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Auto-Correction Engine
          </CardTitle>
          <CardDescription>
            Intelligent claim corrections with confidence scoring and batch processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{availableCorrections.length}</div>
              <p className="text-sm text-muted-foreground">Total Corrections</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {availableCorrections.filter(c => c.autoApplicable).length}
              </div>
              <p className="text-sm text-muted-foreground">Auto-Applicable</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {availableCorrections.filter(c => !c.autoApplicable).length}
              </div>
              <p className="text-sm text-muted-foreground">Manual Review</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {availableCorrections.length > 0 
                  ? Math.round(availableCorrections.reduce((acc, c) => acc + c.confidence, 0) / availableCorrections.length)
                  : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
          </div>

          {availableCorrections.filter(c => c.autoApplicable).length > 0 && (
            <div className="mt-4 flex gap-2">
              <Button 
                onClick={batchApplyCorrections}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Zap className="w-4 h-4" />
                Apply All Auto-Corrections
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Corrections by Type */}
      <div className="space-y-4">
        {Object.entries(correctionsByType).map(([type, corrections]) => (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                {getCorrectionIcon(type)}
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Corrections
              </CardTitle>
              <CardDescription>
                {corrections.length} correction{corrections.length !== 1 ? 's' : ''} available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {corrections.map((correction, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${getConfidenceColor(correction.confidence)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Claim: {correction.claimId}</span>
                        <Badge variant="outline">
                          {correction.confidence}% confidence
                        </Badge>
                        {correction.autoApplicable && (
                          <Badge className="bg-green-100 text-green-700">
                            Auto-Applicable
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => applyCorrection(correction)}
                        disabled={applyingCorrections.includes(`${correction.claimId}-${correction.field}`)}
                        variant={correction.autoApplicable ? "default" : "outline"}
                      >
                        {applyingCorrections.includes(`${correction.claimId}-${correction.field}`) ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            <Zap className="w-3 h-3 mr-1" />
                            Apply
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Original Value:</span>
                          <p className="text-gray-600 mt-1">{correction.originalValue}</p>
                        </div>
                        <div>
                          <span className="font-medium">Suggested Value:</span>
                          <p className="text-green-600 mt-1">{correction.correctedValue}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="font-medium flex items-center gap-1">
                          <Lightbulb className="w-3 h-3" />
                          AI Reasoning:
                        </span>
                        <p className="text-gray-700 text-sm mt-1">{correction.reasoning}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {availableCorrections.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-600" />
            <h3 className="text-lg font-medium mb-2">No Corrections Available</h3>
            <p className="text-muted-foreground">
              All claims have been reviewed and no auto-corrections are currently needed.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Correction Details Modal */}
      {selectedCorrection && (
        <Alert>
          <Lightbulb className="h-4 w-4" />
          <AlertDescription>
            <strong>Correction Details:</strong> {selectedCorrection.reasoning}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
