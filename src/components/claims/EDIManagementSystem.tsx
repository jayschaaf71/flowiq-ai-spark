
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePayerIntegration } from "@/hooks/usePayerIntegration";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Send, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Zap,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Settings,
  Activity,
  Network,
  Shield
} from "lucide-react";

interface EDIConnection {
  id: string;
  payerName: string;
  connectionType: 'direct' | 'clearinghouse' | 'api';
  status: 'active' | 'inactive' | 'testing';
  lastSync: Date;
  successRate: number;
  avgResponseTime: number;
  volume: number;
}

interface EDITransaction {
  id: string;
  type: 'claim' | 'eligibility' | 'remittance' | 'status';
  payerName: string;
  status: 'pending' | 'sent' | 'acknowledged' | 'processed' | 'rejected';
  submittedAt: Date;
  processedAt?: Date;
  controlNumber: string;
  amount?: number;
  errorCodes?: string[];
}

export const EDIManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [connections, setConnections] = useState<EDIConnection[]>([]);
  const [transactions, setTransactions] = useState<EDITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { data: payerConnections } = usePayerIntegration();

  useEffect(() => {
    loadEDIData();
  }, []);

  const loadEDIData = async () => {
    try {
      setLoading(true);
      
      // Mock EDI connections
      const mockConnections: EDIConnection[] = [
        {
          id: '1',
          payerName: 'Blue Cross Blue Shield',
          connectionType: 'direct',
          status: 'active',
          lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
          successRate: 98.5,
          avgResponseTime: 1.2,
          volume: 1245
        },
        {
          id: '2',
          payerName: 'Aetna',
          connectionType: 'clearinghouse',
          status: 'active',
          lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000),
          successRate: 96.8,
          avgResponseTime: 2.1,
          volume: 892
        },
        {
          id: '3',
          payerName: 'UnitedHealth',
          connectionType: 'api',
          status: 'testing',
          lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000),
          successRate: 94.2,
          avgResponseTime: 1.8,
          volume: 567
        },
        {
          id: '4',
          payerName: 'Cigna',
          connectionType: 'direct',
          status: 'inactive',
          lastSync: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          successRate: 92.1,
          avgResponseTime: 3.2,
          volume: 423
        }
      ];

      // Mock EDI transactions
      const mockTransactions: EDITransaction[] = [
        {
          id: '1',
          type: 'claim',
          payerName: 'Blue Cross Blue Shield',
          status: 'processed',
          submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          processedAt: new Date(Date.now() - 30 * 60 * 1000),
          controlNumber: 'CTL001234',
          amount: 285.50
        },
        {
          id: '2',
          type: 'eligibility',
          payerName: 'Aetna',
          status: 'acknowledged',
          submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          controlNumber: 'CTL001235'
        },
        {
          id: '3',
          type: 'claim',
          payerName: 'UnitedHealth',
          status: 'rejected',
          submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          controlNumber: 'CTL001236',
          amount: 450.00,
          errorCodes: ['AAE', 'N362']
        },
        {
          id: '4',
          type: 'remittance',
          payerName: 'Blue Cross Blue Shield',
          status: 'processed',
          submittedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
          processedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          controlNumber: 'CTL001237',
          amount: 195.75
        }
      ];

      setConnections(mockConnections);
      setTransactions(mockTransactions);
      
    } catch (error) {
      console.error('Error loading EDI data:', error);
      toast({
        title: "Error Loading EDI Data",
        description: "Unable to load EDI management data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async (connectionId: string) => {
    try {
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) return;

      toast({
        title: "Testing Connection",
        description: `Testing connection to ${connection.payerName}...`,
      });

      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));

      setConnections(prev => 
        prev.map(c => 
          c.id === connectionId 
            ? { ...c, status: 'active' as const, lastSync: new Date() }
            : c
        )
      );

      toast({
        title: "Connection Test Successful",
        description: `Connection to ${connection.payerName} is working properly`,
      });
    } catch (error) {
      toast({
        title: "Connection Test Failed",
        description: "Unable to connect to payer",
        variant: "destructive"
      });
    }
  };

  const retryTransaction = async (transactionId: string) => {
    try {
      const transaction = transactions.find(t => t.id === transactionId);
      if (!transaction) return;

      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, status: 'pending' as const }
            : t
        )
      );

      toast({
        title: "Transaction Retry",
        description: `Retrying transaction ${transaction.controlNumber}`,
      });

      // Simulate retry
      setTimeout(() => {
        setTransactions(prev => 
          prev.map(t => 
            t.id === transactionId 
              ? { ...t, status: 'sent' as const }
              : t
          )
        );
      }, 2000);

    } catch (error) {
      toast({
        title: "Retry Failed",
        description: "Unable to retry transaction",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'processed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
      case 'sent':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'testing':
      case 'acknowledged':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'inactive':
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
      case 'sent':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'testing':
      case 'acknowledged':
        return <RefreshCw className="w-4 h-4 text-orange-600" />;
      case 'inactive':
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-6 h-6 animate-spin mr-2" />
        <span>Loading EDI management system...</span>
      </div>
    );
  }

  // Mock analytics data
  const transactionVolumeData = [
    { month: 'Jul', claims: 345, eligibility: 234, remittance: 187, status: 89 },
    { month: 'Aug', claims: 389, eligibility: 267, remittance: 201, status: 95 },
    { month: 'Sep', claims: 423, eligibility: 289, remittance: 234, status: 103 },
    { month: 'Oct', claims: 467, eligibility: 312, remittance: 256, status: 118 },
    { month: 'Nov', claims: 501, eligibility: 334, remittance: 278, status: 127 },
    { month: 'Dec', claims: 545, eligibility: 356, remittance: 298, status: 134 }
  ];

  const successRateData = [
    { payer: 'BCBS', rate: 98.5 },
    { payer: 'Aetna', rate: 96.8 },
    { payer: 'UnitedHealth', rate: 94.2 },
    { payer: 'Cigna', rate: 92.1 },
    { payer: 'Medicare', rate: 99.1 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">EDI Management System</h2>
            <p className="text-gray-600">Electronic Data Interchange for seamless payer communications</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-700">
            <Shield className="w-3 h-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge className="bg-green-100 text-green-700">
            <Activity className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
          <Button variant="outline" onClick={loadEDIData}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Connections</p>
                    <p className="text-2xl font-bold">{connections.filter(c => c.status === 'active').length}</p>
                  </div>
                  <Network className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Transactions</p>
                    <p className="text-2xl font-bold">{transactions.length}</p>
                  </div>
                  <Send className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-2xl font-bold">96.8%</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                    <p className="text-2xl font-bold">1.8s</p>
                  </div>
                  <Zap className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest EDI transaction activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium">{transaction.controlNumber}</p>
                          <p className="text-sm text-gray-600">{transaction.payerName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                        {transaction.amount && (
                          <p className="text-sm font-medium mt-1">
                            {formatCurrency(transaction.amount)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Real-time payer connection status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {connections.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(connection.status)}
                        <div>
                          <p className="font-medium">{connection.payerName}</p>
                          <p className="text-sm text-gray-600">{connection.connectionType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(connection.status)}>
                          {connection.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {connection.successRate}% success
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="connections">
          <div className="space-y-4">
            {connections.map((connection) => (
              <Card key={connection.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(connection.status)}
                      <div>
                        <CardTitle className="text-lg">{connection.payerName}</CardTitle>
                        <CardDescription>
                          {connection.connectionType} connection • Last sync: {connection.lastSync.toLocaleString()}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(connection.status)}>
                        {connection.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => testConnection(connection.id)}
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={connection.successRate} className="flex-1" />
                        <span className="text-sm font-medium">{connection.successRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                      <p className="font-semibold">{connection.avgResponseTime}s</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Volume</p>
                      <p className="font-semibold">{connection.volume.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Connection Type</p>
                      <p className="font-semibold capitalize">{connection.connectionType}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>EDI Transactions</CardTitle>
                  <CardDescription>All electronic data interchange transactions</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{transaction.controlNumber}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{transaction.payerName}</p>
                        <p className="text-xs text-gray-500">
                          Submitted: {transaction.submittedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                      {transaction.amount && (
                        <p className="text-sm font-medium mt-1">
                          {formatCurrency(transaction.amount)}
                        </p>
                      )}
                      {transaction.errorCodes && (
                        <p className="text-xs text-red-600 mt-1">
                          Errors: {transaction.errorCodes.join(', ')}
                        </p>
                      )}
                      {transaction.status === 'rejected' && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => retryTransaction(transaction.id)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume Trends</CardTitle>
                <CardDescription>Monthly EDI transaction volume by type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={transactionVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="claims" fill="#3B82F6" name="Claims" />
                    <Bar dataKey="eligibility" fill="#10B981" name="Eligibility" />
                    <Bar dataKey="remittance" fill="#F59E0B" name="Remittance" />
                    <Bar dataKey="status" fill="#8B5CF6" name="Status Inquiry" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payer Success Rates</CardTitle>
                <CardDescription>Transaction success rates by payer</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={successRateData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[90, 100]} />
                    <YAxis dataKey="payer" type="category" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="rate" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>EDI Configuration</CardTitle>
                <CardDescription>Configure EDI settings and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Default Interchange ID</label>
                  <Input placeholder="Enter your interchange ID" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Application Sender ID</label>
                  <Input placeholder="Enter sender ID" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Test Mode</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="testMode" />
                    <label htmlFor="testMode" className="text-sm">Enable test mode for new connections</label>
                  </div>
                </div>
                <Button className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure EDI transaction notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Transaction failures</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Connection issues</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily summaries</span>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly reports</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <Button className="w-full">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
