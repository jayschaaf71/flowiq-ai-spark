
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  status: string;
  integration_status: string;
  last_sync_date?: string;
  items_count: number;
  vendor_number: string;
  email?: string;
  phone?: string;
  created_at: string;
}

interface NewVendor {
  name: string;
  email: string;
  phone: string;
  address_line1?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  contact_person?: string;
}

interface VendorManagementProps {
  vendors: Vendor[];
  isAddVendorOpen: boolean;
  setIsAddVendorOpen: (open: boolean) => void;
  newVendor: NewVendor;
  setNewVendor: (vendor: NewVendor) => void;
  onAddVendor: () => void;
  onSyncVendor: (vendorId: string) => void;
  onVendorSettings: (vendorId: string) => void;
  isAddingVendor?: boolean;
  vendorsLoading?: boolean;
}

export const VendorManagement = ({
  vendors,
  isAddVendorOpen,
  setIsAddVendorOpen,
  newVendor,
  setNewVendor,
  onAddVendor,
  onSyncVendor,
  onVendorSettings,
  isAddingVendor = false,
  vendorsLoading = false
}: VendorManagementProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "disconnected": return "bg-red-100 text-red-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatLastSync = (dateString?: string) => {
    if (!dateString) return "Never";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Connected Vendors</h3>
        <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
          <DialogTrigger asChild>
            <Button disabled={isAddingVendor}>
              {isAddingVendor ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Add New Vendor</DialogTitle>
              <DialogDescription className="text-gray-600">
                Add a new vendor to your system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendorName" className="text-gray-700">Vendor Name</Label>
                <Input
                  id="vendorName"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="Enter vendor name"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vendorEmail" className="text-gray-700">Email</Label>
                <Input
                  id="vendorEmail"
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  placeholder="vendor@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="vendorPhone" className="text-gray-700">Phone</Label>
                <Input
                  id="vendorPhone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPerson" className="text-gray-700">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={newVendor.contact_person || ''}
                  onChange={(e) => setNewVendor({...newVendor, contact_person: e.target.value})}
                  placeholder="Contact person name"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city" className="text-gray-700">City</Label>
                  <Input
                    id="city"
                    value={newVendor.city || ''}
                    onChange={(e) => setNewVendor({...newVendor, city: e.target.value})}
                    placeholder="City"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-gray-700">State</Label>
                  <Input
                    id="state"
                    value={newVendor.state || ''}
                    onChange={(e) => setNewVendor({...newVendor, state: e.target.value})}
                    placeholder="State"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button 
                onClick={onAddVendor} 
                className="w-full"
                disabled={isAddingVendor || !newVendor.name || !newVendor.email}
              >
                {isAddingVendor ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding Vendor...
                  </>
                ) : (
                  "Add Vendor"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {vendorsLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{vendor.name}</h4>
                    <p className="text-sm text-gray-500">{vendor.vendor_number}</p>
                  </div>
                  <Badge className={getStatusColor(vendor.integration_status)}>
                    {vendor.integration_status}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Items:</span>
                    <span className="ml-1">{vendor.items_count}</span>
                  </div>
                  <div>
                    <span className="font-medium">Last Sync:</span>
                    <span className="ml-1">{formatLastSync(vendor.last_sync_date)}</span>
                  </div>
                  {vendor.email && (
                    <div>
                      <span className="font-medium">Email:</span>
                      <span className="ml-1 text-xs">{vendor.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => onSyncVendor(vendor.id)}
                  >
                    Sync Now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onVendorSettings(vendor.id)}
                  >
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {vendors.length === 0 && !vendorsLoading && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <p>No vendors found. Add your first vendor to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
