import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Clock } from "lucide-react";

interface ValidationRunButtonProps {
  isValidating: boolean;
  onValidate: () => void;
}

export const ValidationRunButton = ({ isValidating, onValidate }: ValidationRunButtonProps) => {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Brain className="w-6 h-6 text-purple-600" />
          AI Claims Validation
        </CardTitle>
        <CardDescription>
          Run comprehensive AI analysis to validate claim accuracy and identify potential issues
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>AI-Powered</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span>Real-time</span>
          </div>
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <span>Intelligent</span>
          </div>
        </div>
        
        <Button
          onClick={onValidate}
          disabled={isValidating}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isValidating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Running AI Validation...
            </>
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Start AI Validation
            </>
          )}
        </Button>
        
        {isValidating && (
          <p className="text-xs text-gray-500">
            AI is analyzing claim data for billing accuracy, compliance, and denial risk...
          </p>
        )}
      </CardContent>
    </Card>
  );
};