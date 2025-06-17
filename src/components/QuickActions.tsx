
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Zap, TrendingUp, ChevronRight } from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      title: "Create Workflow",
      description: "Build intelligent automation",
      icon: Plus,
      color: "blue",
      href: "/workflows"
    },
    {
      title: "AI Optimization",
      description: "Enhance existing flows",
      icon: Zap,
      color: "purple",
      href: "/ai-insights"
    },
    {
      title: "Analytics",
      description: "View performance insights",
      icon: TrendingUp,
      color: "emerald",
      href: "/analytics"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {actions.map((action, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-${action.color}-100 rounded-lg group-hover:bg-${action.color}-200 transition-colors`}>
                <action.icon className={`h-5 w-5 text-${action.color}-600`} />
              </div>
              <div>
                <h3 className="font-semibold">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
