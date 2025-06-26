
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface NewOrder {
  vendor: string;
  orderType: string;
  priority: string;
  notes: string;
  items: any[];
}

interface Vendor {
  id: string;
  name: string;
  status: string;
  lastSync: string;
  itemsCount: number;
}

interface CreateOrderDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newOrder: NewOrder;
  setNewOrder: (order: NewOrder) => void;
  vendors: Vendor[];
  onCreateOrder: () => void;
}

export const CreateOrderDialog = ({
  isOpen,
  onOpenChange,
  newOrder,
  setNewOrder,
  vendors,
  onCreateOrder
}: CreateOrderDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-4">
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create New Order</DialogTitle>
          <DialogDescription className="text-gray-600">
            Create a new order for inventory items
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="vendor" className="text-gray-700">Vendor</Label>
            <Select value={newOrder.vendor} onValueChange={(value) => setNewOrder({...newOrder, vendor: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select a vendor" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.name}>
                    {vendor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="orderType" className="text-gray-700">Order Type</Label>
            <Select value={newOrder.orderType} onValueChange={(value) => setNewOrder({...newOrder, orderType: value})}>
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
            <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
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
          <Button onClick={onCreateOrder} className="w-full">
            Create Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
