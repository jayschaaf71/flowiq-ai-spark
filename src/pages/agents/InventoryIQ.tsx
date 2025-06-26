
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingCart, 
  Search,
  Plus,
  Barcode,
  Filter
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function InventoryIQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const mockInventoryItems = [
    {
      id: "1",
      name: "Surgical Gloves (Large)",
      sku: "GLV-L-001",
      category: "Clinical",
      currentStock: 250,
      reorderPoint: 500,
      maxQuantity: 2000,
      vendor: "Henry Schein",
      lastPrice: 89.99,
      status: "critical",
      expiryDate: "2025-12-31",
      usageRate: "45/week"
    },
    {
      id: "2", 
      name: "Dental Impression Material",
      sku: "DIM-ALG-002",
      category: "Clinical",
      currentStock: 12,
      reorderPoint: 20,
      maxQuantity: 100,
      vendor: "Patterson Dental",
      lastPrice: 156.50,
      status: "low",
      expiryDate: "2026-03-15",
      usageRate: "8/week"
    },
    {
      id: "3",
      name: "Office Paper (A4)",
      sku: "PPR-A4-003",
      category: "Office",
      currentStock: 150,
      reorderPoint: 50,
      maxQuantity: 500,
      vendor: "Amazon Business",
      lastPrice: 45.99,
      status: "optimal",
      expiryDate: null,
      usageRate: "15/week"
    }
  ];

  const mockVendors = [
    {
      id: "1",
      name: "Henry Schein",
      status: "connected",
      lastSync: "2024-06-26 08:30 AM",
      itemsCount: 1250
    },
    {
      id: "2",
      name: "Patterson Dental", 
      status: "connected",
      lastSync: "2024-06-26 07:45 AM",
      itemsCount: 890
    },
    {
      id: "3",
      name: "Amazon Business",
      status: "pending",
      lastSync: "Never",
      itemsCount: 0
    }
  ];

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
        description="AI-powered inventory management for your practice"
        badge="AI"
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">247</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Stock</p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Spend</p>
                <p className="text-2xl font-bold">$3,247</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filters */}
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
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="clinical">Clinical</option>
              <option value="office">Office</option>
              <option value="retail">Retail</option>
            </select>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
            <Button variant="outline">
              <Barcode className="w-4 h-4 mr-2" />
              Scan
            </Button>
          </div>

          {/* Inventory Items */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
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
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Reorder Now
                        </Button>
                      )}
                      {item.status === "low" && (
                        <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-600">
                          Suggest Reorder
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Connected Vendors</h3>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockVendors.map((vendor) => (
              <Card key={vendor.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold">{vendor.name}</h4>
                    <Badge 
                      className={vendor.status === "connected" ? 
                        "bg-green-100 text-green-800" : 
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {vendor.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Items:</span>
                      <span className="ml-1">{vendor.itemsCount}</span>
                    </div>
                    <div>
                      <span className="font-medium">Last Sync:</span>
                      <span className="ml-1">{vendor.lastSync}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      Sync Now
                    </Button>
                    <Button size="sm" variant="outline">
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
