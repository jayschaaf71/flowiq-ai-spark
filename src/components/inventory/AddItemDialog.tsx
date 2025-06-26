
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface NewItem {
  name: string;
  sku: string;
  category: string;
  currentStock: string;
  reorderPoint: string;
  maxQuantity: string;
  vendor: string;
  lastPrice: string;
}

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newItem: NewItem;
  setNewItem: (item: NewItem) => void;
  onAddItem: () => void;
}

export const AddItemDialog = ({
  isOpen,
  onOpenChange,
  newItem,
  setNewItem,
  onAddItem
}: AddItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Add New Item</DialogTitle>
          <DialogDescription className="text-gray-600">
            Add a new item to your inventory
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-gray-700">Item Name</Label>
            <Input
              id="name"
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="Enter item name"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sku" className="text-gray-700">SKU</Label>
            <Input
              id="sku"
              value={newItem.sku}
              onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
              placeholder="Enter SKU"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="category" className="text-gray-700">Category</Label>
            <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="clinical">Clinical</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currentStock" className="text-gray-700">Current Stock</Label>
              <Input
                id="currentStock"
                type="number"
                value={newItem.currentStock}
                onChange={(e) => setNewItem({...newItem, currentStock: e.target.value})}
                placeholder="0"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="reorderPoint" className="text-gray-700">Reorder Point</Label>
              <Input
                id="reorderPoint"
                type="number"
                value={newItem.reorderPoint}
                onChange={(e) => setNewItem({...newItem, reorderPoint: e.target.value})}
                placeholder="0"
                className="mt-1"
              />
            </div>
          </div>
          <Button onClick={onAddItem} className="w-full">
            Add Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
