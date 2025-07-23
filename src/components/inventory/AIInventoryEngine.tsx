
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Zap, Target, Lightbulb } from "lucide-react";
import { toast } from "sonner";

interface AIInsight {
  id: string;
  type: 'reorder' | 'cost_optimization' | 'demand_forecast' | 'vendor_performance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
  potential_savings?: number;
  confidence_score: number;
  created_at: string;
}

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  supplier?: string;
}

interface Vendor {
  id: string;
  name: string;
  contact: string;
  deliveryTime: number;
  rating: number;
}

interface PurchaseOrder {
  id: string;
  vendorId: string;
  items: Array<{ itemId: string; quantity: number; price: number }>;
  status: string;
  orderDate: string;
  totalAmount: number;
}

interface AIInventoryEngineProps {
  inventoryItems: InventoryItem[];
  vendors: Vendor[];
  purchaseOrders: PurchaseOrder[];
}

export const AIInventoryEngine = ({ inventoryItems, vendors, purchaseOrders }: AIInventoryEngineProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock AI insights generation
  const generateAIInsights = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'reorder',
        priority: 'high',
        title: 'Critical Stock Alert',
        description: 'Surgical gloves inventory is critically low (12 units remaining)',
        recommendation: 'Immediate reorder of 500 units from MedSupply Pro',
        confidence_score: 95,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'cost_optimization',
        priority: 'medium',
        title: 'Cost Optimization Opportunity',
        description: 'Alternative vendor offers 15% savings on disposable syringes',
        recommendation: 'Consider switching to VendorPlus for next order',
        potential_savings: 280,
        confidence_score: 87,
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        type: 'demand_forecast',
        priority: 'low',
        title: 'Seasonal Demand Prediction',
        description: 'Expected 25% increase in wellness supplements demand next month',
        recommendation: 'Increase supplement orders by 30% to meet anticipated demand',
        confidence_score: 78,
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        type: 'vendor_performance',
        priority: 'medium',
        title: 'Vendor Performance Alert',
        description: 'HealthCore Supplies has 3 late deliveries in the past month',
        recommendation: 'Review contract terms or consider backup vendor',
        confidence_score: 91,
        created_at: new Date().toISOString()
      }
    ];
    
    setInsights(mockInsights);
    setIsAnalyzing(false);
    toast.success('AI analysis complete! Found 4 optimization opportunities.');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'reorder': return <AlertTriangle className="w-4 h-4" />;
      case 'cost_optimization': return <Target className="w-4 h-4" />;
      case 'demand_forecast': return <TrendingUp className="w-4 h-4" />;
      case 'vendor_performance': return <Zap className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApplyRecommendation = (insightId: string) => {
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      toast.success(`Applied recommendation: ${insight.title}`);
      // Here you would integrate with other agents/systems
      console.log('Integrating with other agents for:', insight);
    }
  };

  useEffect(() => {
    // Auto-generate insights when inventory data changes
    if (inventoryItems.length > 0) {
      generateAIInsights();
    }
  }, [inventoryItems.length]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <CardTitle>AI Inventory Intelligence</CardTitle>
            </div>
            <Button 
              onClick={generateAIInsights}
              disabled={isAnalyzing}
              variant="outline"
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </Button>
          </div>
          <CardDescription>
            AI-powered insights for optimal inventory management and cost savings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAnalyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-gray-600">Analyzing inventory patterns...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getInsightIcon(insight.type)}
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline">
                            {insight.confidence_score}% confidence
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                        <p className="text-sm font-medium text-green-700 mb-2">
                          💡 {insight.recommendation}
                        </p>
                        
                        {insight.potential_savings && (
                          <p className="text-sm text-blue-600">
                            💰 Potential savings: ${insight.potential_savings}/month
                          </p>
                        )}
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => handleApplyRecommendation(insight.id)}
                        className="ml-4"
                      >
                        Apply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {insights.length === 0 && !isAnalyzing && (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No insights available yet</p>
                  <p className="text-sm">Click "Refresh Analysis" to generate AI recommendations</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
