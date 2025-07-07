import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle, Lightbulb, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationSuggestion {
  field: string;
  suggestion: string;
  action?: string;
  reason?: string;
  impact?: string;
  confidence?: number;
}

interface ValidationSuggestionsProps {
  suggestions: ValidationSuggestion[];
}

export const ValidationSuggestions = ({ suggestions }: ValidationSuggestionsProps) => {
  const { toast } = useToast();

  const applySuggestion = (suggestion: ValidationSuggestion) => {
    toast({
      title: "Suggestion Applied",
      description: `Applied suggestion: ${suggestion.action}`,
    });
  };

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-400 mb-2">
            <Lightbulb className="w-8 h-8 mx-auto" />
          </div>
          <p className="font-medium text-gray-700">No suggestions available</p>
          <p className="text-sm text-gray-600">The claim appears to be properly formatted</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            AI Recommendations ({suggestions.length})
          </CardTitle>
          <CardDescription>
            Intelligent suggestions to improve claim accuracy and approval chances
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className="border-blue-200 bg-blue-50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm text-blue-800">{suggestion.field}</p>
                      <div className="flex items-center gap-2">
                        {suggestion.confidence && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {suggestion.confidence}% confidence
                          </span>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => applySuggestion(suggestion)}
                          className="text-xs h-6"
                        >
                          Apply
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                    <AlertDescription className="text-sm text-blue-700">
                      <strong>Suggestion:</strong> {suggestion.suggestion}
                    </AlertDescription>
                    {suggestion.action && (
                      <p className="text-xs text-blue-600 mt-1">
                        <strong>Action:</strong> {suggestion.action}
                      </p>
                    )}
                    {suggestion.reason && (
                      <p className="text-xs text-blue-600 mt-1">
                        <strong>Reason:</strong> {suggestion.reason}
                      </p>
                    )}
                    {suggestion.impact && (
                      <p className="text-xs text-blue-600 mt-1">
                        <strong>Expected Impact:</strong> {suggestion.impact}
                      </p>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};