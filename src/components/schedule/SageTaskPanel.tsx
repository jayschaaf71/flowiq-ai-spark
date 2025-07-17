import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertTriangle, Users, Calendar } from 'lucide-react';
import { useSageCalendarTasks } from '@/hooks/useSageCalendarTasks';
import { useAppointmentPreparation } from '@/hooks/useAppointmentPreparation';
import { format } from 'date-fns';

interface SageTaskPanelProps {
  className?: string;
}

export const SageTaskPanel: React.FC<SageTaskPanelProps> = ({ className }) => {
  const { tasks, completeTask, isLoading: tasksLoading } = useSageCalendarTasks();
  const { 
    getIncompleteAppointments, 
    getUnconfirmedAppointments,
    isLoading: prepLoading 
  } = useAppointmentPreparation();

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const incompletePrep = getIncompleteAppointments();
  const unconfirmed = getUnconfirmedAppointments();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'secondary';
      case 'medium': return 'outline';
      default: return 'default';
    }
  };

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case 'appointment_reminder': return <Calendar className="h-4 w-4" />;
      case 'insurance_verification': return <Users className="h-4 w-4" />;
      case 'intake_follow_up': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (tasksLoading || prepLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-primary" />
          SAGE Intelligence Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{pendingTasks.length}</div>
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-destructive">{incompletePrep.length}</div>
            <div className="text-sm text-muted-foreground">Incomplete Prep</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-secondary">{unconfirmed.length}</div>
            <div className="text-sm text-muted-foreground">Unconfirmed</div>
          </div>
        </div>

        {/* Recent SAGE Tasks */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent SAGE Tasks
          </h4>
          
          {pendingTasks.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-success" />
              All tasks completed!
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {pendingTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="p-3 border rounded-lg bg-card">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getTaskIcon(task.task_type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {task.task_description}
                        </p>
                        {task.due_date && (
                          <p className="text-xs text-muted-foreground">
                            Due: {format(new Date(task.due_date), 'MMM d, h:mm a')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => completeTask(task.id)}
                        className="h-8 w-8 p-0"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Generate Daily Brief
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};