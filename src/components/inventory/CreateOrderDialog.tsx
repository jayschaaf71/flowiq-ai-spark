
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";

interface NewOrder {
  vendor_id: string;
  order_type: string;
  priority: string;
  notes: string;
}

interface Vendor {
  id: string;
  name: string;
  vendor_number: string;
  status: string;
}

interface CreateOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newOrder: NewOrder;
  setNewOrder: (order: NewOrder) => void;
  vendors: Vendor[];
  onCreateOrder: () => void;
  isCreatingOrder?: boolean;
}

export const CreateOrderDialog = ({
  isOpen,
  onOpenChange,
  newOrder,
  setNewOrder,
  vendors,
  onCreateOrder,
  isCreatingOrder = false
}: CreateOrderDialogProps) => {
  const activeVendors = vendors.filter(vendor => vendor.status === 'active');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-4" disabled={isCreatingOrder}>
          {isCreatingOrder ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create New Order</DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new purchase order for inventory items
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="vendor" className="text-gray-700">Vendor</Label>
            <Select 
              value={newOrder.vendor_id} 
              onValueChange={(value) => setNewOrder({...newOrder, vendor_id: value})}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a vendor" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {activeVendors.length > 0 ? (
                  activeVendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id}>
                      {vendor.name} ({vendor.vendor_number})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    No active vendors available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="orderType" className="text-gray-700">Order Type</Label>
            <Select 
              value={newOrder.order_type} 
              onValueChange={(value) => setNewOrder({...newOrder, order_type: value})}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="regular">Regular Order</SelectItem>
                <SelectItem value="emergency">Emergency Order</SelectItem>
                <SelectItem value="bulk">Bulk Order</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority" className="text-gray-700">Priority</Label>
            <Select 
              value={newOrder.priority} 
              onValueChange={(value) => setNewOrder({...newOrder, priority: value})}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-gray-700">Notes</Label>
            <Textarea 
              id="notes"
              placeholder="Add any notes for this order..." 
              value={newOrder.notes}
              onChange={(e) => setNewOrder({...newOrder, notes: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <Button 
            onClick={onCreateOrder} 
            className="w-full"
            disabled={isCreatingOrder || !newOrder.vendor_id}
          >
            {isCreatingOrder ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Order...
              </>
            ) : (
              "Create Order"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
