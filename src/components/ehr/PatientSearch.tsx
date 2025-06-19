
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface SearchFilters {
  searchTerm: string;
  ageRange: string;
  gender: string;
  insuranceStatus: string;
  lastVisitDate: Date | undefined;
}

interface PatientSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  totalResults: number;
}

export const PatientSearch = ({ onFiltersChange, totalResults }: PatientSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    ageRange: "",
    gender: "",
    insuranceStatus: "",
    lastVisitDate: undefined,
  });

  const [showFilters, setShowFilters] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange(updated);
  };

  const clearFilters = () => {
    const cleared = {
      searchTerm: "",
      ageRange: "",
      gender: "",
      insuranceStatus: "",
      lastVisitDate: undefined,
    };
    setFilters(cleared);
    onFiltersChange(cleared);
    setShowFilters(false);
  };

  const activeFilterCount = Object.values(filters).filter(value => 
    value && value !== ""
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, phone, or patient number..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Age Range</label>
              <Select value={filters.ageRange} onValueChange={(value) => updateFilters({ ageRange: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Any age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any age</SelectItem>
                  <SelectItem value="0-17">0-17 years</SelectItem>
                  <SelectItem value="18-30">18-30 years</SelectItem>
                  <SelectItem value="31-50">31-50 years</SelectItem>
                  <SelectItem value="51-70">51-70 years</SelectItem>
                  <SelectItem value="70+">70+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Gender</label>
              <Select value={filters.gender} onValueChange={(value) => updateFilters({ gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Any gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any gender</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non_binary">Non-binary</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Insurance</label>
              <Select value={filters.insuranceStatus} onValueChange={(value) => updateFilters({ insuranceStatus: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any status</SelectItem>
                  <SelectItem value="insured">Has Insurance</SelectItem>
                  <SelectItem value="uninsured">No Insurance</SelectItem>
                  <SelectItem value="expired">Expired Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Last Visit</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.lastVisitDate ? format(filters.lastVisitDate, "MMM d, yyyy") : "Any date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={filters.lastVisitDate}
                    onSelect={(date) => updateFilters({ lastVisitDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{totalResults} patient{totalResults !== 1 ? 's' : ''} found</span>
        {activeFilterCount > 0 && (
          <span>Filters applied: {activeFilterCount}</span>
        )}
      </div>
    </div>
  );
};
