import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  XCircle, 
  AlertTriangle, 
  Bot,
  RefreshCw,
  FileText,
  Clock,
  CheckCircle,
  TrendingDown,
  Lightbulb,
  Send,
  Eye,
  Zap
} from 'lucide-react';

interface Denial {
  id: string;
  claimNumber: string;
  patientName: string;
  payer: string;
  amount: number;
  denialDate: string;
  denialCode: string;
  denialReason: string;
  category: 'coding' | 'authorization' | 'documentation' | 'eligibility' | 'billing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  aiRecommendation: string;
  autoFixAvailable: boolean;
  appealDeadline: string;
  daysToDeadline: number;
  appealStatus: 'not_started' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
}

export const AutomatedDenialManagement: React.FC = () => {
  const [denials] = useState<Denial[]>([
    {
      id: '1',
      claimNumber: 'CLM-2024-003',
      patientName: 'Emily Davis',
      payer: 'Cigna',
      amount: 680.00,
      denialDate: '2024-01-20',
      denialCode: 'N130',
      denialReason: 'Prior authorization required',
      category: 'authorization',
      severity: 'high',
      aiRecommendation: 'Submit prior authorization request with attached clinical documentation. Include diagnosis codes Z87.891 and treatment protocol.',
      autoFixAvailable: true,
      appealDeadline: '2024-02-19',
      daysToDeadline: 28,
      appealStatus: 'not_started'
    },
    {
      id: '2',
      claimNumber: 'CLM-2024-004',
      patientName: 'Robert Wilson',
      payer: 'Blue Cross Blue Shield',
      amount: 340.00,
      denialDate: '2024-01-19',
      denialCode: 'N282',
      denialReason: 'Incorrect procedure code',
      category: 'coding',
      severity: 'medium',
      aiRecommendation: 'Update procedure code from 99213 to 99214 based on documentation complexity. Resubmit claim.',
      autoFixAvailable: true,
      appealDeadline: '2024-02-18',
      daysToDeadline: 27,
      appealStatus: 'in_progress'
    },
    {
      id: '3',
      claimNumber: 'CLM-2024-005',
      patientName: 'Lisa Chen',
      payer: 'Aetna',
      amount: 125.00,
      denialDate: '2024-01-18',
      denialCode: 'N424',
      denialReason: 'Missing supporting documentation',
      category: 'documentation',
      severity: 'medium',
      aiRecommendation: 'Attach patient intake form and treatment notes. Documentation shows medical necessity for services rendered.',
      autoFixAvailable: false,
      appealDeadline: '2024-02-17',
      daysToDeadline: 26,
      appealStatus: 'not_started'
    }
  ]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coding': return <FileText className="h-4 w-4" />;
      case 'authorization': return <AlertTriangle className="h-4 w-4" />;
      case 'documentation': return <FileText className="h-4 w-4" />;
      case 'eligibility': return <CheckCircle className="h-4 w-4" />;
      case 'billing': return <XCircle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getAppealStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeadlineColor = (days: number) => {
    if (days <= 7) return 'text-red-600';
    if (days <= 14) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <XCircle className="h-8 w-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold">Automated Denial Management</h2>
            <p className="text-gray-600">AI-powered denial analysis and appeal automation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Bot className="h-4 w-4 mr-2" />
            Run AI Analysis
          </Button>
        </div>
      </div>

      {/* Denial Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">23</div>
              <div className="text-sm text-gray-600">Active Denials</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-gray-600">Auto-Fixable</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">$12,450</div>
              <div className="text-sm text-gray-600">Total Denied Amount</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">Appeal Success Rate</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">2.8%</div>
              <div className="text-sm text-gray-600">Overall Denial Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Automated analysis of denial patterns and optimization suggestions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h3 className="font-medium">Top Denial Reason</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Prior authorization requirements</p>
              <div className="text-2xl font-bold text-red-600">35%</div>
              <p className="text-xs text-gray-500">of all denials this month</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
                <h3 className="font-medium">Quick Fix Available</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Coding errors can be auto-corrected</p>
              <div className="text-2xl font-bold text-green-600">78%</div>
              <p className="text-xs text-gray-500">of denials have automated solutions</p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium">Average Resolution</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Time to resolve appeals</p>
              <div className="text-2xl font-bold text-blue-600">4.2</div>
              <p className="text-xs text-gray-500">days with AI assistance</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Denials */}
      <Card>
        <CardHeader>
          <CardTitle>Active Denial Cases</CardTitle>
          <CardDescription>
            Claims requiring attention with AI-powered recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {denials.map((denial) => (
              <div key={denial.id} className="border rounded-lg p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-red-100 rounded-lg">
                      {getCategoryIcon(denial.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{denial.claimNumber}</span>
                        <Badge className={getSeverityColor(denial.severity)}>
                          {denial.severity} priority
                        </Badge>
                        <Badge className={getAppealStatusColor(denial.appealStatus)}>
                          {denial.appealStatus.replace('_', ' ')}
                        </Badge>
                        {denial.autoFixAvailable && (
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-fixable
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm text-gray-600">Patient: {denial.patientName}</div>
                          <div className="text-sm text-gray-600">Payer: {denial.payer}</div>
                          <div className="text-sm text-gray-600">Amount: ${denial.amount.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Denial Code: {denial.denialCode}</div>
                          <div className="text-sm text-gray-600">Category: {denial.category}</div>
                          <div className="text-sm">
                            Deadline: <span className={getDeadlineColor(denial.daysToDeadline)}>
                              {denial.daysToDeadline} days remaining
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm font-medium mb-1">Denial Reason:</div>
                        <div className="text-sm text-gray-700 bg-red-50 p-2 rounded">
                          {denial.denialReason}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {denial.autoFixAvailable && (
                      <Button variant="outline" size="sm" className="w-full">
                        <Zap className="h-4 w-4 mr-2" />
                        Auto-Fix
                      </Button>
                    )}
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="border-t pt-4">
                  <div className="flex items-start gap-3">
                    <Bot className="h-5 w-5 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-2">AI Recommendation:</div>
                      <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded mb-3">
                        {denial.aiRecommendation}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Start Appeal
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Letter
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Resubmit Claim
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Appeal Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Appeal Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Success Rate (90 days)</span>
                  <span>89.2%</span>
                </div>
                <Progress value={89.2} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">67</div>
                  <div className="text-sm text-gray-600">Successful Appeals</div>
                </div>
                
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">4.2</div>
                  <div className="text-sm text-gray-600">Avg Days to Resolve</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automation Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Auto-Resolution Rate</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Time Saved per Case</span>
                <span className="font-medium">2.3 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Revenue Recovered</span>
                <span className="font-medium">$89,450</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Cases Processed Today</span>
                <span className="font-medium">23</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};