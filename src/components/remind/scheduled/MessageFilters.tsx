
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface MessageFiltersProps {
  filter: string;
  onFilterChange: (value: string) => void;
}

export const MessageFilters: React.FC<MessageFiltersProps> = ({
  filter,
  onFilterChange
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold">Scheduled Messages</h2>
        <p className="text-gray-600">Manage upcoming and sent messages</p>
      </div>
      <div className="flex items-center gap-2">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Messages</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
