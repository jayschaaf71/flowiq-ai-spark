
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Barcode } from "lucide-react";

interface InventorySearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  onAddItem: () => void;
  onScanBarcode: () => void;
}

export const InventorySearchFilters = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  onAddItem,
  onScanBarcode
}: InventorySearchFiltersProps) => {
  return (
    <div className="flex gap-4 items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search items or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="clinical">Clinical</SelectItem>
          <SelectItem value="office">Office</SelectItem>
          <SelectItem value="retail">Retail</SelectItem>
        </SelectContent>
      </Select>
      
      <Button onClick={onAddItem}>
        <Plus className="w-4 h-4 mr-2" />
        Add Item
      </Button>
      
      <Button variant="outline" onClick={onScanBarcode}>
        <Barcode className="w-4 h-4 mr-2" />
        Scan
      </Button>
    </div>
  );
};
