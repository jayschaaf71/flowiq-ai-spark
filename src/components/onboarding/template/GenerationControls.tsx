
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  CheckCircle2,
  Download,
  Eye
} from "lucide-react";

interface GenerationControlsProps {
  selectedTemplatesCount: number;
  generationProgress: number;
  onGenerateTemplates: () => void;
  primaryColor: string;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  selectedTemplatesCount,
  generationProgress,
  onGenerateTemplates,
  primaryColor
}) => {
  const isGenerating = generationProgress > 0 && generationProgress < 100;
  const hasGenerated = generationProgress === 100;

  if (selectedTemplatesCount === 0) return null;

  return (
    <Card>
      <CardContent className="pt-6">
        {!isGenerating && !hasGenerated && (
          <div className="text-center">
            <Button 
              onClick={onGenerateTemplates}
              className="w-full"
              style={{ backgroundColor: primaryColor }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate {selectedTemplatesCount} Template Set(s)
            </Button>
            <p className="text-sm text-gray-600 mt-2">
              This will take approximately 3-5 minutes
            </p>
          </div>
        )}

        {isGenerating && (
          <div className="space-y-4">
            <div className="text-center">
              <h4 className="font-medium mb-2">Generating Templates...</h4>
              <Progress value={generationProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                {generationProgress}% complete
              </p>
            </div>
          </div>
        )}

        {hasGenerated && (
          <div className="space-y-4">
            <div className="text-center text-green-600">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
              <h4 className="font-medium">Templates Generated Successfully!</h4>
            </div>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Preview Templates
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Templates
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
