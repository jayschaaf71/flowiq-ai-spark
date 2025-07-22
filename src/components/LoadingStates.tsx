
import { Loader2, Calendar, Users, FileText } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "md",
  className = ""
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

export const DashboardSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Header */}
    <div className="space-y-2">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Main Content */}
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const PatientListSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: 8 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const AppointmentListSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-muted-foreground" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    ))}
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
);

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon = FileText, 
  title, 
  description, 
  action,
  className = ""
}: EmptyStateProps) => (
  <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
    <Icon className="w-12 h-12 text-muted-foreground mb-4" />
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground mb-4 max-w-md">{description}</p>
    {action}
  </div>
);
