
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, AlertCircle, CheckCircle, Search, Filter } from "lucide-react";

export const TaskQueue = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const tasks = [
    {
      id: "TSK-001",
      title: "Process patient intake form",
      agent: "Intake iQ",
      priority: "high",
      status: "in-progress",
      assignedTime: "2024-01-15 09:30 AM",
      estimatedCompletion: "5 minutes",
      patient: "Sarah Wilson"
    },
    {
      id: "TSK-002",
      title: "Send appointment reminders",
      agent: "Remind iQ",
      priority: "medium",
      status: "queued",
      assignedTime: "2024-01-15 10:00 AM",
      estimatedCompletion: "2 minutes",
      patient: "Multiple patients"
    },
    {
      id: "TSK-003",
      title: "Verify insurance eligibility",
      agent: "Billing iQ",
      priority: "high",
      status: "failed",
      assignedTime: "2024-01-15 08:45 AM",
      estimatedCompletion: "10 minutes",
      patient: "John Doe"
    },
    {
      id: "TSK-004",
      title: "Schedule follow-up appointment",
      agent: "Schedule iQ",
      priority: "low",
      status: "completed",
      assignedTime: "2024-01-15 09:15 AM",
      estimatedCompletion: "3 minutes",
      patient: "Mike Johnson"
    },
    {
      id: "TSK-005",
      title: "Generate medical summary",
      agent: "Scribe iQ",
      priority: "medium",
      status: "queued",
      assignedTime: "2024-01-15 10:15 AM",
      estimatedCompletion: "8 minutes",
      patient: "Emma Davis"
    },
    {
      id: "TSK-006",
      title: "Submit insurance claim",
      agent: "Claims iQ",
      priority: "high",
      status: "in-progress",
      assignedTime: "2024-01-15 09:45 AM",
      estimatedCompletion: "12 minutes",
      patient: "Robert Brown"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-600" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "failed": return "bg-red-100 text-red-800";
      case "queued": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Task Queue Management</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            Prioritize Queue
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search tasks, patients, or agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="queued">Queued</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Task Queue ({filteredTasks.length} tasks)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-muted-foreground">{task.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{task.agent}</Badge>
                  </TableCell>
                  <TableCell>{task.patient}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {task.assignedTime}
                  </TableCell>
                  <TableCell className="text-sm">
                    {task.estimatedCompletion}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {task.status === "failed" && (
                        <Button variant="outline" size="sm">
                          Retry
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
