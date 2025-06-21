
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Edit, Copy, Trash2, Eye, Download } from "lucide-react";

export const FormTemplates = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Mock data for form templates
  const formTemplates = [
    {
      id: "1",
      name: "New Patient Intake",
      category: "intake",
      description: "Comprehensive intake form for new patients",
      fields: 25,
      usageCount: 156,
      lastModified: "2024-01-10",
      status: "active"
    },
    {
      id: "2",
      name: "Pre-Visit Questionnaire",
      category: "screening",
      description: "Quick health screening before appointments",
      fields: 12,
      usageCount: 89,
      lastModified: "2024-01-08",
      status: "active"
    },
    {
      id: "3",
      name: "Medical History Update",
      category: "medical",
      description: "Annual medical history review form",
      fields: 18,
      usageCount: 67,
      lastModified: "2024-01-05",
      status: "active"
    },
    {
      id: "4",
      name: "Insurance Verification",
      category: "administrative",
      description: "Insurance details and verification form",
      fields: 8,
      usageCount: 134,
      lastModified: "2024-01-03",
      status: "active"
    },
    {
      id: "5",
      name: "Consent Forms Package",
      category: "legal",
      description: "Complete consent and authorization forms",
      fields: 15,
      usageCount: 201,
      lastModified: "2023-12-28",
      status: "active"
    },
    {
      id: "6",
      name: "Pediatric Intake",
      category: "intake",
      description: "Specialized intake form for pediatric patients",
      fields: 30,
      usageCount: 45,
      lastModified: "2023-12-20",
      status: "draft"
    }
  ];

  const getCategoryBadge = (category: string) => {
    const colors = {
      intake: "bg-blue-100 text-blue-700",
      screening: "bg-green-100 text-green-700",
      medical: "bg-red-100 text-red-700",
      administrative: "bg-yellow-100 text-yellow-700",
      legal: "bg-purple-100 text-purple-700"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  const getStatusBadge = (status: string) => {
    return status === "active" 
      ? <Badge className="bg-green-100 text-green-700">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
  };

  const filteredTemplates = formTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleImportTemplate = () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.xml,.csv';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        console.log('Importing template file:', file.name);
        // TODO: Implement actual file import logic
        alert(`Would import template from: ${file.name}`);
      }
    };
    input.click();
  };

  const handleBulkExport = () => {
    console.log('Exporting all templates as ZIP');
    // TODO: Implement actual bulk export logic
    alert('Would export all templates as ZIP file');
  };

  const handleGoToFormBuilder = () => {
    // Navigate to form builder tab
    const event = new CustomEvent('changeIntakeTab', { detail: 'builder' });
    window.dispatchEvent(event);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Form Templates</CardTitle>
              <CardDescription>Create and manage reusable intake form templates</CardDescription>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="intake">Intake</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="medical">Medical</SelectItem>
                <SelectItem value="administrative">Administrative</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getCategoryBadge(template.category)}>
                      {template.category}
                    </Badge>
                    {getStatusBadge(template.status)}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{template.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Fields:</span> {template.fields}
                </div>
                <div>
                  <span className="font-medium">Usage:</span> {template.usageCount}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">Modified:</span> {template.lastModified}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No templates found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={handleImportTemplate}
            >
              <div className="text-left">
                <div className="font-medium">Import Template</div>
                <div className="text-sm text-gray-600">Upload form template from file</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={handleBulkExport}
            >
              <div className="text-left">
                <div className="font-medium">Bulk Export</div>
                <div className="text-sm text-gray-600">Export all templates as ZIP</div>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="justify-start h-auto p-4"
              onClick={handleGoToFormBuilder}
            >
              <div className="text-left">
                <div className="font-medium">Form Builder</div>
                <div className="text-sm text-gray-600">Create custom form from scratch</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
