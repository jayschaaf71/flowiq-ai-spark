
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, TrendingUp, Package } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { InventoryStatsCards } from "@/components/inventory/InventoryStatsCards";
import { InventorySearchFilters } from "@/components/inventory/InventorySearchFilters";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { InventoryItemList } from "@/components/inventory/InventoryItemList";
import { CreateOrderDialog } from "@/components/inventory/CreateOrderDialog";
import { VendorManagement } from "@/components/inventory/VendorManagement";
import { mockInventoryItems, mockVendors } from "@/data/inventoryMockData";

export default function InventoryIQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  
  // Form states
  const [newItem, setNewItem] = useState({
    name: "",
    sku: "",
    category: "clinical",
    currentStock: "",
    reorderPoint: "",
    maxQuantity: "",
    vendor: "",
    lastPrice: ""
  });

  const [newVendor, setNewVendor] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  const [newOrder, setNewOrder] = useState({
    vendor: "",
    orderType: "regular",
    priority: "normal",
    notes: "",
    items: []
  });

  const handleAddItem = () => {
    console.log("Adding new item:", newItem);
    toast.success("Item added successfully!");
    setIsAddItemOpen(false);
    setNewItem({
      name: "",
      sku: "",
      category: "clinical",
      currentStock: "",
      reorderPoint: "",
      maxQuantity: "",
      vendor: "",
      lastPrice: ""
    });
  };

  const handleScanBarcode = () => {
    toast.info("Barcode scanner feature coming soon!");
    console.log("Barcode scan initiated");
  };

  const handleReorderNow = (itemName: string) => {
    toast.success(`Reorder initiated for ${itemName}`);
    console.log("Reorder now clicked for:", itemName);
  };

  const handleSuggestReorder = (itemName: string) => {
    toast.info(`Reorder suggestion created for ${itemName}`);
    console.log("Suggest reorder clicked for:", itemName);
  };

  const handleEditItem = (itemId: string) => {
    toast.info("Edit item functionality coming soon!");
    console.log("Edit item clicked for ID:", itemId);
  };

  const handleCreateOrder = () => {
    if (!newOrder.vendor) {
      toast.error("Please select a vendor");
      return;
    }
    
    console.log("Creating order:", newOrder);
    toast.success(`Order created successfully for ${newOrder.vendor}!`);
    setIsCreateOrderOpen(false);
    setNewOrder({
      vendor: "",
      orderType: "regular",
      priority: "normal",
      notes: "",
      items: []
    });
  };

  const handleAddVendor = () => {
    console.log("Adding new vendor:", newVendor);
    toast.success("Vendor added successfully!");
    setIsAddVendorOpen(false);
    setNewVendor({
      name: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  const handleSyncVendor = (vendorName: string) => {
    toast.success(`${vendorName} synced successfully!`);
    console.log("Sync vendor clicked for:", vendorName);
  };

  const handleVendorSettings = (vendorName: string) => {
    toast.info("Vendor settings coming soon!");
    console.log("Vendor settings clicked for:", vendorName);
  };

  const filteredItems = mockInventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory iQ"
        subtitle="AI-powered inventory management for your practice"
        badge="AI"
      />

      <InventoryStatsCards />

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <InventorySearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            onAddItem={() => setIsAddItemOpen(true)}
            onScanBarcode={handleScanBarcode}
          />

          <AddItemDialog
            isOpen={isAddItemOpen}
            onOpenChange={setIsAddItemOpen}
            newItem={newItem}
            setNewItem={setNewItem}
            onAddItem={handleAddItem}
          />

          <InventoryItemList
            items={filteredItems}
            onReorderNow={handleReorderNow}
            onSuggestReorder={handleSuggestReorder}
            onEditItem={handleEditItem}
          />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Track your recent and pending orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent orders found</p>
                <CreateOrderDialog
                  isOpen={isCreateOrderOpen}
                  onOpenChange={setIsCreateOrderOpen}
                  newOrder={newOrder}
                  setNewOrder={setNewOrder}
                  vendors={mockVendors}
                  onCreateOrder={handleCreateOrder}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <VendorManagement
            vendors={mockVendors}
            isAddVendorOpen={isAddVendorOpen}
            setIsAddVendorOpen={setIsAddVendorOpen}
            newVendor={newVendor}
            setNewVendor={setNewVendor}
            onAddVendor={handleAddVendor}
            onSyncVendor={handleSyncVendor}
            onVendorSettings={handleVendorSettings}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>
                AI-powered insights into your inventory patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Analytics dashboard coming soon</p>
                <p className="text-sm">Track usage patterns, cost savings, and optimization opportunities</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>
                Configure your inventory management preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Settings panel coming soon</p>
                <p className="text-sm">Configure reorder rules, vendor preferences, and automation settings</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
