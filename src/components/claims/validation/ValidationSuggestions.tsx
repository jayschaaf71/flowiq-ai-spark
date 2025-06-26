
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Zap } from "lucide-react";

interface ValidationSuggestionsProps {
  suggestions: string[];
}

export const ValidationSuggestions = ({ suggestions }: ValidationSuggestionsProps) => {
  if (suggestions.length === 0) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          No specific suggestions needed. The claim validation is complete.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2">
      {suggestions.map((suggestion, index) => (
        <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Zap className="w-4 h-4 text-blue-600" />
          <span className="text-sm">{suggestion}</span>
        </div>
      ))}
    </div>
  );
};
