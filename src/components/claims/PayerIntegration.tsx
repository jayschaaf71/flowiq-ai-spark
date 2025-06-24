
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { usePayerConnections, useConnectionTest, useBatchClaimSubmission } from "@/hooks/usePayerIntegration";
import { 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw,
  Zap
} from "lucide-react";

interface ClaimSubmission {
  id: string;
  claimNumber: string;
  payerName: string;
  amount: number;
  status: 'pending' | 'submitted' | 'acknowledged' | 'processed' | 'paid' | 'denied';
  submittedAt: string;
  responseTime?: number;
}

export const PayerIntegration = () => {
  const { data: payers = [], isLoading } = usePayerConnections();
  const connectionTest = useConnectionTest();
  const batchSubmission = useBatchClaimSubmission();
  const { toast } = useToast();

  const [recentSubmissions] = useState<ClaimSubmission[]>([
    {
      id: '1',
      claimNumber: 'CLM-2024-001',
      payerName: 'Blue Cross Blue Shield',
      amount: 350.00,
      status: 'processed',
      submittedAt: '2024-01-15T08:30:00Z',
      responseTime: 2.1
    },
    {
      id: '2',
      claimNumber: 'CLM-2024-002',
      payerName: 'Aetna',
      amount: 275.50,
      status: 'acknowledged',
      submittedAt: '2024-01-15T09:45:00Z',
      responseTime: 1.8
    },
    {
      id: '3',
      claimNumber: 'CLM-2024-003',
      payerName: 'Cigna',
      amount: 450.00,
      status: 'pending',
      submittedAt: '2024-01-15T10:15:00Z'
    }
  ]);

  const getStatusIcon = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? <Wifi className="w-4 h-4 text-green-600" /> : <WifiOff className="w-4 h-4 text-red-600" />;
    }
    
    switch (status) {
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return <Badge variant={status ? "default" : "destructive"}>{status ? 'Connected' : 'Disconnected'}</Badge>;
    }
    
    const variants = {
      connected: "default",
      disconnected: "destructive",
      testing: "secondary",
      pending: "outline",
      submitted: "secondary",
      acknowledged: "default",
      processed: "default",
      paid: "default",
      denied: "destructive"
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || "outline"}>{status}</Badge>;
  };

  const testConnection = async (payerId: string) => {
    connectionTest.mutate(payerId);
  };

  const submitClaimsToPayer = async (payerId: string) => {
    // Mock implementation - in production this would select actual claims
    const mockRequests = [
      { claimId: 'claim-1', payerConnectionId: payerId },
      { claimId: 'claim-2', payerConnectionId: payerId }
    ];

    batchSubmission.mutate(mockRequests);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading payer connections...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            Payer Integration Hub
          </h3>
          <p className="text-gray-600">
            Direct electronic claim submission and real-time status tracking
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Payers
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Payer Configuration</DialogTitle>
              <DialogDescription>
                Set up and manage your payer connections for electronic claim submission
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="payer-name">Payer Name</Label>
                  <Input id="payer-name" placeholder="Enter payer name" />
                </div>
                <div>
                  <Label htmlFor="payer-id">Payer ID</Label>
                  <Input id="payer-id" placeholder="Electronic payer ID" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="connection-type">Connection Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edi">EDI X12</SelectItem>
                      <SelectItem value="api">REST API</SelectItem>
                      <SelectItem value="ftp">Secure FTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="endpoint">Endpoint URL</Label>
                  <Input id="endpoint" placeholder="https://api.payer.com/claims" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Configuration</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payer Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {payers.map((payer) => (
          <Card key={payer.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{payer.payerName}</CardTitle>
                {getStatusIcon(payer.isActive)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  {getStatusBadge(payer.isActive)}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate:</span>
                  <span className="font-medium">{payer.successRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response:</span>
                  <span className="font-medium">{payer.avgResponseTime.toFixed(1)}s</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Claims Sent:</span>
                  <span className="font-medium">{payer.claimsSubmitted}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => testConnection(payer.id)}
                    disabled={connectionTest.isPending}
                  >
                    {connectionTest.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Test'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => submitClaimsToPayer(payer.id)}
                    disabled={!payer.isActive || batchSubmission.isPending}
                  >
                    {batchSubmission.isPending ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Submit'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Submissions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claim Submissions</CardTitle>
          <CardDescription>
            Real-time tracking of electronic claim submissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim Number</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubmissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.claimNumber}</TableCell>
                  <TableCell>{submission.payerName}</TableCell>
                  <TableCell>${submission.amount.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {submission.responseTime ? `${submission.responseTime}s` : '-'}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Integration Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Success Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Overall Success Rate:</span>
                <span className="font-bold text-green-600">
                  {payers.length > 0 
                    ? (payers.reduce((sum, p) => sum + p.successRate, 0) / payers.length).toFixed(1)
                    : '0'}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Claims Processed Today:</span>
                <span className="font-bold">47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Auto-Acknowledgments:</span>
                <span className="font-bold text-blue-600">89%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-600" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Avg Response Time:</span>
                <span className="font-bold">
                  {payers.length > 0 
                    ? (payers.reduce((sum, p) => sum + p.avgResponseTime, 0) / payers.length).toFixed(1)
                    : '0'}s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fastest Payer:</span>
                <span className="font-bold text-green-600">
                  {payers.length > 0 
                    ? `${payers.reduce((fastest, current) => 
                        current.avgResponseTime < fastest.avgResponseTime ? current : fastest
                      ).payerName.split(' ')[0]} (${payers.reduce((fastest, current) => 
                        current.avgResponseTime < fastest.avgResponseTime ? current : fastest
                      ).avgResponseTime.toFixed(1)}s)`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">System Uptime:</span>
                <span className="font-bold text-green-600">99.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Issues & Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {payers.filter(p => !p.isActive).map(payer => (
                <div key={payer.id} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                  <p className="font-medium text-yellow-800">{payer.payerName} Offline</p>
                  <p className="text-yellow-700">Connection lost - check configuration</p>
                </div>
              ))}
              
              {payers.filter(p => p.successRate < 90).map(payer => (
                <div key={payer.id} className="p-2 bg-red-50 border border-red-200 rounded text-sm">
                  <p className="font-medium text-red-800">{payer.payerName} Low Success Rate</p>
                  <p className="text-red-700">Only {payer.successRate.toFixed(1)}% success rate</p>
                </div>
              ))}

              {payers.length > 0 && payers.every(p => p.isActive && p.successRate >= 90) && (
                <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                  <p className="font-medium text-green-800 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    All Systems Operational
                  </p>
                  <p className="text-green-700">No issues detected</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
