
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DenialAnalysis } from "@/services/denialManagement";

interface DenialAnalysisModalProps {
  selectedDenial: DenialAnalysis | null;
}

export const DenialAnalysisModal = ({ selectedDenial }: DenialAnalysisModalProps) => {
  if (!selectedDenial) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Denial Analysis - {selectedDenial.claimId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Auto-Corrections Available:</h4>
            {selectedDenial.autoCorrections.map((correction, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{correction.type.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{correction.reason}</p>
                    <p className="text-sm">
                      <span className="text-red-600">{correction.originalValue}</span> → 
                      <span className="text-green-600 ml-1">{correction.correctedValue}</span>
                    </p>
                  </div>
                  <Badge variant="secondary">{correction.confidence}% confidence</Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Recommended Actions:</h4>
            {selectedDenial.recommendedActions.map((action, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{action.action.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{action.description}</p>
                    <p className="text-sm">Expected value: ${action.estimatedValue.toFixed(2)}</p>
                  </div>
                  <Badge variant={action.priority === 'high' ? 'destructive' : 'secondary'}>
                    {action.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
