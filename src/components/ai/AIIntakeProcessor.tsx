import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Brain, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User,
  Stethoscope,
  TrendingUp,
  Eye,
  RefreshCw
} from 'lucide-react';

interface ProcessedIntake {
  id: string;
  patientName: string;
  submittedAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  aiAnalysis: {
    riskLevel: 'low' | 'medium' | 'high';
    keyFindings: string[];
    suggestedActions: string[];
    confidence: number;
    flaggedIssues: string[];
  };
  extractedData: {
    demographics: Record<string, unknown>;
    medicalHistory: Record<string, unknown>;
    symptoms: Record<string, unknown>;
    medications: Record<string, unknown>;
  };
  processingTime: number;
}

export const AIIntakeProcessor = () => {
  const [submissions, setSubmissions] = useState<ProcessedIntake[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ProcessedIntake | null>(null);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    averageProcessingTime: 0,
    highRiskCount: 0,
    accuracyRate: 0
  });
  const { toast } = useToast();

  const loadSubmissions = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('intake_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Simulate AI analysis data (in real app, this would come from the AI processing)
      const processedData: ProcessedIntake[] = data?.map(submission => {
        const submissionData = submission.submission_data as Record<string, unknown>;
        return {
          id: submission.id,
          patientName: (submissionData?.personalInfo as { name?: string })?.name || (submissionData?.name as string) || 'Unknown Patient',
          submittedAt: new Date(submission.created_at),
          status: submission.ai_summary ? 'completed' as const : 'pending' as const,
          aiAnalysis: {
            riskLevel: (Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low') as 'low' | 'medium' | 'high',
            keyFindings: [
              'Chronic lower back pain for 6+ months',
              'Previous injury history noted',
              'Limited range of motion reported'
            ],
            suggestedActions: [
              'Schedule comprehensive evaluation',
              'Consider imaging studies',
              'Review medication interactions'
            ],
            confidence: Math.round((Math.random() * 30 + 70)),
            flaggedIssues: Math.random() > 0.8 ? ['Medication allergy conflict', 'High pain score'] : []
          },
          extractedData: {
            demographics: (submissionData?.personalInfo as Record<string, unknown>) || {},
            medicalHistory: (submissionData?.medicalHistory as Record<string, unknown>) || {},
            symptoms: (submissionData?.symptoms as Record<string, unknown>) || {},
            medications: (submissionData?.medications as Record<string, unknown>) || {}
          },
          processingTime: Math.round(Math.random() * 30 + 10)
        };
      }) || [];

      setSubmissions(processedData);
    } catch (error) {
      console.error('Error loading submissions:', error);
      toast({
        title: "Error",
        description: "Failed to load intake submissions",
        variant: "destructive",
      });
    }
  }, [toast]);

  const loadStats = useCallback(() => {
    // Simulate analytics data
    setStats({
      totalProcessed: 147,
      averageProcessingTime: 18.5,
      highRiskCount: 12,
      accuracyRate: 94.2
    });
  }, []);

  useEffect(() => {
    loadSubmissions();
    loadStats();
  }, [loadSubmissions, loadStats]);

  const processSubmission = async (submissionId: string) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-form-processor', {
        body: {
          submissionId,
          options: {
            enableRiskAssessment: true,
            extractMedicalTerms: true,
            generateSummary: true,
            flagCriticalIssues: true
          }
        }
      });

      if (error) throw error;

      // Update the submission with AI analysis
      setSubmissions(prev => prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: 'completed', aiAnalysis: data.analysis }
          : sub
      ));

      toast({
        title: "AI Processing Complete",
        description: "Form has been analyzed and processed successfully",
      });

    } catch (error: unknown) {
      console.error('AI processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process intake form with AI",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'processing': return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcessed}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageProcessingTime}s</div>
            <p className="text-xs text-muted-foreground">-3s from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highRiskCount}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">AI Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.accuracyRate}%</div>
            <Progress value={stats.accuracyRate} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submissions List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Submissions
            </CardTitle>
            <CardDescription>
              AI-processed intake forms with analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(submission.status)}
                    <div>
                      <p className="font-medium text-sm">{submission.patientName}</p>
                      <p className="text-xs text-gray-600">
                        {submission.submittedAt.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(submission.aiAnalysis.riskLevel)}>
                      {submission.aiAnalysis.riskLevel} risk
                    </Badge>
                    {submission.aiAnalysis.flaggedIssues.length > 0 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedSubmission ? (
              <Tabs defaultValue="analysis">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="extracted">Data</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="analysis" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Risk Assessment</span>
                      <Badge className={getRiskColor(selectedSubmission.aiAnalysis.riskLevel)}>
                        {selectedSubmission.aiAnalysis.riskLevel} risk
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">AI Confidence</span>
                      <span className="text-sm">{selectedSubmission.aiAnalysis.confidence}%</span>
                    </div>
                    <Progress value={selectedSubmission.aiAnalysis.confidence} className="h-2" />
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Findings</h4>
                    <ul className="space-y-1">
                      {selectedSubmission.aiAnalysis.keyFindings.map((finding, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedSubmission.aiAnalysis.flaggedIssues.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 text-red-600">Flagged Issues</h4>
                      <ul className="space-y-1">
                        {selectedSubmission.aiAnalysis.flaggedIssues.map((issue, index) => (
                          <li key={index} className="text-xs text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="extracted" className="space-y-4">
                  <div className="text-sm space-y-2">
                    <div>
                      <span className="font-medium">Demographics: </span>
                      <span className="text-gray-600">Extracted and validated</span>
                    </div>
                    <div>
                      <span className="font-medium">Medical History: </span>
                      <span className="text-gray-600">12 conditions identified</span>
                    </div>
                    <div>
                      <span className="font-medium">Current Symptoms: </span>
                      <span className="text-gray-600">Pain scale 7/10, location mapped</span>
                    </div>
                    <div>
                      <span className="font-medium">Medications: </span>
                      <span className="text-gray-600">5 medications, interactions checked</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Suggested Actions</h4>
                    <ul className="space-y-2">
                      {selectedSubmission.aiAnalysis.suggestedActions.map((action, index) => (
                        <li key={index} className="text-xs flex items-center gap-2">
                          <Button size="sm" variant="outline" className="h-6 text-xs">
                            Execute
                          </Button>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      className="w-full" 
                      onClick={() => processSubmission(selectedSubmission.id)}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Reprocessing...' : 'Reprocess with AI'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a submission to view AI analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};