
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  FileText,
  Zap,
  Eye
} from "lucide-react";
import { paymentPostingService, PaymentRecord, ReconciliationResult } from "@/services/paymentPosting";

export const PaymentPostingDashboard = () => {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState<{
    totalPayments: number;
    totalAmount: number;
    autoPostedCount: number;
    autoPostingRate: number;
    averagePostingTime: number;
    topPayers: Array<{ name: string; amount: number; count: number }>;
  } | null>(null);
  const { toast } = useToast();

  const loadPaymentData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Mock loading payment data
      const mockPayments: PaymentRecord[] = [
        {
          id: 'PAY-001',
          claimId: 'CLM-001',
          paymentDate: '2024-01-25',
          paymentAmount: 150.00,
          payerName: 'Blue Cross Blue Shield',
          checkNumber: 'CHK-12345',
          adjustments: [
            { type: 'contractual', amount: 25.00, reason: 'Fee schedule adjustment', reasonCode: 'CO-45' }
          ],
          status: 'posted',
          autoPosted: true,
          confidence: 0.95
        },
        {
          id: 'PAY-002',
          claimId: 'CLM-002',
          paymentDate: '2024-01-25',
          paymentAmount: 85.00,
          payerName: 'Aetna',
          eraNumber: 'ERA-67890',
          adjustments: [
            { type: 'deductible', amount: 40.00, reason: 'Patient deductible', reasonCode: 'PR-1' }
          ],
          status: 'pending',
          autoPosted: false,
          confidence: 0.75,
          reconciliationErrors: ['Amount discrepancy detected']
        }
      ];

      setPayments(mockPayments);

      // Load analytics
      const analyticsData = await paymentPostingService.getPaymentAnalytics({
        start: '2024-01-01',
        end: '2024-01-31'
      });
      setAnalytics(analyticsData);

    } catch (error) {
      console.error('Error loading payment data:', error);
      toast({
        title: "Error Loading Data",
        description: "Unable to load payment posting data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPaymentData();
  }, [loadPaymentData]);

  const handleERAUpload = async (file: File) => {
    try {
      setLoading(true);
      
      // Process ERA file
      const eraData = await file.text();
      const newPayments = await paymentPostingService.processERAFile(eraData);
      
      // Auto-post eligible payments
      for (const payment of newPayments) {
        const autoPosted = await paymentPostingService.autoPostPayment(payment);
        if (autoPosted) {
          payment.status = 'posted';
        }
      }

      setPayments(prev => [...prev, ...newPayments]);
      
      toast({
        title: "ERA Processed",
        description: `Processed ${newPayments.length} payments. ${newPayments.filter(p => p.status === 'posted').length} auto-posted.`,
      });

    } catch (error) {
      console.error('Error processing ERA:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process ERA file",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReconciliation = async () => {
    try {
      setLoading(true);
      const results = await paymentPostingService.reconcilePayments(payments);
      setReconciliationResults(results);
      
      toast({
        title: "Reconciliation Complete",
        description: `Reconciled ${results.length} payments. ${results.filter(r => r.matched).length} matched successfully.`,
      });

    } catch (error) {
      console.error('Error during reconciliation:', error);
      toast({
        title: "Reconciliation Failed",
        description: "Failed to reconcile payments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: "secondary" as const, icon: AlertCircle },
      posted: { variant: "default" as const, icon: CheckCircle },
      reconciled: { variant: "default" as const, icon: CheckCircle },
      disputed: { variant: "destructive" as const, icon: AlertCircle }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading payment data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Payment Posting & Reconciliation
          </h3>
          <p className="text-gray-600">
            Automated payment processing with AI-powered reconciliation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReconciliation}>
            <Zap className="w-4 h-4 mr-2" />
            Run Reconciliation
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload ERA
          </Button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.totalAmount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{analytics.totalPayments} transactions</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Auto-Posting Rate</CardTitle>
              <Zap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.autoPostingRate}%</div>
              <div className="text-xs text-muted-foreground">{analytics.autoPostedCount} of {analytics.totalPayments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Posting Time</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.averagePostingTime}h</div>
              <div className="text-xs text-muted-foreground">Processing time</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Payer</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.topPayers[0]?.amount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{analytics.topPayers[0]?.name}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="payments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="payments">Payment Queue</TabsTrigger>
          <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing Queue</CardTitle>
              <CardDescription>
                ERA payments awaiting processing and posting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment ID</TableHead>
                    <TableHead>Claim ID</TableHead>
                    <TableHead>Payer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Auto-Posted</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.claimId}</TableCell>
                      <TableCell>{payment.payerName}</TableCell>
                      <TableCell>${payment.paymentAmount.toFixed(2)}</TableCell>
                      <TableCell>{payment.paymentDate}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {payment.autoPosted ? (
                          <Badge variant="default" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Auto
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Manual</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                            {Math.round(payment.confidence * 100)}%
                          </div>
                          <div className={`w-2 h-2 rounded-full ${
                            payment.confidence >= 0.8 ? 'bg-green-500' : 
                            payment.confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reconciliation">
          <Card>
            <CardHeader>
              <CardTitle>Payment Reconciliation</CardTitle>
              <CardDescription>
                Automated reconciliation results and discrepancies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reconciliationResults.length > 0 ? (
                <div className="space-y-4">
                  {reconciliationResults.map((result, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {result.matched ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          )}
                          <span className="font-medium">
                            {result.matched ? 'Reconciled' : 'Discrepancies Found'}
                          </span>
                        </div>
                        <Badge variant={result.matched ? "default" : "destructive"}>
                          {Math.round(result.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      
                      {result.discrepancies.length > 0 && (
                        <div className="space-y-2 mt-3">
                          {result.discrepancies.map((discrepancy, discIndex) => (
                            <div key={discIndex} className="p-3 bg-red-50 rounded-md">
                              <div className="font-medium text-red-800">{discrepancy.description}</div>
                              <div className="text-sm text-red-700 mt-1">
                                Expected: ${discrepancy.expectedAmount.toFixed(2)} | 
                                Actual: ${discrepancy.actualAmount.toFixed(2)}
                              </div>
                              <div className="text-sm text-red-600 mt-1">
                                Suggested: {discrepancy.suggestedAction}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Run reconciliation to see results
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Payment trend charts would be displayed here
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Payers</CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.topPayers && (
                  <div className="space-y-3">
                    {analytics.topPayers.map((payer: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{payer.name}</div>
                          <div className="text-sm text-muted-foreground">{payer.count} payments</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${payer.amount.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
