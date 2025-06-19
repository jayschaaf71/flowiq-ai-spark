
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";

interface ProcessedSubmission {
  id: string;
  patientName: string;
  submittedAt: string;
  aiSummary: string;
  riskLevel: "low" | "medium" | "high";
  completionScore: number;
  flaggedItems: string[];
  recommendations: string[];
  processingTime: number;
}

export const IntakeAIProcessor = () => {
  const [activeTab, setActiveTab] = useState("processing");
  const [processedSubmissions, setProcessedSubmissions] = useState<ProcessedSubmission[]>([]);

  useEffect(() => {
    // Mock processed submissions
    setProcessedSubmissions([
      {
        id: "1",
        patientName: "Sarah Wilson",
        submittedAt: "2 minutes ago",
        aiSummary: "33-year-old female presenting with chronic lower back pain (7/10) following lifting incident 3 weeks ago. No previous chiropractic treatment. Pain worsens with sitting, improves with movement. Denies numbness or weakness.",
        riskLevel: "medium",
        completionScore: 95,
        flaggedItems: ["High pain level (7/10)", "Mechanism of injury"],
        recommendations: [
          "Schedule initial consultation within 48 hours",
          "Consider X-ray evaluation",
          "Assess for red flag symptoms"
        ],
        processingTime: 1.2
      },
      {
        id: "2",
        patientName: "Mike Johnson",
        submittedAt: "15 minutes ago",
        aiSummary: "45-year-old male for routine dental cleaning. Last cleaning 8 months ago. Reports occasional sensitivity to cold. Good oral hygiene habits. No current pain or concerns.",
        riskLevel: "low",
        completionScore: 88,
        flaggedItems: [],
        recommendations: [
          "Standard cleaning appointment",
          "Fluoride treatment recommended",
          "Schedule 6-month follow-up"
        ],
        processingTime: 0.8
      }
    ]);
  }, []);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const processingStats = {
    todayProcessed: 24,
    avgProcessingTime: 1.1,
    accuracyRate: 97.5,
    flaggedForReview: 3
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Processed Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {processingStats.todayProcessed}
            </div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Processing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {processingStats.avgProcessingTime}s
            </div>
            <p className="text-xs text-muted-foreground">-0.3s improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Accuracy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {processingStats.accuracyRate}%
            </div>
            <p className="text-xs text-muted-foreground">Excellent performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Flagged for Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {processingStats.flaggedForReview}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="processing">Real-time Processing</TabsTrigger>
          <TabsTrigger value="summaries">AI Summaries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                AI Processing Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium">Form Validation</span>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="font-medium">Content Analysis</span>
                  </div>
                  <Badge variant="secondary">Processing</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span className="font-medium">Risk Assessment</span>
                  </div>
                  <Badge variant="outline">Queued</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    <span className="font-medium">Summary Generation</span>
                  </div>
                  <Badge variant="outline">Waiting</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summaries" className="space-y-4">
          {processedSubmissions.map((submission) => (
            <Card key={submission.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{submission.patientName}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Submitted {submission.submittedAt} • Processed in {submission.processingTime}s
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getRiskColor(submission.riskLevel)}>
                      {submission.riskLevel} risk
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">{submission.completionScore}%</div>
                      <Progress value={submission.completionScore} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    AI Summary
                  </h4>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">
                    {submission.aiSummary}
                  </p>
                </div>

                {submission.flaggedItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      Flagged Items
                    </h4>
                    <div className="space-y-1">
                      {submission.flaggedItems.map((item, idx) => (
                        <div key={idx} className="text-sm bg-orange-50 text-orange-800 px-2 py-1 rounded">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Recommendations
                  </h4>
                  <div className="space-y-1">
                    {submission.recommendations.map((rec, idx) => (
                      <div key={idx} className="text-sm bg-green-50 text-green-800 px-2 py-1 rounded">
                        • {rec}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="w-3 h-3 mr-1" />
                    Review
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium">156 processed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Week</span>
                    <span className="font-medium">132 processed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600">Growth</span>
                    <span className="font-medium text-green-600">+18.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-700">Low Risk</Badge>
                    <span className="text-sm">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>
                    <span className="text-sm">28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-100 text-red-700">High Risk</Badge>
                    <span className="text-sm">4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
