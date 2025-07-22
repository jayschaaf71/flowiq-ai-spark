
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { aiClaimsValidationService, ValidationResult } from "@/services/aiClaimsValidation";
import { Brain } from "lucide-react";
import { ValidationOverview } from "./validation/ValidationOverview";
import { ValidationIssuesList } from "./validation/ValidationIssuesList";
import { ValidationSuggestions } from "./validation/ValidationSuggestions";
import { ValidationActions } from "./validation/ValidationActions";
import { ValidationRunButton } from "./validation/ValidationRunButton";

interface ClaimData {
  claim_number?: string;
  patient_id?: string;
  patient_first_name?: string;
  patient_last_name?: string;
  patient_dob?: string;
  insurance_provider?: string;
  policy_number?: string;
  group_number?: string;
  provider_id?: string;
  provider_first_name?: string;
  provider_last_name?: string;
  provider_npi?: string;
  provider_specialty?: string;
  insurance_name?: string;
  insurance_id?: string;
  service_date?: string;
  billing_codes?: Array<unknown>;
  total_amount?: number;
  diagnosis?: string;
}

interface AIValidationPanelProps {
  claimData: ClaimData;
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
        claimNumber: claimData.claim_number || '',
        patientInfo: {
          id: claimData.patient_id || '',
          firstName: claimData.patient_first_name || '',
          lastName: claimData.patient_last_name || '',
          dateOfBirth: claimData.patient_dob || '1990-01-01',
          insuranceInfo: {
            provider: claimData.insurance_provider || '',
            policyNumber: claimData.policy_number || 'POL123456',
            groupNumber: claimData.group_number || 'GRP789'
          }
        },
        providerInfo: {
          id: claimData.provider_id || '',
          firstName: claimData.provider_first_name || '',
          lastName: claimData.provider_last_name || '',
          npi: claimData.provider_npi || '',
          specialty: claimData.provider_specialty || 'Family Medicine'
        },
        insuranceInfo: {
          name: claimData.insurance_name || '',
          id: claimData.insurance_id || ''
        },
        serviceDate: claimData.service_date || '',
        billingCodes: Array.isArray(claimData.billing_codes) ? claimData.billing_codes.map((code, index) => ({
          code: `CPT-9921${index}`,
          codeType: 'CPT' as const,
          description: 'Office visit',
          amount: 150
        })) : [{ code: 'CPT-99213', codeType: 'CPT' as const, description: 'Office visit', amount: 150 }],
        totalAmount: claimData.total_amount || 0,
        diagnosis: claimData.diagnosis || 'Essential hypertension'
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
          <ValidationRunButton 
            isValidating={isValidating}
            onValidate={handleValidate}
          />
        )}

        {validationResult && (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="issues">Issues ({validationResult.issues.length})</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <ValidationOverview validationResult={validationResult} />

              <Alert>
                <Brain className="h-4 w-4" />
                <AlertDescription>
                  <strong>AI Analysis:</strong> {validationResult.aiAnalysis}
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="issues" className="space-y-4">
              <ValidationIssuesList issues={validationResult.issues} />
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              <ValidationSuggestions suggestions={validationResult.suggestions.map(s => ({ field: 'General', suggestion: s }))} />
            </TabsContent>
          </Tabs>
        )}

        <ValidationActions 
          validationResult={validationResult}
          isValidating={isValidating}
          onValidate={handleValidate}
        />
      </CardContent>
    </Card>
  );
};
