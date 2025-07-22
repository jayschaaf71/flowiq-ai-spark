import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  Shield,
  DollarSign,
  FileText,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ValidationResult {
  overall_score: number;
  validation_status: 'approved' | 'needs_review' | 'rejected';
  issues: string[];
  suggestions: string[];
  denial_risk: 'low' | 'medium' | 'high';
  compliance_flags: string[];
  estimated_approval_amount?: number;
}

interface ClaimData {
  claim_number?: string;
  patient_name?: string;
  total_amount?: number;
  [key: string]: unknown;
}

interface AIClaimsValidatorProps {
  claimData: ClaimData;
  onValidationComplete?: (result: ValidationResult) => void;
}

export const AIClaimsValidator: React.FC<AIClaimsValidatorProps> = ({ 
  claimData, 
  onValidationComplete 
}) => {
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [validationType, setValidationType] = useState<'quick' | 'comprehensive'>('comprehensive');
  const { toast } = useToast();

  const runValidation = async () => {
    if (!claimData) {
      toast({
        title: "No Claim Data",
        description: "Please provide claim data for validation",
        variant: "destructive"
      });
      return;
    }

    setValidating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-claims-validation', {
        body: {
          claimData,
          validationType
        }
      });

      if (error) throw error;

      const result = data.validation_result;
      setValidationResult(result);
      
      if (onValidationComplete) {
        onValidationComplete(result);
      }

      // Show success notification
      toast({
        title: "Validation Complete",
        description: `Claim scored ${result.overall_score}/100 with ${result.validation_status} status`,
      });

    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Failed",
        description: "Unable to validate claim. Please try again.",
        variant: "destructive"
      });
    } finally {
      setValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'needs_review': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50 border-green-200';
      case 'needs_review': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Claims Validator
        </CardTitle>
        <CardDescription>
          AI-powered validation for billing accuracy, compliance, and denial risk assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Validation Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Validation Type:</span>
              <div className="flex gap-2">
                <Button
                  variant={validationType === 'quick' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setValidationType('quick')}
                >
                  Quick Scan
                </Button>
                <Button
                  variant={validationType === 'comprehensive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setValidationType('comprehensive')}
                >
                  Comprehensive
                </Button>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={runValidation}
            disabled={validating}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {validating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Run AI Validation
              </>
            )}
          </Button>
        </div>

        {/* Validation Results */}
        {validationResult && (
          <div className="space-y-4">
            {/* Overall Score */}
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(validationResult.validation_status)}
                    <span className="font-semibold">
                      Overall Score: {validationResult.overall_score}/100
                    </span>
                  </div>
                  <Badge className={getStatusColor(validationResult.validation_status)}>
                    {validationResult.validation_status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                <Progress value={validationResult.overall_score} className="h-3" />
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Denial Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(validationResult.denial_risk)}`} />
                    <span className="capitalize font-semibold">{validationResult.denial_risk}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Issues Found</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">
                    {validationResult.issues.length}
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Est. Approval</span>
                  </div>
                  <span className="text-lg font-bold">
                    ${validationResult.estimated_approval_amount?.toLocaleString() || 'N/A'}
                  </span>
                </CardContent>
              </Card>
            </div>

            {/* Issues and Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Issues */}
              {validationResult.issues.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Issues Identified ({validationResult.issues.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {validationResult.issues.map((issue, index) => (
                          <Alert key={index} className="border-red-200">
                            <AlertDescription className="text-sm">
                              {issue}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}

              {/* Suggestions */}
              {validationResult.suggestions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Recommendations ({validationResult.suggestions.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-32">
                      <div className="space-y-2">
                        {validationResult.suggestions.map((suggestion, index) => (
                          <Alert key={index} className="border-green-200">
                            <AlertDescription className="text-sm">
                              {suggestion}
                            </AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Compliance Flags */}
            {validationResult.compliance_flags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-orange-600" />
                    Compliance Alerts ({validationResult.compliance_flags.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {validationResult.compliance_flags.map((flag, index) => (
                      <Alert key={index} className="border-orange-200">
                        <AlertDescription className="text-sm">
                          {flag}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Claim Info */}
        {claimData && (
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-sm">Claim Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                  <span className="font-medium">Claim #:</span> {claimData.claim_number || 'N/A'}
                  <span className="font-medium">Amount:</span> ${claimData.total_amount?.toLocaleString() || '0'}
                <div>
                  <span className="font-medium">Payer:</span> {String(claimData.payer_name || 'Unknown')}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {String(claimData.status || 'Draft')}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};