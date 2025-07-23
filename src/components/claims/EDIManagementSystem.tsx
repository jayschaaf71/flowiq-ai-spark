
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { usePayerConnections, useConnectionTest, useClaimSubmission } from "@/hooks/usePayerIntegration";
import { useToast } from "@/hooks/use-toast";
import { 
  Network, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Activity,
  FileText,
  Zap,
  RefreshCw
} from "lucide-react";

export const EDIManagementSystem = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState<any[]>([]);
  const { data: payerConnections, isLoading } = usePayerConnections();
  const connectionTest = useConnectionTest();
  const claimSubmission = useClaimSubmission();
  const { toast } = useToast();

  // Mock EDI transaction data
  useEffect(() => {
    const mockTransactions = [
      {
        id: "EDI-001",
        type: "837P",
        payer: "Blue Cross Blue Shield",
        status: "transmitted",
        claimCount: 25,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        acknowledgment: "999",
        errors: 0
      },
      {
        id: "EDI-002",
        type: "270/271",
        payer: "Aetna",
        status: "acknowledged",
        claimCount: 1,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        acknowledgment: "271",
        errors: 0
      },
      {
        id: "EDI-003",
        type: "837P",
        payer: "UnitedHealth",
        status: "rejected",
        claimCount: 12,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        acknowledgment: "999",
        errors: 3
      }
    ];
    setTransactions(mockTransactions);
  }, []);

  const handleTestConnection = async (payerId: string) => {
    try {
      await connectionTest.mutateAsync(payerId);
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'transmitted': return 'bg-blue-100 text-blue-700';
      case 'acknowledged': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin mr-2" />
        <span>Loading EDI Management System...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Network className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">EDI Management System</h2>
            <p className="text-gray-600">Electronic Data Interchange monitoring and management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Zap className="w-4 h-4 mr-2" />
            Test All Connections
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Connections</p>
                <p className="text-2xl font-bold">{payerConnections?.length || 0}</p>
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
                <p className="text-2xl font-bold">47</p>
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
                <p className="text-2xl font-bold">94.3%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Acks</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent EDI Activity</CardTitle>
                <CardDescription>Latest transaction processing activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <div className="font-medium">{transaction.type} - {transaction.payer}</div>
                        <div className="text-sm text-gray-500">
                          {transaction.claimCount} claims • {formatTimestamp(transaction.timestamp)}
                        </div>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Connection Status</CardTitle>
                <CardDescription>Real-time payer connection health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {payerConnections?.map((connection) => (
                    <div key={connection.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">{connection.payerName}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleTestConnection(connection.id)}
                        disabled={connectionTest.isPending}
                      >
                        Test
                      </Button>
                    </div>
                  )) || (
                    <div className="text-center py-4 text-gray-500">
                      No payer connections configured
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>EDI Transaction Log</CardTitle>
              <CardDescription>Complete history of EDI transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{transaction.id}</h4>
                          <p className="text-sm text-gray-500">{transaction.type}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Payer:</span>
                        <p className="font-medium">{transaction.payer}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Claims:</span>
                        <p className="font-medium">{transaction.claimCount}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Acknowledgment:</span>
                        <p className="font-medium">{transaction.acknowledgment}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Errors:</span>
                        <p className={`font-medium ${transaction.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {transaction.errors}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card>
            <CardHeader>
              <CardTitle>Payer Connections</CardTitle>
              <CardDescription>Manage EDI connections with insurance payers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payerConnections?.map((connection) => (
                  <div key={connection.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <h4 className="font-medium">{connection.payerName}</h4>
                          <p className="text-sm text-gray-500">EDI Gateway: {connection.configuration?.gateway || 'Direct'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleTestConnection(connection.id)}
                          disabled={connectionTest.isPending}
                        >
                          {connectionTest.isPending ? 'Testing...' : 'Test'}
                        </Button>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Last Transaction:</span>
                        <p className="font-medium">2 hours ago</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Success Rate:</span>
                        <p className="font-medium text-green-600">98.5%</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Avg Response:</span>
                        <p className="font-medium">1.2s</p>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8 text-gray-500">
                    <Network className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No payer connections configured</p>
                    <Button className="mt-4">Add Connection</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>Live EDI transaction monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Transaction Queue</span>
                    <Badge variant="outline">5 pending</Badge>
                  </div>
                  <Progress value={75} className="w-full" />
                  
                  <div className="flex items-center justify-between">
                    <span>Processing Rate</span>
                    <span className="text-sm font-medium">24/min</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Error Rate</span>
                    <span className="text-sm font-medium text-green-600">0.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>EDI system performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>All systems operational</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Database connectivity: Normal</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Network latency: 45ms</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <span>Scheduled maintenance: Tonight 2 AM</span>
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
