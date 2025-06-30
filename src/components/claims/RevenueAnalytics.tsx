
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComprehensiveRevenueAnalytics } from "./ComprehensiveRevenueAnalytics";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { Brain, BarChart3, TrendingUp, Zap } from "lucide-react";

export const RevenueAnalytics = () => {
  const [activeView, setActiveView] = useState("comprehensive");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Revenue Analytics</h2>
            <p className="text-gray-600">Advanced financial insights with AI-powered forecasting</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-700">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge className="bg-blue-100 text-blue-700">
            <BarChart3 className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
        </div>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="comprehensive">
            <Zap className="w-4 h-4 mr-2" />
            Advanced Analytics
          </TabsTrigger>
          <TabsTrigger value="traditional">Traditional View</TabsTrigger>
        </TabsList>

        <TabsContent value="comprehensive">
          <ComprehensiveRevenueAnalytics />
        </TabsContent>

        <TabsContent value="traditional">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart />
            <div className="space-y-4">
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                <p>Traditional revenue charts and basic metrics</p>
                <Button variant="outline" className="mt-4" onClick={() => setActiveView("comprehensive")}>
                  Switch to Advanced Analytics
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
