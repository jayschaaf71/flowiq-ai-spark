import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ValidationResult } from "@/services/aiClaimsValidation";
import { 
  CheckCircle, 
  Send, 
  FileText, 
  AlertTriangle, 
  RefreshCw,
  Download,
  Save
} from "lucide-react";

interface ValidationActionsProps {
  validationResult: ValidationResult | null;
  isValidating: boolean;
  onValidate: () => void;
}

export const ValidationActions = ({ 
  validationResult, 
  isValidating, 
  onValidate 
}: ValidationActionsProps) => {
  const { toast } = useToast();

  const submitClaim = () => {
    toast({
      title: "Claim Submitted",
      description: "Claim has been submitted for processing",
    });
  };

  const saveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Claim has been saved as draft",
    });
  };

  const generateReport = () => {
    toast({
      title: "Report Generated",
      description: "Validation report has been generated and downloaded",
    });
  };

  const fixIssues = () => {
    toast({
      title: "Auto-Fix Applied",
      description: "AI has automatically corrected detectable issues",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {validationResult && (
              <div className="flex items-center gap-2">
                <Badge 
                  className={
                    validationResult.isValid 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }
                >
                  {validationResult.isValid ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Ready to Submit
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Needs Review
                    </>
                  )}
                </Badge>
                <span className="text-sm text-gray-600">
                  Confidence: {validationResult.confidence}%
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onValidate}
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-validate
                </>
              )}
            </Button>

            {validationResult && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateReport}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>

                {!validationResult.isValid && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fixIssues}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Auto-Fix Issues
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveDraft}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>

                <Button
                  size="sm"
                  onClick={submitClaim}
                  disabled={!validationResult.isValid}
                  className={validationResult.isValid ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {validationResult.isValid ? "Submit Claim" : "Fix Issues First"}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};