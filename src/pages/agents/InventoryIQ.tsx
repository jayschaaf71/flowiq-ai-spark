import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, TrendingUp, Package, Brain } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { InventoryStatsCards } from "@/components/inventory/InventoryStatsCards";
import { InventorySearchFilters } from "@/components/inventory/InventorySearchFilters";
import { AddItemDialog } from "@/components/inventory/AddItemDialog";
import { InventoryItemList } from "@/components/inventory/InventoryItemList";
import { CreateOrderDialog } from "@/components/inventory/CreateOrderDialog";
import { VendorManagement } from "@/components/inventory/VendorManagement";
import { PurchaseOrdersList } from "@/components/inventory/PurchaseOrdersList";
import { AIInventoryEngine } from "@/components/inventory/AIInventoryEngine";
import { SmartPricingEngine } from "@/components/inventory/SmartPricingEngine";
import { mockInventoryItems } from "@/data/inventoryMockData";
import { useVendors, type NewVendor } from "@/hooks/useVendors";

export default function InventoryIQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isAddVendorOpen, setIsAddVendorOpen] = useState(false);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  
  // Use the vendors hook
  const {
    vendors,
    purchaseOrders,
    vendorsLoading,
    ordersLoading,
    addVendor,
    createOrder,
    syncVendor,
    isAddingVendor,
    isCreatingOrder
  } = useVendors();

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

  const [newVendor, setNewVendor] = useState<NewVendor>({
    name: "",
    email: "",
    phone: "",
    address_line1: "",
    city: "",
    state: "",
    zip_code: "",
    contact_person: ""
  });

  const [newOrder, setNewOrder] = useState({
    vendor_id: "",
    order_type: "regular",
    priority: "normal",
    notes: ""
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
    if (!newOrder.vendor_id) {
      toast.error("Please select a vendor");
      return;
    }
    
    createOrder({
      vendor_id: newOrder.vendor_id,
      order_type: newOrder.order_type,
      priority: newOrder.priority,
      notes: newOrder.notes
    });
    
    setIsCreateOrderOpen(false);
    setNewOrder({
      vendor_id: "",
      order_type: "regular",
      priority: "normal",
      notes: ""
    });
  };

  const handleAddVendor = () => {
    if (!newVendor.name || !newVendor.email) {
      toast.error("Please fill in required fields");
      return;
    }
    
    addVendor(newVendor);
    setIsAddVendorOpen(false);
    setNewVendor({
      name: "",
      email: "",
      phone: "",
      address_line1: "",
      city: "",
      state: "",
      zip_code: "",
      contact_person: ""
    });
  };

  const handleSyncVendor = (vendorId: string) => {
    syncVendor(vendorId);
  };

  const handleVendorSettings = (vendorId: string) => {
    toast.info("Vendor settings coming soon!");
    console.log("Vendor settings clicked for:", vendorId);
  };

  const handleViewOrder = (orderId: string) => {
    toast.info("Order details view coming soon!");
    console.log("View order clicked for:", orderId);
  };

  const handleEditOrder = (orderId: string) => {
    toast.info("Edit order functionality coming soon!");
    console.log("Edit order clicked for:", orderId);
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

      <Tabs defaultValue="ai-insights" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="pricing">Smart Pricing</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-insights" className="space-y-4">
          <AIInventoryEngine 
            inventoryItems={filteredItems}
            vendors={vendors}
            purchaseOrders={purchaseOrders}
          />
        </TabsContent>

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
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Track your recent and pending orders
                  </CardDescription>
                </div>
                <CreateOrderDialog
                  isOpen={isCreateOrderOpen}
                  onOpenChange={setIsCreateOrderOpen}
                  newOrder={newOrder}
                  setNewOrder={setNewOrder}
                  vendors={vendors}
                  onCreateOrder={handleCreateOrder}
                  isCreatingOrder={isCreatingOrder}
                />
              </div>
            </CardHeader>
            <CardContent>
              <PurchaseOrdersList
                orders={purchaseOrders}
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <VendorManagement
            vendors={vendors}
            isAddVendorOpen={isAddVendorOpen}
            setIsAddVendorOpen={setIsAddVendorOpen}
            newVendor={newVendor}
            setNewVendor={setNewVendor}
            onAddVendor={handleAddVendor}
            onSyncVendor={handleSyncVendor}
            onVendorSettings={handleVendorSettings}
            isAddingVendor={isAddingVendor}
            vendorsLoading={vendorsLoading}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <SmartPricingEngine 
            inventoryItems={filteredItems}
            vendors={vendors}
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
      </Tabs>
    </div>
  );
}
