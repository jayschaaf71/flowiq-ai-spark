
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
        patientInfo: {
          id: claimData.patients.id,
          firstName: claimData.patients.first_name,
          lastName: claimData.patients.last_name,
          dateOfBirth: claimData.patients.date_of_birth || '1990-01-01',
          insuranceInfo: {
            provider: claimData.insurance_providers.name,
            policyNumber: 'POL123456', // Mock data
            groupNumber: 'GRP789'
          }
        },
        providerInfo: {
          id: claimData.providers.id,
          firstName: claimData.providers.first_name,
          lastName: claimData.providers.last_name,
          npi: claimData.providers.npi,
          specialty: 'Family Medicine'
        },
        insuranceInfo: {
          name: claimData.insurance_providers.name,
          id: claimData.insurance_providers.id
        },
        serviceDate: claimData.service_date,
        billingCodes: [
          { code: 'CPT-99213', codeType: 'CPT', description: 'Office visit', amount: 150 }
        ],
        totalAmount: claimData.total_amount,
        diagnosis: 'Essential hypertension'
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
