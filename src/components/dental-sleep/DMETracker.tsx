import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, Search, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const DMETracker = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const dmeOrders = [
    {
      id: 'DME-001',
      patientName: 'John Smith',
      orderType: 'CPAP Machine',
      supplier: 'ResMed Healthcare',
      orderDate: '2024-01-15',
      expectedDelivery: '2024-01-22',
      status: 'shipped',
      trackingNumber: 'TR123456789',
      authorization: 'AUTH-2024-001',
      cost: 1250.00,
      patientResponsibility: 250.00
    },
    {
      id: 'DME-002',
      patientName: 'Sarah Johnson',
      orderType: 'Oral Appliance',
      supplier: 'SomnoMed',
      orderDate: '2024-01-12',
      expectedDelivery: '2024-01-19',
      status: 'delivered',
      trackingNumber: 'SM987654321',
      authorization: 'AUTH-2024-002',
      cost: 800.00,
      patientResponsibility: 150.00
    },
    {
      id: 'DME-003',
      patientName: 'Mike Wilson',
      orderType: 'CPAP Accessories',
      supplier: 'Phillips Healthcare',
      orderDate: '2024-01-20',
      expectedDelivery: '2024-01-27',
      status: 'pending_auth',
      trackingNumber: '',
      authorization: 'Pending',
      cost: 350.00,
      patientResponsibility: 75.00
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'ordered': return 'bg-yellow-100 text-yellow-800';
      case 'pending_auth': return 'bg-orange-100 text-orange-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'pending_auth': return <AlertCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">DME Tracker</h2>
          <p className="text-muted-foreground">Manage durable medical equipment orders and deliveries</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          New DME Order
        </Button>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>DME Orders</CardTitle>
              <CardDescription>
                Track all durable medical equipment orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by patient name or order ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                <div className="space-y-4">
                  {dmeOrders.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-foreground">{order.patientName}</h3>
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status.replace('_', ' ')}</span>
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground font-mono">{order.id}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Equipment Type:</span>
                            <p className="font-medium">{order.orderType}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Supplier:</span>
                            <p className="font-medium">{order.supplier}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Order Date:</span>
                            <p className="font-medium">{order.orderDate}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expected Delivery:</span>
                            <p className="font-medium">{order.expectedDelivery}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <span className="text-muted-foreground">Total Cost:</span>
                            <p className="font-medium">${order.cost.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Patient Responsibility:</span>
                            <p className="font-medium">${order.patientResponsibility.toFixed(2)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Authorization:</span>
                            <p className="font-medium">{order.authorization}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Tracking:</span>
                            <p className="font-medium">{order.trackingNumber || 'N/A'}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.trackingNumber && (
                            <Button variant="outline" size="sm">
                              <Truck className="w-4 h-4 mr-1" />
                              Track Package
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            Contact Supplier
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>DME Suppliers</CardTitle>
              <CardDescription>
                Manage relationships with durable medical equipment suppliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">ResMed Healthcare</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Contact:</span> (555) 123-4567</p>
                        <p><span className="text-muted-foreground">Email:</span> orders@resmed.com</p>
                        <p><span className="text-muted-foreground">Speciality:</span> CPAP/BiPAP Equipment</p>
                        <p><span className="text-muted-foreground">Active Orders:</span> 12</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">SomnoMed</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Contact:</span> (555) 234-5678</p>
                        <p><span className="text-muted-foreground">Email:</span> support@somnomed.com</p>
                        <p><span className="text-muted-foreground">Speciality:</span> Oral Appliances</p>
                        <p><span className="text-muted-foreground">Active Orders:</span> 8</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Phillips Healthcare</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Contact:</span> (555) 345-6789</p>
                        <p><span className="text-muted-foreground">Email:</span> dme@phillips.com</p>
                        <p><span className="text-muted-foreground">Speciality:</span> Sleep Equipment & Accessories</p>
                        <p><span className="text-muted-foreground">Active Orders:</span> 5</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insurance">
          <Card>
            <CardHeader>
              <CardTitle>Insurance Management</CardTitle>
              <CardDescription>
                Track insurance authorizations and coverage for DME orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Pending Authorizations</p>
                          <p className="text-2xl font-bold text-foreground">7</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Approved This Month</p>
                          <p className="text-2xl font-bold text-foreground">23</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Total Coverage</p>
                          <p className="text-2xl font-bold text-foreground">$28,400</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Submit New Authorization</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient1">John Smith</SelectItem>
                          <SelectItem value="patient2">Sarah Johnson</SelectItem>
                          <SelectItem value="patient3">Mike Wilson</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="equipment">Equipment Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cpap">CPAP Machine</SelectItem>
                          <SelectItem value="bipap">BiPAP Machine</SelectItem>
                          <SelectItem value="oral">Oral Appliance</SelectItem>
                          <SelectItem value="accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="justification">Medical Justification</Label>
                    <Textarea placeholder="Provide medical justification for the equipment..." />
                  </div>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Submit Authorization Request
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};