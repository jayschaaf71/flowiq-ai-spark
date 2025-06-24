
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { denialManagementService, DenialAnalysis, AutoCorrection } from "@/services/denialManagement";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Zap,
  FileX,
  RefreshCw,
  DollarSign,
  Target
} from "lucide-react";

export const EnhancedDenialManagement = () => {
  const [denialAnalytics, setDenialAnalytics] = useState<any>(null);
  const [selectedDenial, setSelectedDenial] = useState<DenialAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDenialData();
  }, []);

  const loadDenialData = async () => {
    try {
      const dateRange = {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      };
      
      const analytics = await denialManagementService.getDenialAnalytics(dateRange);
      setDenialAnalytics(analytics);
    } catch (error) {
      console.error('Error loading denial data:', error);
      toast({
        title: "Error Loading Data",
        description: "Unable to load denial analytics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCorrect = async (claimId: string, corrections: AutoCorrection[]) => {
    setIsProcessing(true);
    try {
      const success = await denialManagementService.applyAutoCorrections(claimId, corrections);
      
      if (success) {
        toast({
          title: "Auto-Correction Applied",
          description: `${corrections.length} corrections applied to claim ${claimId}`,
        });
        loadDenialData(); // Refresh data
      } else {
        throw new Error('Auto-correction failed');
      }
    } catch (error) {
      toast({
        title: "Auto-Correction Failed",
        description: "Unable to apply corrections. Please try manual review.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeDenial = async (claimId: string) => {
    try {
      // Mock denial reasons - in production this would come from the actual denial
      const mockDenialReasons = ['CO-97', 'CO-16'];
      const analysis = await denialManagementService.analyzeDenial(claimId, mockDenialReasons);
      setSelectedDenial(analysis);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze denial",
        variant: "destructive"
      });
    }
  };

  const mockDenials = [
    {
      id: 'CLM-2024-001',
      patientName: 'John Smith',
      denialDate: '2024-01-15',
      amount: 350.00,
      reason: 'CO-97: Invalid provider identifier',
      status: 'pending_review',
      autoCorrectible: true,
      confidence: 92
    },
    {
      id: 'CLM-2024-002',
      patientName: 'Sarah Johnson',
      denialDate: '2024-01-14',
      amount: 275.50,
      reason: 'CO-16: Claim lacks information',
      status: 'auto_corrected',
      autoCorrectible: true,
      confidence: 87
    },
    {
      id: 'CLM-2024-003',
      patientName: 'Mike Wilson',
      denialDate: '2024-01-13',
      amount: 450.00,
      reason: 'CO-24: Charges exceed fee schedule',
      status: 'appeal_recommended',
      autoCorrectible: false,
      confidence: 0
    }
  ];

  if (loading) {
    return <div className="flex justify-center p-8">Loading denial analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            Enhanced Denial Management
          </h3>
          <p className="text-gray-600">
            AI-powered denial analysis with automated correction workflows
          </p>
        </div>
        <Button variant="outline" onClick={loadDenialData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileX className="w-4 h-4 text-red-600" />
              Total Denials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denialAnalytics?.totalDenials || 0}</div>
            <div className="text-xs text-muted-foreground">Last 30 days</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-red-600" />
              Denied Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${denialAnalytics?.totalDeniedAmount?.toLocaleString() || '0'}
            </div>
            <div className="text-xs text-muted-foreground">Total denied value</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Auto-Correctable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denialAnalytics?.autoCorrectible || 0}</div>
            <div className="text-xs text-muted-foreground">
              {denialAnalytics?.totalDenials > 0 
                ? Math.round((denialAnalytics.autoCorrectible / denialAnalytics.totalDenials) * 100)
                : 0}% of denials
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denialAnalytics?.autoCorrectRate?.toFixed(1) || '0'}%</div>
            <div className="text-xs text-muted-foreground">Auto-correction success</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="queue">Denial Queue</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="queue">
          <Card>
            <CardHeader>
              <CardTitle>Denial Processing Queue</CardTitle>
              <CardDescription>
                Claims requiring attention with AI-powered correction suggestions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Denial Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Auto-Correct</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDenials.map((denial) => (
                    <TableRow key={denial.id}>
                      <TableCell className="font-medium">{denial.id}</TableCell>
                      <TableCell>{denial.patientName}</TableCell>
                      <TableCell>${denial.amount.toFixed(2)}</TableCell>
                      <TableCell className="max-w-xs truncate">{denial.reason}</TableCell>
                      <TableCell>
                        <Badge variant={
                          denial.status === 'auto_corrected' ? 'default' :
                          denial.status === 'appeal_recommended' ? 'secondary' : 'destructive'
                        }>
                          {denial.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {denial.autoCorrectible ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{denial.confidence}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-500">Manual</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {denial.autoCorrectible && denial.status === 'pending_review' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleAutoCorrect(denial.id, [])}
                              disabled={isProcessing}
                            >
                              <Zap className="w-3 h-3 mr-1" />
                              Auto-Fix
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => analyzeDenial(denial.id)}
                          >
                            Analyze
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Denial Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {denialAnalytics?.trends?.map((trend: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{trend.month}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{trend.count} denials</span>
                        <span className="text-sm text-muted-foreground">
                          ${trend.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Denial Reasons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {denialAnalytics?.denialsByReason?.slice(0, 5).map((item: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{item.reason}</span>
                        <span className="font-medium">{item.count} claims</span>
                      </div>
                      <Progress value={(item.count / (denialAnalytics.totalDenials || 1)) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Denial Patterns & Auto-Correction Rules</CardTitle>
              <CardDescription>
                AI-identified patterns with automated correction capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>92% of CO-97 denials</strong> can be auto-corrected by updating provider NPI numbers
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>87% of CO-16 denials</strong> can be resolved by adding missing diagnosis codes
                  </AlertDescription>
                </Alert>
                
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>CO-24 fee schedule denials</strong> require manual review and potential appeals
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Denial Analysis Modal */}
      {selectedDenial && (
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
      )}
    </div>
  );
};
