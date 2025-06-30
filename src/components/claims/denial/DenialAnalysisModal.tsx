
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, TrendingUp } from "lucide-react";
import { DenialAnalysis } from "@/services/denialManagement";

interface DenialAnalysisModalProps {
  selectedDenial: DenialAnalysis | null;
}

export const DenialAnalysisModal = ({ selectedDenial }: DenialAnalysisModalProps) => {
  if (!selectedDenial) return null;

  return (
    <Dialog open={!!selectedDenial}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Denial Analysis - {selectedDenial.claimId}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Appeal Probability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Appeal Probability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {selectedDenial.appealProbability.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                Likelihood of successful appeal based on historical data
              </p>
            </CardContent>
          </Card>

          {/* Auto-Corrections */}
          {selectedDenial.autoCorrections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Auto-Correction Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDenial.autoCorrections.map((correction, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">{correction.reason}</p>
                        <p className="text-sm text-muted-foreground">
                          {correction.originalValue} → {correction.correctedValue}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {correction.confidence}% confidence
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommended Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedDenial.recommendedActions.map((action, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <p className="font-medium">{action.description}</p>
                        <Badge variant={action.priority === 'high' ? 'destructive' : 'secondary'}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Expected timeframe: {action.timeframe}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${action.estimatedValue.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Est. recovery</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
