import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, CheckCircle, Settings, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';


interface EdgeFunctionTest {
  name: string;
  functionName: string;
  description: string;
  testData: any;
  status: 'idle' | 'testing' | 'success' | 'error';
  result?: any;
  error?: string;
}

export const EdgeFunctionTester: React.FC = () => {
  const { toast } = useToast();
  
  const [tests, setTests] = useState<EdgeFunctionTest[]>([
    {
      name: 'SOAP Note Generation',
      functionName: 'ai-soap-generation',
      description: 'Tests SOAP note generation from clinical transcription',
      testData: {
        transcription: "Patient presents with excessive daytime sleepiness, loud snoring reported by spouse. AHI of 15 events per hour on home sleep study. BMI 32. Recommending oral appliance therapy. Patient agrees to treatment plan.",
        specialty: "dental-sleep-medicine"
      },
      status: 'idle'
    },
    {
      name: 'Medical Coding Assistant',
      functionName: 'ai-medical-coding',
      description: 'Tests ICD-10 and CPT code suggestions for dental sleep procedures',
      testData: {
        transcription: "Oral appliance fitting and adjustment for obstructive sleep apnea. Custom mandibular advancement device fabricated and delivered.",
        specialty: "dental-sleep-medicine",
        procedureType: "oral_appliance_therapy"
      },
      status: 'idle'
    }
  ]);

  const [customTestData, setCustomTestData] = useState('');
  const [selectedFunction, setSelectedFunction] = useState('');

  const runTest = async (index: number) => {
    const updatedTests = [...tests];
    updatedTests[index].status = 'testing';
    setTests(updatedTests);

    try {
      const { data, error } = await supabase.functions.invoke(
        updatedTests[index].functionName,
        {
          body: updatedTests[index].testData
        }
      );

      if (error) {
        throw error;
      }

      updatedTests[index].status = 'success';
      updatedTests[index].result = data;
      updatedTests[index].error = undefined;

      toast({
        title: "Test Successful",
        description: `${updatedTests[index].name} function is working correctly`,
      });

    } catch (error) {
      console.error(`Error testing ${updatedTests[index].name}:`, error);
      
      updatedTests[index].status = 'error';
      updatedTests[index].error = error.message || 'Unknown error';
      updatedTests[index].result = undefined;

      toast({
        title: "Test Failed",
        description: `${updatedTests[index].name}: ${error.message}`,
        variant: "destructive",
      });
    }

    setTests(updatedTests);
  };

  const runAllTests = async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i);
      // Add small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const runCustomTest = async () => {
    if (!selectedFunction || !customTestData) {
      toast({
        title: "Missing Data",
        description: "Please select a function and provide test data",
        variant: "destructive",
      });
      return;
    }

    try {
      const testData = JSON.parse(customTestData);
      const { data, error } = await supabase.functions.invoke(selectedFunction, {
        body: testData
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Custom Test Successful",
        description: `Function ${selectedFunction} responded successfully`,
      });

      console.log('Custom test result:', data);

    } catch (error) {
      console.error('Custom test error:', error);
      toast({
        title: "Custom Test Failed",
        description: error.message || 'Test failed',
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">✓ Passed</Badge>;
      case 'error':
        return <Badge variant="destructive">✗ Failed</Badge>;
      case 'testing':
        return <Badge variant="outline">Testing...</Badge>;
      default:
        return <Badge variant="outline">Not Tested</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Scribe Function Testing
          </CardTitle>
          <p className="text-sm text-muted-foreground">Test core clinical documentation and transcription functions</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button onClick={runAllTests}>
              Run All Tests
            </Button>
          </div>

          <div className="grid gap-4">
            {tests.map((test, index) => (
              <Card key={index} className="border-l-4 border-l-blue-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{test.name}</h3>
                      <p className="text-sm text-gray-600">{test.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Function: {test.functionName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(test.status)}
                      <Button
                        size="sm"
                        onClick={() => runTest(index)}
                        disabled={test.status === 'testing'}
                      >
                        {test.status === 'testing' ? 'Testing...' : 'Test'}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {(test.result || test.error) && (
                  <CardContent className="pt-0">
                    {test.error && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-800 mb-1">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium">Error</span>
                        </div>
                        <p className="text-sm text-red-700">{test.error}</p>
                      </div>
                    )}
                    
                    {test.result && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800 mb-1">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Success</span>
                        </div>
                        <pre className="text-xs text-green-700 overflow-x-auto">
                          {JSON.stringify(test.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Custom Test Section - For Advanced Users */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Function Testing</CardTitle>
          <p className="text-sm text-muted-foreground">Test any edge function with custom parameters (for developers)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Function Name</label>
            <select 
              className="w-full p-2 border rounded-lg"
              value={selectedFunction}
              onChange={(e) => setSelectedFunction(e.target.value)}
            >
              <option value="">Select function...</option>
              <option value="health-check">health-check</option>
              <option value="ai-soap-generation">SOAP Generation</option>
              <option value="ai-medical-coding">Medical Coding</option>
              
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Test Data (JSON)</label>
            <Textarea
              placeholder='{"key": "value"}'
              value={customTestData}
              onChange={(e) => setCustomTestData(e.target.value)}
              rows={4}
            />
          </div>
          
          <Button onClick={runCustomTest}>
            Run Custom Test
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};