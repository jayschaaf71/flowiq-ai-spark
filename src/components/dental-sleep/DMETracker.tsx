import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  Settings,
  Calendar
} from "lucide-react";

export const DMETracker = () => {
  const devices = [
    {
      id: 'DME-2024-001',
      patientName: 'John Smith',
      deviceType: 'TAP 3 Elite',
      manufacturer: 'Airway Management',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-25',
      status: 'in_production',
      insuranceAuth: 'approved',
      cost: 2800,
      cptCode: 'E0486'
    },
    {
      id: 'DME-2024-002',
      patientName: 'Sarah Johnson',
      deviceType: 'SomnoDent Avant',
      manufacturer: 'SomnoMed',
      orderDate: '2024-01-18',
      expectedDelivery: '2024-01-28',
      status: 'shipped',
      insuranceAuth: 'approved',
      cost: 3200,
      cptCode: 'E0486'
    },
    {
      id: 'DME-2024-003',
      patientName: 'Mike Wilson',
      deviceType: 'Herbst Advance',
      manufacturer: 'Great Lakes Orthodontics',
      orderDate: '2024-01-20',
      expectedDelivery: '2024-01-30',
      status: 'delivered',
      insuranceAuth: 'approved',
      cost: 2950,
      cptCode: 'E0486'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'in_production': return 'bg-yellow-100 text-yellow-800';
      case 'ordered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'in_production': return <Settings className="w-4 h-4" />;
      case 'ordered': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-600" />
              Devices This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$52K</div>
            <p className="text-xs text-green-600">Average $2,890/device</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-600" />
              Avg Delivery Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
            <p className="text-xs text-orange-600">Target: &lt;14 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              Insurance Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-purple-600">Above target (90%)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="devices">Device Orders</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>DME Device Orders</CardTitle>
                  <CardDescription>Track oral appliance orders and deliveries</CardDescription>
                </div>
                <Button>
                  <Package className="w-4 h-4 mr-2" />
                  New Device Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {devices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">{device.patientName}</h3>
                        <Badge variant="outline">{device.id}</Badge>
                        <Badge className={getStatusColor(device.status)}>
                          {getStatusIcon(device.status)}
                          <span className="ml-1 capitalize">{device.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Device:</span>
                          <div className="font-medium">{device.deviceType}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Manufacturer:</span>
                          <div className="font-medium">{device.manufacturer}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Order Date:</span>
                          <div className="font-medium">{device.orderDate}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expected:</span>
                          <div className="font-medium">{device.expectedDelivery}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost:</span>
                          <div className="font-medium text-green-600">${device.cost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <FileText className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        Track Order
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Inventory</CardTitle>
                <CardDescription>Current stock levels by manufacturer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">TAP 3 Elite (AM)</span>
                    <span className="text-sm">5 units</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SomnoDent Avant</span>
                    <span className="text-sm">8 units</span>
                  </div>
                  <Progress value={40} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Herbst Advance</span>
                    <span className="text-sm">12 units</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">EMA (Elastic)</span>
                    <span className="text-sm">15 units</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reorder Alerts</CardTitle>
                <CardDescription>Items requiring restocking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-yellow-800">TAP 3 Elite - Low Stock</p>
                      <p className="text-xs text-yellow-600">5 units remaining (reorder at 10)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <Package className="w-4 h-4 text-red-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">Adjustment Tools</p>
                      <p className="text-xs text-red-600">2 units remaining (critical level)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Preference Analytics</CardTitle>
                <CardDescription>Most prescribed oral appliances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">TAP 3 Elite</span>
                    <span className="text-sm">35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SomnoDent Avant</span>
                    <span className="text-sm">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Herbst Advance</span>
                    <span className="text-sm">22%</span>
                  </div>
                  <Progress value={22} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">EMA</span>
                    <span className="text-sm">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Performance</CardTitle>
                <CardDescription>DME revenue tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 border rounded">
                      <div className="text-lg font-bold text-green-600">$52K</div>
                      <div className="text-xs text-muted-foreground">This Month</div>
                    </div>
                    <div className="p-3 border rounded">
                      <div className="text-lg font-bold text-blue-600">$148K</div>
                      <div className="text-xs text-muted-foreground">This Quarter</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Insurance Payments</span>
                      <span>78%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Patient Payments</span>
                      <span>22%</span>
                    </div>
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