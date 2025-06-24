
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
import { 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Settings,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react";

interface PayerConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'testing';
  lastSync: string;
  claimsSubmitted: number;
  successRate: number;
  avgResponseTime: number;
}

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
  const [payers, setPayers] = useState<PayerConnection[]>([
    {
      id: '1',
      name: 'Blue Cross Blue Shield',
      status: 'connected',
      lastSync: '2024-01-15T10:30:00Z',
      claimsSubmitted: 247,
      successRate: 94.5,
      avgResponseTime: 2.3
    },
    {
      id: '2',
      name: 'Aetna',
      status: 'connected',
      lastSync: '2024-01-15T09:15:00Z',
      claimsSubmitted: 189,
      successRate: 91.2,
      avgResponseTime: 3.1
    },
    {
      id: '3',
      name: 'Cigna',
      status: 'testing',
      lastSync: '2024-01-14T16:45:00Z',
      claimsSubmitted: 156,
      successRate: 87.8,
      avgResponseTime: 4.2
    },
    {
      id: '4',
      name: 'UnitedHealth',
      status: 'disconnected',
      lastSync: '2024-01-10T14:20:00Z',
      claimsSubmitted: 203,
      successRate: 89.6,
      avgResponseTime: 5.1
    }
  ]);

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

  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
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

  const getStatusBadge = (status: string) => {
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
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const testConnection = async (payerId: string) => {
    setPayers(prev => prev.map(p => 
      p.id === payerId ? { ...p, status: 'testing' as const } : p
    ));

    // Simulate connection test
    setTimeout(() => {
      setPayers(prev => prev.map(p => 
        p.id === payerId ? { 
          ...p, 
          status: Math.random() > 0.2 ? 'connected' as const : 'disconnected' as const,
          lastSync: new Date().toISOString()
        } : p
      ));

      toast({
        title: "Connection Test Complete",
        description: "Payer connection has been validated",
      });
    }, 3000);
  };

  const submitClaimsToPayer = async (payerId: string) => {
    const payer = payers.find(p => p.id === payerId);
    if (!payer) return;

    toast({
      title: "Claims Submitted",
      description: `Batch submission to ${payer.name} initiated`,
    });
  };

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
                <CardTitle className="text-sm font-medium">{payer.name}</CardTitle>
                {getStatusIcon(payer.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Status:</span>
                  {getStatusBadge(payer.status)}
                </div>
                <div className="flex justify-between text-sm">
                  <span>Success Rate:</span>
                  <span className="font-medium">{payer.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Response:</span>
                  <span className="font-medium">{payer.avgResponseTime}s</span>
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
                    disabled={payer.status === 'testing'}
                  >
                    {payer.status === 'testing' ? 'Testing...' : 'Test'}
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => submitClaimsToPayer(payer.id)}
                    disabled={payer.status !== 'connected'}
                  >
                    Submit
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
                <span className="font-bold text-green-600">92.3%</span>
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
                <span className="font-bold">3.2s</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fastest Payer:</span>
                <span className="font-bold text-green-600">BCBS (2.1s)</span>
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
              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <p className="font-medium text-yellow-800">UnitedHealth Offline</p>
                <p className="text-yellow-700">Connection lost 2 hours ago</p>
              </div>
              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-medium text-blue-800">Cigna Testing Mode</p>
                <p className="text-blue-700">New integration in progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
