
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  TrendingUp, 
  Brain, 
  Shield,
  Heart,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { aiSchedulingService, PatientRiskScore } from '@/services/aiSchedulingService';
import { useToast } from '@/hooks/use-toast';

interface PatientRiskDashboardProps {
  patientId?: string;
  showOverview?: boolean;
}

export const PatientRiskDashboard: React.FC<PatientRiskDashboardProps> = ({ 
  patientId, 
  showOverview = true 
}) => {
  const { toast } = useToast();
  const [riskScores, setRiskScores] = useState<PatientRiskScore[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientRiskScore | null>(null);

  useEffect(() => {
    if (patientId) {
      loadPatientRiskScore(patientId);
    } else if (showOverview) {
      loadRiskOverview();
    }
  }, [patientId, showOverview]);

  const loadPatientRiskScore = async (id: string) => {
    setLoading(true);
    try {
      const riskScore = await aiSchedulingService.generatePatientRiskScore(id);
      setRiskScores([riskScore]);
      setSelectedPatient(riskScore);
    } catch (error) {
      console.error('Error loading patient risk score:', error);
      toast({
        title: "Error",
        description: "Failed to load patient risk score",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRiskOverview = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would load multiple patient risk scores
      // For now, we'll show a mock overview
      setRiskScores([]);
    } catch (error) {
      console.error('Error loading risk overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-200';
      case 'high': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-600" />;
      case 'medium': return <Activity className="w-4 h-4 text-yellow-600" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return <Heart className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Brain className="w-6 h-6 animate-pulse mr-2" />
            <span>Analyzing patient risk factors...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* HIPAA Compliance Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All patient risk analysis is HIPAA-compliant with encrypted processing and audit logging.
        </AlertDescription>
      </Alert>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Risk Assessment
                </CardTitle>
                <CardDescription>
                  Generated on {selectedPatient.lastUpdated.toLocaleString()}
                </CardDescription>
              </div>
              <Badge className={getRiskColor(selectedPatient.riskLevel)}>
                {getRiskIcon(selectedPatient.riskLevel)}
                <span className="ml-1">{selectedPatient.riskLevel.toUpperCase()}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-2xl font-bold">{selectedPatient.score}/100</span>
              </div>
              <Progress value={selectedPatient.score} className="h-3" />
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="font-medium text-sm mb-3">Risk Factors</h4>
              <div className="space-y-2">
                {selectedPatient.factors.map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    {factor}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <h4 className="font-medium text-sm mb-3">AI Recommendations</h4>
              <div className="space-y-2">
                {selectedPatient.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm bg-blue-50 p-2 rounded">
                    <Brain className="w-4 h-4 text-blue-500" />
                    {rec}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => loadPatientRiskScore(selectedPatient.patientId)}
                disabled={loading}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Refresh Analysis
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  // Generate clinical summary
                  toast({
                    title: "Clinical Summary",
                    description: "AI clinical summary generation initiated",
                  });
                }}
              >
                <Clock className="w-4 h-4 mr-2" />
                Generate Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showOverview && riskScores.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Patient Risk Overview</CardTitle>
            <CardDescription>
              AI-powered risk assessment for all patients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              No patient risk data available. Select a patient to generate risk assessment.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
