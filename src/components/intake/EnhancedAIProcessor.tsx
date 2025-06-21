
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Activity,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useIntakeForms } from '@/hooks/useIntakeForms';

interface AIInsight {
  type: 'risk' | 'priority' | 'recommendation' | 'alert';
  confidence: number;
  message: string;
  action?: string;
}

interface ProcessedSubmission {
  id: string;
  patientName: string;
  riskScore: number;
  urgencyLevel: 'low' | 'medium' | 'high' | 'urgent';
  keyFindings: string[];
  recommendations: string[];
  flaggedConcerns: string[];
  aiInsights: AIInsight[];
  processingTime: number;
  confidence: number;
}

export const EnhancedAIProcessor: React.FC = () => {
  const [processedSubmissions, setProcessedSubmissions] = useState<ProcessedSubmission[]>([]);
  const [processingStats, setProcessingStats] = useState({
    totalProcessed: 0,
    avgConfidence: 0,
    highRiskCount: 0,
    avgProcessingTime: 0
  });

  const { submissions } = useIntakeForms();

  useEffect(() => {
    // Simulate AI processing of submissions
    const processSubmissions = () => {
      const processed = submissions.slice(0, 5).map(submission => {
        const formData = submission.form_data as Record<string, any>;
        
        // Simulate AI analysis
        const riskScore = calculateRiskScore(formData);
        const urgencyLevel = determineUrgency(riskScore, formData);
        const keyFindings = extractKeyFindings(formData);
        const recommendations = generateRecommendations(formData, riskScore);
        const flaggedConcerns = identifyFlaggedConcerns(formData);
        const aiInsights = generateAIInsights(formData, riskScore);
        
        return {
          id: submission.id,
          patientName: submission.patient_name,
          riskScore,
          urgencyLevel,
          keyFindings,
          recommendations,
          flaggedConcerns,
          aiInsights,
          processingTime: Math.random() * 2 + 0.5, // 0.5-2.5 seconds
          confidence: Math.random() * 15 + 85 // 85-100%
        };
      });

      setProcessedSubmissions(processed);
      
      // Calculate stats
      setProcessingStats({
        totalProcessed: processed.length,
        avgConfidence: processed.reduce((sum, p) => sum + p.confidence, 0) / processed.length,
        highRiskCount: processed.filter(p => p.urgencyLevel === 'high' || p.urgencyLevel === 'urgent').length,
        avgProcessingTime: processed.reduce((sum, p) => sum + p.processingTime, 0) / processed.length
      });
    };

    if (submissions.length > 0) {
      processSubmissions();
    }
  }, [submissions]);

  const calculateRiskScore = (formData: Record<string, any>): number => {
    let score = 0;
    
    // Pain level assessment
    if (formData.pain_level && parseInt(formData.pain_level) >= 8) score += 30;
    else if (formData.pain_level && parseInt(formData.pain_level) >= 6) score += 20;
    
    // Age factor
    if (formData.age && parseInt(formData.age) >= 65) score += 15;
    
    // Medical history flags
    if (formData.medical_history && formData.medical_history.toLowerCase().includes('diabetes')) score += 10;
    if (formData.medical_history && formData.medical_history.toLowerCase().includes('heart')) score += 15;
    
    // Symptoms analysis
    if (formData.symptoms && Array.isArray(formData.symptoms)) {
      const urgentSymptoms = ['chest pain', 'difficulty breathing', 'severe headache'];
      const hasUrgentSymptoms = formData.symptoms.some((symptom: string) =>
        urgentSymptoms.some(urgent => symptom.toLowerCase().includes(urgent))
      );
      if (hasUrgentSymptoms) score += 40;
    }
    
    return Math.min(score, 100);
  };

  const determineUrgency = (riskScore: number, formData: Record<string, any>): 'low' | 'medium' | 'high' | 'urgent' => {
    if (riskScore >= 70) return 'urgent';
    if (riskScore >= 50) return 'high';
    if (riskScore >= 25) return 'medium';
    return 'low';
  };

  const extractKeyFindings = (formData: Record<string, any>): string[] => {
    const findings: string[] = [];
    
    if (formData.pain_level) {
      findings.push(`Pain level: ${formData.pain_level}/10`);
    }
    
    if (formData.chief_complaint) {
      findings.push(`Chief complaint: ${formData.chief_complaint.substring(0, 50)}...`);
    }
    
    if (formData.age) {
      findings.push(`Age: ${formData.age} years`);
    }
    
    return findings;
  };

  const generateRecommendations = (formData: Record<string, any>, riskScore: number): string[] => {
    const recommendations: string[] = [];
    
    if (riskScore >= 70) {
      recommendations.push('Schedule immediate consultation');
      recommendations.push('Consider urgent care referral');
    } else if (riskScore >= 50) {
      recommendations.push('Priority appointment within 24-48 hours');
      recommendations.push('Pre-screening by clinical staff');
    } else {
      recommendations.push('Standard appointment scheduling');
      recommendations.push('Routine intake processing');
    }
    
    return recommendations;
  };

  const identifyFlaggedConcerns = (formData: Record<string, any>): string[] => {
    const concerns: string[] = [];
    
    if (formData.pain_level && parseInt(formData.pain_level) >= 8) {
      concerns.push('Severe pain reported');
    }
    
    if (formData.symptoms && formData.symptoms.includes && formData.symptoms.includes('chest pain')) {
      concerns.push('Chest pain symptoms');
    }
    
    return concerns;
  };

  const generateAIInsights = (formData: Record<string, any>, riskScore: number): AIInsight[] => {
    const insights: AIInsight[] = [];
    
    if (riskScore >= 70) {
      insights.push({
        type: 'alert',
        confidence: 95,
        message: 'High-risk patient requiring immediate attention',
        action: 'escalate_immediately'
      });
    }
    
    if (formData.age && parseInt(formData.age) >= 65) {
      insights.push({
        type: 'recommendation',
        confidence: 88,
        message: 'Senior patient - consider comprehensive health assessment',
        action: 'schedule_extended_visit'
      });
    }
    
    return insights;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'text-red-700 bg-red-100';
      case 'high': return 'text-orange-700 bg-orange-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Processing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed Today</p>
                <p className="text-2xl font-bold text-blue-600">{processingStats.totalProcessed}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
                <p className="text-2xl font-bold text-green-600">{processingStats.avgConfidence.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Cases</p>
                <p className="text-2xl font-bold text-red-600">{processingStats.highRiskCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Process Time</p>
                <p className="text-2xl font-bold text-purple-600">{processingStats.avgProcessingTime.toFixed(1)}s</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processed Submissions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Processing Results
        </h3>
        
        {processedSubmissions.map((submission) => (
          <Card key={submission.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{submission.patientName}</CardTitle>
                  <CardDescription>
                    Processed in {submission.processingTime.toFixed(1)}s • {submission.confidence.toFixed(1)}% confidence
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getUrgencyColor(submission.urgencyLevel)}>
                    {submission.urgencyLevel.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">Risk Score: {submission.riskScore}/100</div>
                    <Progress value={submission.riskScore} className="w-20 h-2" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Key Findings */}
              <div>
                <h4 className="font-medium text-sm mb-2">Key Findings</h4>
                <div className="space-y-1">
                  {submission.keyFindings.map((finding, idx) => (
                    <div key={idx} className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                      {finding}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flagged Concerns */}
              {submission.flaggedConcerns.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    Flagged Concerns
                  </h4>
                  <div className="space-y-1">
                    {submission.flaggedConcerns.map((concern, idx) => (
                      <Alert key={idx} className="border-red-200 bg-red-50">
                        <AlertDescription className="text-red-800">
                          {concern}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendations */}
              <div>
                <h4 className="font-medium text-sm mb-2">AI Recommendations</h4>
                <div className="space-y-1">
                  {submission.recommendations.map((rec, idx) => (
                    <div key={idx} className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded">
                      • {rec}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve Analysis
                </Button>
                <Button size="sm" variant="outline">
                  <Users className="w-3 h-3 mr-1" />
                  Assign to Provider
                </Button>
                <Button size="sm" variant="outline">
                  <Clock className="w-3 h-3 mr-1" />
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
