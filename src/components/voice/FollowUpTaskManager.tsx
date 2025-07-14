import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Clock, User, MessageSquare, Phone, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface FollowUpTask {
  id: string;
  task_type: string;
  task_status: string;
  scheduled_for: string;
  message_template: string;
  attempts: number;
  max_attempts: number;
  created_at: string;
  patient: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  call_outcomes: {
    outcome_type: string;
    ai_summary: string;
    voice_calls: {
      call_type: string;
      call_duration: number;
    };
  };
}

interface FollowUpTaskManagerProps {
  onTaskUpdate: () => void;
}

export const FollowUpTaskManager = ({ onTaskUpdate }: FollowUpTaskManagerProps) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<FollowUpTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('follow_up_tasks')
        .select(`
          *,
          patient:patients!patient_id(first_name, last_name, phone, email),
          call_outcomes!call_outcome_id(
            outcome_type,
            ai_summary,
            voice_calls!call_id(call_type, call_duration)
          )
        `)
        .order('scheduled_for', { ascending: true });

      if (error) throw error;

      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load follow-up tasks",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeTask = async (taskId: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-follow-up-tasks', {
        body: { 
          trigger: 'manual',
          task_id: taskId
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task executed successfully",
      });

      fetchTasks();
      onTaskUpdate();
    } catch (error) {
      console.error('Error executing task:', error);
      toast({
        title: "Error",
        description: "Failed to execute task",
        variant: "destructive",
      });
    }
  };

  const cancelTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('follow_up_tasks')
        .update({ task_status: 'cancelled' })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Task cancelled successfully",
      });

      fetchTasks();
      onTaskUpdate();
    } catch (error) {
      console.error('Error cancelling task:', error);
      toast({
        title: "Error",
        description: "Failed to cancel task",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'call':
        return <Phone className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.patient?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.patient?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.patient?.phone?.includes(searchTerm);

    const matchesStatus = statusFilter === "all" || task.task_status === statusFilter;
    const matchesType = typeFilter === "all" || task.task_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const isOverdue = (scheduledFor: string, taskStatus: string) => {
    return new Date(scheduledFor) < new Date() && taskStatus === 'pending';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-lg">Loading follow-up tasks...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Follow-up Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by patient name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:max-w-sm"
            />
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="appointment_reminder">Appointment Reminder</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No follow-up tasks found</h3>
              <p className="text-gray-500">
                {tasks.length === 0 
                  ? "No follow-up tasks have been created yet."
                  : "No tasks match your current filters."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card 
              key={task.id} 
              className={`hover:shadow-md transition-shadow ${
                isOverdue(task.scheduled_for, task.task_status) ? 'border-red-200 bg-red-50/50' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        {getTaskIcon(task.task_type)}
                        <span className="font-medium">
                          {task.patient ? `${task.patient.first_name} ${task.patient.last_name}` : 'Unknown Patient'}
                        </span>
                      </div>
                      <Badge variant="outline">
                        {task.task_type.replace('_', ' ')}
                      </Badge>
                      <Badge className={getStatusColor(task.task_status)}>
                        {task.task_status}
                      </Badge>
                      {isOverdue(task.scheduled_for, task.task_status) && (
                        <Badge variant="destructive">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{task.patient?.phone || 'No phone'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>
                            Scheduled: {format(new Date(task.scheduled_for), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        {task.attempts > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Attempts: {task.attempts}/{task.max_attempts}
                          </div>
                        )}
                      </div>

                      {task.call_outcomes && (
                        <div className="space-y-2">
                          <Badge className="bg-blue-100 text-blue-800">
                            {task.call_outcomes.outcome_type.replace('_', ' ')}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {task.call_outcomes.voice_calls?.call_type} call
                          </div>
                        </div>
                      )}
                    </div>

                    {task.message_template && (
                      <div className="bg-muted/50 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">Message Template</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.message_template}
                        </p>
                      </div>
                    )}

                    {task.call_outcomes?.ai_summary && (
                      <div className="bg-muted/30 rounded-lg p-3 mb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm font-medium">Call Summary</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {task.call_outcomes.ai_summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-4">
                    {task.task_status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => executeTask(task.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Execute
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => cancelTask(task.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};