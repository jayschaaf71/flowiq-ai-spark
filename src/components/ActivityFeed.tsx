
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export const ActivityFeed = () => {
  const activities = [
    {
      title: "Customer Onboarding Flow",
      description: "was optimized by AI",
      time: "2 hours ago",
      color: "blue"
    },
    {
      title: "Lead Qualification Pipeline",
      description: "completed 15 new leads",
      time: "4 hours ago",
      color: "emerald"
    },
    {
      title: "Sarah Wilson",
      description: "created a new workflow template",
      time: "1 day ago",
      color: "purple"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Track your team's workflow interactions and AI optimizations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className={`flex items-center gap-3 p-3 bg-${activity.color}-50 rounded-lg`}>
              <div className={`h-2 w-2 bg-${activity.color}-500 rounded-full`}></div>
              <span className="text-sm">
                <strong>{activity.title}</strong> {activity.description}
              </span>
              <span className="text-xs text-gray-500 ml-auto">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
