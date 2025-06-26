
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  status: string;
  lastSync: string;
  itemsCount: number;
}

interface NewVendor {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface VendorManagementProps {
  vendors: Vendor[];
  isAddVendorOpen: boolean;
  setIsAddVendorOpen: (open: boolean) => void;
  newVendor: NewVendor;
  setNewVendor: (vendor: NewVendor) => void;
  onAddVendor: () => void;
  onSyncVendor: (vendorName: string) => void;
  onVendorSettings: (vendorName: string) => void;
}

export const VendorManagement = ({
  vendors,
  isAddVendorOpen,
  setIsAddVendorOpen,
  newVendor,
  setNewVendor,
  onAddVendor,
  onSyncVendor,
  onVendorSettings
}: VendorManagementProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Connected Vendors</h3>
        <Dialog open={isAddVendorOpen} onOpenChange={setIsAddVendorOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>
                Add a new vendor to your system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vendorName">Vendor Name</Label>
                <Input
                  id="vendorName"
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="Enter vendor name"
                />
              </div>
              <div>
                <Label htmlFor="vendorEmail">Email</Label>
                <Input
                  id="vendorEmail"
                  type="email"
                  value={newVendor.email}
                  onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                  placeholder="vendor@example.com"
                />
              </div>
              <div>
                <Label htmlFor="vendorPhone">Phone</Label>
                <Input
                  id="vendorPhone"
                  value={newVendor.phone}
                  onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                  placeholder="(555) 123-4567"
                />
              </div>
              <Button onClick={onAddVendor} className="w-full">
                Add Vendor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map((vendor) => (
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
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => onSyncVendor(vendor.name)}
                >
                  Sync Now
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onVendorSettings(vendor.name)}
                >
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
