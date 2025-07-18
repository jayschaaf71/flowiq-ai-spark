import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  RefreshCw,
  Eye,
  Filter,
  Search,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ClaimTransaction {
  id: string;
  claimId: string;
  claimNumber: string;
  patientName: string;
  payer: string;
  amount: number;
  submittedAt: string;
  status: 'submitted' | 'acknowledged' | 'processing' | 'adjudicated' | 'paid' | 'denied' | 'pending';
  transactionType: 'eligibility' | 'claim_submission' | 'claim_status' | 'payment' | 'prior_auth';
  responseTime: number;
  ediTransactionId: string;
  lastUpdated: string;
  statusHistory: { status: string; timestamp: string; notes?: string }[];
}

export const RealTimeClaimsTracking: React.FC = () => {
  const [transactions, setTransactions] = useState<ClaimTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Simulate real-time data
  useEffect(() => {
    const mockTransactions: ClaimTransaction[] = [
      {
        id: '1',
        claimId: 'CLM-001',
        claimNumber: 'CLM-2024-001',
        patientName: 'Sarah Johnson',
        payer: 'Blue Cross Blue Shield',
        amount: 450.00,
        submittedAt: '2024-01-20T10:30:00Z',
        status: 'processing',
        transactionType: 'claim_submission',
        responseTime: 1.2,
        ediTransactionId: 'EDI-837-001',
        lastUpdated: '2 minutes ago',
        statusHistory: [
          { status: 'submitted', timestamp: '2024-01-20T10:30:00Z' },
          { status: 'acknowledged', timestamp: '2024-01-20T10:31:15Z' },
          { status: 'processing', timestamp: '2024-01-20T10:33:00Z' }
        ]
      },
      {
        id: '2',
        claimId: 'CLM-002',
        claimNumber: 'CLM-2024-002',
        patientName: 'Mike Chen',
        payer: 'Aetna',
        amount: 275.00,
        submittedAt: '2024-01-20T09:15:00Z',
        status: 'paid',
        transactionType: 'payment',
        responseTime: 0.8,
        ediTransactionId: 'EDI-835-002',
        lastUpdated: '1 hour ago',
        statusHistory: [
          { status: 'submitted', timestamp: '2024-01-20T09:15:00Z' },
          { status: 'acknowledged', timestamp: '2024-01-20T09:16:30Z' },
          { status: 'adjudicated', timestamp: '2024-01-20T10:45:00Z' },
          { status: 'paid', timestamp: '2024-01-20T11:20:00Z' }
        ]
      },
      {
        id: '3',
        claimId: 'CLM-003',
        claimNumber: 'CLM-2024-003',
        patientName: 'Emily Davis',
        payer: 'Cigna',
        amount: 680.00,
        submittedAt: '2024-01-20T11:45:00Z',
        status: 'denied',
        transactionType: 'claim_submission',
        responseTime: 2.1,
        ediTransactionId: 'EDI-837-003',
        lastUpdated: '30 minutes ago',
        statusHistory: [
          { status: 'submitted', timestamp: '2024-01-20T11:45:00Z' },
          { status: 'acknowledged', timestamp: '2024-01-20T11:46:20Z' },
          { status: 'processing', timestamp: '2024-01-20T11:50:00Z' },
          { status: 'denied', timestamp: '2024-01-20T12:15:00Z', notes: 'Prior authorization required' }
        ]
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'acknowledged': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Activity className="h-4 w-4 text-yellow-600" />;
      case 'adjudicated': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'denied': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'acknowledged': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'adjudicated': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getResponseTimeColor = (time: number) => {
    if (time < 1) return 'text-green-600';
    if (time < 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.payer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Real-Time Claims Tracking</h2>
            <p className="text-gray-600">Monitor claim transactions and status updates in real-time</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Active Transactions</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">156</div>
              <div className="text-sm text-gray-600">Processed Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-600">Pending Response</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">3</div>
              <div className="text-sm text-gray-600">Errors/Denials</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">1.4s</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by patient, claim number, or payer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedStatus === 'processing' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('processing')}
                size="sm"
              >
                Processing
              </Button>
              <Button
                variant={selectedStatus === 'paid' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('paid')}
                size="sm"
              >
                Paid
              </Button>
              <Button
                variant={selectedStatus === 'denied' ? 'default' : 'outline'}
                onClick={() => setSelectedStatus('denied')}
                size="sm"
              >
                Denied
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Transaction Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Live Transaction Feed
          </CardTitle>
          <CardDescription>
            Real-time updates from payer systems and clearinghouses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(transaction.status)}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{transaction.claimNumber}</span>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        <Badge variant="outline">
                          {transaction.transactionType.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Patient: {transaction.patientName}</div>
                          <div className="text-gray-600">Payer: {transaction.payer}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Amount: ${transaction.amount.toFixed(2)}</div>
                          <div className="text-gray-600">EDI ID: {transaction.ediTransactionId}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">
                            Response Time: <span className={getResponseTimeColor(transaction.responseTime)}>{transaction.responseTime}s</span>
                          </div>
                          <div className="text-gray-600">Updated: {transaction.lastUpdated}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="ml-7">
                  <div className="text-sm font-medium mb-2">Status History</div>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {transaction.statusHistory.map((history, index) => (
                      <div key={index} className="flex items-center gap-2 min-w-fit">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(history.status)}
                          <span className="text-xs font-medium">{history.status}</span>
                        </div>
                        {index < transaction.statusHistory.length - 1 && (
                          <div className="w-4 h-px bg-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                  {transaction.statusHistory[transaction.statusHistory.length - 1]?.notes && (
                    <div className="text-xs text-red-600 mt-1 p-2 bg-red-50 rounded">
                      Note: {transaction.statusHistory[transaction.statusHistory.length - 1].notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Success Rate (24h)</span>
                  <span>94.2%</span>
                </div>
                <Progress value={94.2} className="h-3" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-green-600">1.4s</div>
                  <div className="text-sm text-gray-600">Avg Response</div>
                </div>
                
                <div className="text-center p-3 border rounded-lg">
                  <div className="text-lg font-bold text-blue-600">98.5%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Real-time Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <div className="text-sm">
                  <div className="font-medium">High Response Time</div>
                  <div className="text-gray-600">Cigna connection showing 3.2s avg</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
                <div className="text-sm">
                  <div className="font-medium">Connection Error</div>
                  <div className="text-gray-600">Availity clearinghouse timeout</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium">All Systems Operational</div>
                  <div className="text-gray-600">23 active connections running smoothly</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};