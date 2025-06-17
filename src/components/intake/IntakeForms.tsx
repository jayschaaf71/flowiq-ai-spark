
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Download, Send, Clock, CheckCircle, AlertCircle } from "lucide-react";

export const IntakeForms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data for intake forms
  const intakeForms = [
    {
      id: "1",
      patientName: "Sarah Johnson",
      formType: "New Patient Intake",
      status: "completed",
      submittedAt: "2024-01-15 10:30 AM",
      completionTime: "12 minutes",
      aiScore: 95
    },
    {
      id: "2",
      patientName: "Michael Chen",
      formType: "Pre-Visit Questionnaire",
      status: "pending",
      submittedAt: "2024-01-15 09:15 AM",
      completionTime: "8 minutes",
      aiScore: null
    },
    {
      id: "3",
      patientName: "Emily Rodriguez",
      formType: "Medical History Update",
      status: "incomplete",
      submittedAt: "2024-01-14 4:22 PM",
      completionTime: "5 minutes",
      aiScore: null
    },
    {
      id: "4",
      patientName: "David Wilson",
      formType: "Insurance Verification",
      status: "completed",
      submittedAt: "2024-01-14 2:10 PM",
      completionTime: "6 minutes",
      aiScore: 88
    },
    {
      id: "5",
      patientName: "Lisa Thompson",
      formType: "Consent Forms",
      status: "pending",
      submittedAt: "2024-01-14 11:45 AM",
      completionTime: "3 minutes",
      aiScore: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "incomplete":
        return <Badge className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" />Incomplete</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredForms = intakeForms.filter(form => {
    const matchesSearch = form.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.formType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Active Intake Forms</CardTitle>
          <CardDescription>Manage and track patient intake form submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search patients or form types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Forms List */}
          <div className="space-y-4">
            {filteredForms.map((form) => (
              <div key={form.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{form.patientName}</h3>
                      {getStatusBadge(form.status)}
                      {form.aiScore && (
                        <Badge className="bg-purple-100 text-purple-700">
                          AI Score: {form.aiScore}%
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><span className="font-medium">Form:</span> {form.formType}</div>
                      <div><span className="font-medium">Submitted:</span> {form.submittedAt}</div>
                      <div><span className="font-medium">Completion Time:</span> {form.completionTime}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {form.status === "completed" && (
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    )}
                    {form.status === "incomplete" && (
                      <Button variant="outline" size="sm">
                        <Send className="w-4 h-4 mr-1" />
                        Remind
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredForms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No forms found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
