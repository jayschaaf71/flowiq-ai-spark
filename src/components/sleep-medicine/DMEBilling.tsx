import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, DollarSign, FileText, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DMEBillingProps {
  patientId: string;
}

const mockDMEOrders = [
  {
    id: "dme-001",
    orderType: "CPAP Machine",
    status: "delivered",
    orderDate: "2024-01-15",
    supplierName: "ResMed Supply Co",
    trackingNumber: "RS123456789",
    insuranceAuthorization: "AUTH-12345",
    costEstimate: 1200.00,
    patientResponsibility: 240.00,
    actualDeliveryDate: "2024-01-22"
  },
  {
    id: "dme-002",
    orderType: "Oral Appliance",
    status: "pending_approval",
    orderDate: "2024-01-20",
    supplierName: "SomnoMed",
    trackingNumber: null,
    insuranceAuthorization: "AUTH-12346",
    costEstimate: 2800.00,
    patientResponsibility: 560.00,
    actualDeliveryDate: null
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "delivered": return "bg-success text-success-foreground";
    case "pending_approval": return "bg-warning text-warning-foreground";
    case "in_transit": return "bg-primary text-primary-foreground";
    case "denied": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "delivered": return <CheckCircle className="h-4 w-4" />;
    case "pending_approval": return <Clock className="h-4 w-4" />;
    case "in_transit": return <Package className="h-4 w-4" />;
    case "denied": return <XCircle className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

export const DMEBilling = ({ patientId }: DMEBillingProps) => {
  const [orders, setOrders] = useState(mockDMEOrders);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const { toast } = useToast();

  const handleNewOrder = (formData: any) => {
    const newOrder = {
      id: `dme-${Date.now()}`,
      ...formData,
      orderDate: new Date().toISOString().split('T')[0],
      status: "pending_approval"
    };
    setOrders([...orders, newOrder]);
    setIsAddingOrder(false);
    toast({
      title: "DME Order Created",
      description: "New DME order has been submitted for approval."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">DME Orders & Billing</h3>
          <p className="text-sm text-muted-foreground">
            Manage durable medical equipment orders and insurance billing
          </p>
        </div>
        <Dialog open={isAddingOrder} onOpenChange={setIsAddingOrder}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New DME Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New DME Order</DialogTitle>
            </DialogHeader>
            <DMEOrderForm onSubmit={handleNewOrder} onCancel={() => setIsAddingOrder(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{order.orderType}</CardTitle>
                  <CardDescription>
                    Order #{order.id} • {order.supplierName}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {getStatusIcon(order.status)}
                  <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Order Date</Label>
                  <p>{order.orderDate}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Authorization</Label>
                  <p>{order.insuranceAuthorization}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Total Cost</Label>
                  <p>${order.costEstimate.toFixed(2)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Patient Responsibility</Label>
                  <p>${order.patientResponsibility.toFixed(2)}</p>
                </div>
              </div>
              
              {order.trackingNumber && (
                <div className="border-t pt-3">
                  <Label className="text-xs text-muted-foreground">Tracking Number</Label>
                  <p className="font-mono text-sm">{order.trackingNumber}</p>
                </div>
              )}
              
              {order.actualDeliveryDate && (
                <div className="border-t pt-3">
                  <Label className="text-xs text-muted-foreground">Delivered</Label>
                  <p>{order.actualDeliveryDate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">No DME Orders</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first DME order to start tracking equipment and billing.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const DMEOrderForm = ({ onSubmit, onCancel }: { onSubmit: (data: any) => void; onCancel: () => void }) => {
  const [formData, setFormData] = useState({
    orderType: "",
    supplierName: "",
    insuranceAuthorization: "",
    costEstimate: "",
    patientResponsibility: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      costEstimate: parseFloat(formData.costEstimate) || 0,
      patientResponsibility: parseFloat(formData.patientResponsibility) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Order Details</TabsTrigger>
          <TabsTrigger value="billing">Billing Info</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderType">Equipment Type</Label>
              <Select onValueChange={(value) => setFormData({...formData, orderType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPAP Machine">CPAP Machine</SelectItem>
                  <SelectItem value="BiPAP Machine">BiPAP Machine</SelectItem>
                  <SelectItem value="Oral Appliance">Oral Appliance</SelectItem>
                  <SelectItem value="CPAP Mask">CPAP Mask</SelectItem>
                  <SelectItem value="Tubing/Accessories">Tubing/Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supplierName">Supplier</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
                placeholder="Supplier name"
                required
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="insuranceAuth">Insurance Authorization</Label>
              <Input
                id="insuranceAuth"
                value={formData.insuranceAuthorization}
                onChange={(e) => setFormData({...formData, insuranceAuthorization: e.target.value})}
                placeholder="AUTH-12345"
                required
              />
            </div>
            <div>
              <Label htmlFor="costEstimate">Total Cost Estimate</Label>
              <Input
                id="costEstimate"
                type="number"
                step="0.01"
                value={formData.costEstimate}
                onChange={(e) => setFormData({...formData, costEstimate: e.target.value})}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="patientResp">Patient Responsibility</Label>
            <Input
              id="patientResp"
              type="number"
              step="0.01"
              value={formData.patientResponsibility}
              onChange={(e) => setFormData({...formData, patientResponsibility: e.target.value})}
              placeholder="0.00"
              required
            />
          </div>
        </TabsContent>
        
        <TabsContent value="notes" className="space-y-4">
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Any additional notes about this order..."
              rows={4}
            />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Order</Button>
      </div>
    </form>
  );
};