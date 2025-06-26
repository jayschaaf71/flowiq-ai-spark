
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

interface TemplateFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCreateNew: () => void;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "appointment", label: "Appointments" },
  { value: "onboarding", label: "Onboarding" },
  { value: "followup", label: "Follow-up" },
  { value: "insurance", label: "Insurance" },
  { value: "billing", label: "Billing" }
];

export const TemplateFilters: React.FC<TemplateFiltersProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onCreateNew
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={onCreateNew}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>
    </div>
  );
};
