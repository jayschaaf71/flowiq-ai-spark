
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingDown, TrendingUp, Calculator } from "lucide-react";
import { toast } from "sonner";

interface PricingRecommendation {
  id: string;
  item_name: string;
  current_price: number;
  suggested_price: number;
  savings_percentage: number;
  vendor_comparison: {
    current_vendor: string;
    alternative_vendor: string;
    price_difference: number;
  };
  market_analysis: {
    market_average: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  confidence_score: number;
}

interface SmartPricingEngineProps {
  inventoryItems: any[];
  vendors: any[];
}

export const SmartPricingEngine = ({ inventoryItems, vendors }: SmartPricingEngineProps) => {
  const [recommendations, setRecommendations] = useState<PricingRecommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzePricing = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI pricing analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecommendations: PricingRecommendation[] = [
      {
        id: '1',
        item_name: 'Surgical Gloves (Box of 100)',
        current_price: 25.50,
        suggested_price: 22.80,
        savings_percentage: 10.6,
        vendor_comparison: {
          current_vendor: 'MedSupply Pro',
          alternative_vendor: 'HealthCore Direct',
          price_difference: 2.70
        },
        market_analysis: {
          market_average: 24.20,
          trend: 'decreasing'
        },
        confidence_score: 92
      },
      {
        id: '2',
        item_name: 'Disposable Syringes (Pack of 50)',
        current_price: 18.75,
        suggested_price: 16.25,
        savings_percentage: 13.3,
        vendor_comparison: {
          current_vendor: 'MedCore Systems',
          alternative_vendor: 'VendorPlus Medical',
          price_difference: 2.50
        },
        market_analysis: {
          market_average: 17.50,
          trend: 'stable'
        },
        confidence_score: 88
      },
      {
        id: '3',
        item_name: 'Wellness Supplements - Vitamin D',
        current_price: 32.00,
        suggested_price: 28.75,
        savings_percentage: 10.2,
        vendor_comparison: {
          current_vendor: 'Wellness Direct',
          alternative_vendor: 'Natural Health Co',
          price_difference: 3.25
        },
        market_analysis: {
          market_average: 30.50,
          trend: 'increasing'
        },
        confidence_score: 85
      }
    ];
    
    setRecommendations(mockRecommendations);
    setIsAnalyzing(false);
    
    const totalSavings = mockRecommendations.reduce((sum, rec) => 
      sum + (rec.current_price - rec.suggested_price), 0
    );
    
    toast.success(`Pricing analysis complete! Potential monthly savings: $${totalSavings.toFixed(2)}`);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Calculator className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleNegotiatePrice = (recommendationId: string) => {
    const rec = recommendations.find(r => r.id === recommendationId);
    if (rec) {
      toast.success(`Initiating price negotiation with ${rec.vendor_comparison.alternative_vendor}`);
      // Here you would integrate with vendor management system
    }
  };

  const handleSwitchVendor = (recommendationId: string) => {
    const rec = recommendations.find(r => r.id === recommendationId);
    if (rec) {
      toast.success(`Vendor switch initiated for ${rec.item_name}`);
      // Here you would integrate with procurement system
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <CardTitle>Smart Pricing Engine</CardTitle>
          </div>
          <Button 
            onClick={analyzePricing}
            disabled={isAnalyzing}
            variant="outline"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Pricing'}
          </Button>
        </div>
        <CardDescription>
          AI-powered price optimization and vendor comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Analyzing market prices...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{rec.item_name}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-600">Current Price:</span>
                          <p className="font-medium">${rec.current_price}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Suggested Price:</span>
                          <p className="font-medium text-green-600">${rec.suggested_price}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Savings:</span>
                          <p className="font-medium text-green-600">{rec.savings_percentage}%</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Market Trend:</span>
                          {getTrendIcon(rec.market_analysis.trend)}
                          <p className="font-medium capitalize">{rec.market_analysis.trend}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="text-sm text-gray-600 mb-1">Vendor Comparison:</p>
                        <p className="text-sm">
                          <span className="font-medium">{rec.vendor_comparison.current_vendor}</span> → 
                          <span className="font-medium text-green-600 ml-1">{rec.vendor_comparison.alternative_vendor}</span>
                          <span className="text-green-600 ml-1">(-${rec.vendor_comparison.price_difference})</span>
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">
                          {rec.confidence_score}% confidence
                        </Badge>
                        <Badge variant="outline">
                          Market avg: ${rec.market_analysis.market_average}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        size="sm"
                        onClick={() => handleNegotiatePrice(rec.id)}
                      >
                        Negotiate
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => handleSwitchVendor(rec.id)}
                      >
                        Switch Vendor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {recommendations.length === 0 && !isAnalyzing && (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pricing analysis available yet</p>
                <p className="text-sm">Click "Analyze Pricing" to get optimization recommendations</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
