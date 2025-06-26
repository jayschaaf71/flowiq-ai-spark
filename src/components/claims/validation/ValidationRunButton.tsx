
import { Button } from "@/components/ui/button";
import { Loader2, Zap } from "lucide-react";

interface ValidationRunButtonProps {
  isValidating: boolean;
  onValidate: () => void;
}

export const ValidationRunButton = ({ isValidating, onValidate }: ValidationRunButtonProps) => {
  return (
    <div className="text-center py-6">
      <Button 
        onClick={onValidate} 
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
  );
};
