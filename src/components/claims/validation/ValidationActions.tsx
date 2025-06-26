
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ValidationResult } from "@/services/aiClaimsValidation";

interface ValidationActionsProps {
  validationResult: ValidationResult | null;
  isValidating: boolean;
  onValidate: () => void;
}

export const ValidationActions = ({ validationResult, isValidating, onValidate }: ValidationActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={onValidate}
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
  );
};
