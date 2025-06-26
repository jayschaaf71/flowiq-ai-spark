
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, TrendingUp } from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  maxQuantity: number;
  vendor: string;
  lastPrice: number;
  status: string;
  expiryDate: string | null;
  usageRate: string;
}

interface InventoryItemListProps {
  items: InventoryItem[];
  onReorderNow: (itemName: string) => void;
  onSuggestReorder: (itemName: string) => void;
  onEditItem: (itemId: string) => void;
}

export const InventoryItemList = ({
  items,
  onReorderNow,
  onSuggestReorder,
  onEditItem
}: InventoryItemListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800";
      case "low": return "bg-yellow-100 text-yellow-800";
      case "optimal": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "critical": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <TrendingUp className="w-4 h-4" />;
      case "optimal": return <Package className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(item.status)}
                  <h3 className="font-semibold">{item.name}</h3>
                  <Badge variant="outline">{item.sku}</Badge>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Current Stock:</span>
                    <span className="ml-1">{item.currentStock}</span>
                  </div>
                  <div>
                    <span className="font-medium">Reorder Point:</span>
                    <span className="ml-1">{item.reorderPoint}</span>
                  </div>
                  <div>
                    <span className="font-medium">Usage Rate:</span>
                    <span className="ml-1">{item.usageRate}</span>
                  </div>
                  <div>
                    <span className="font-medium">Vendor:</span>
                    <span className="ml-1">{item.vendor}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {item.status === "critical" && (
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => onReorderNow(item.name)}
                  >
                    Reorder Now
                  </Button>
                )}
                {item.status === "low" && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-yellow-500 text-yellow-600"
                    onClick={() => onSuggestReorder(item.name)}
                  >
                    Suggest Reorder
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEditItem(item.id)}
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
