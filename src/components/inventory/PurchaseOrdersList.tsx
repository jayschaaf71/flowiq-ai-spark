
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Calendar, DollarSign } from "lucide-react";

interface PurchaseOrder {
  id: string;
  order_number: string;
  vendor_id: string;
  order_type: string;
  priority: string;
  status: string;
  order_date: string;
  expected_delivery_date?: string;
  total_amount: number;
  notes?: string;
  created_at: string;
  vendors: {
    name: string;
  };
}

interface PurchaseOrdersListProps {
  orders: PurchaseOrder[];
  onViewOrder: (orderId: string) => void;
  onEditOrder: (orderId: string) => void;
}

export const PurchaseOrdersList = ({
  orders,
  onViewOrder,
  onEditOrder
}: PurchaseOrdersListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "bg-gray-100 text-gray-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "ordered": return "bg-purple-100 text-purple-800";
      case "received": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800";
      case "normal": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No purchase orders found</p>
        <p className="text-sm">Create your first order to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold">{order.order_number}</h3>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                  <Badge className={getPriorityColor(order.priority)}>
                    {order.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Vendor:</span>
                    <span className="ml-1">{order.vendors.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Type:</span>
                    <span className="ml-1 capitalize">{order.order_type}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(order.order_date)}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span>{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>

                {order.expected_delivery_date && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Expected Delivery:</span>
                    <span className="ml-1">{formatDate(order.expected_delivery_date)}</span>
                  </div>
                )}

                {order.notes && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Notes:</span>
                    <span className="ml-1">{order.notes}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onViewOrder(order.id)}
                >
                  View
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEditOrder(order.id)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
