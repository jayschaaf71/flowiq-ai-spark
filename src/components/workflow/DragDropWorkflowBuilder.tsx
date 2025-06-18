
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Play, GitBranch, RotateCcw } from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "agent" | "condition" | "delay" | "trigger";
  name: string;
  agent?: string;
  action?: string;
  condition?: string;
  delay?: number;
  x: number;
  y: number;
  connections: string[];
}

export const DragDropWorkflowBuilder = () => {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: "start",
      type: "trigger",
      name: "Start",
      x: 100,
      y: 100,
      connections: ["step1"]
    },
    {
      id: "step1",
      type: "agent",
      name: "Welcome Patient",
      agent: "Assist iQ",
      action: "send_welcome_message",
      x: 300,
      y: 100,
      connections: ["condition1"]
    },
    {
      id: "condition1",
      type: "condition",
      name: "New Patient?",
      condition: "patient.isNew === true",
      x: 500,
      y: 100,
      connections: ["step2", "step3"]
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const availableAgents = [
    "Schedule iQ", "Intake iQ", "Remind iQ", "Billing iQ", 
    "Claims iQ", "Assist iQ", "Scribe iQ"
  ];

  const addNode = (type: WorkflowNode["type"]) => {
    const newNode: WorkflowNode = {
      id: `node_${Date.now()}`,
      type,
      name: type === "agent" ? "New Agent Action" : 
            type === "condition" ? "New Condition" :
            type === "delay" ? "Wait" : "New Step",
      x: 200 + Math.random() * 300,
      y: 150 + Math.random() * 200,
      connections: []
    };
    
    if (type === "agent") {
      newNode.agent = "Assist iQ";
      newNode.action = "send_message";
    }
    
    setNodes(prev => [...prev, newNode]);
  };

  const simulateWorkflow = async () => {
    setIsSimulating(true);
    
    // Simple simulation - highlight nodes in sequence
    for (const node of nodes) {
      setSelectedNode(node.id);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    setSelectedNode(null);
    setIsSimulating(false);
  };

  const updateNode = (nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Toolbar */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addNode("agent")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agent Action
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addNode("condition")}
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Condition
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => addNode("delay")}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Delay
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Workflow
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={simulateWorkflow}
              disabled={isSimulating}
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? "Simulating..." : "Test Workflow"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Canvas */}
      <div className="lg:col-span-2">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="text-base">Workflow Canvas</CardTitle>
            <CardDescription>Drag and drop to build your workflow</CardDescription>
          </CardHeader>
          <CardContent className="relative h-full overflow-hidden">
            <div className="absolute inset-0 bg-dot-pattern">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`absolute p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedNode === node.id 
                      ? "ring-2 ring-blue-500 bg-blue-50" 
                      : "bg-white hover:shadow-md"
                  } ${isSimulating && selectedNode === node.id ? "animate-pulse" : ""}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedNode(node.id)}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      node.type === "agent" ? "default" :
                      node.type === "condition" ? "secondary" :
                      node.type === "delay" ? "outline" : "destructive"
                    }>
                      {node.type}
                    </Badge>
                    <span className="text-sm font-medium">{node.name}</span>
                  </div>
                  {node.agent && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {node.agent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Panel */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Properties</CardTitle>
            <CardDescription>
              {selectedNode ? "Edit selected component" : "Select a component to edit"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedNode && (() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;
              
              return (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={node.name}
                      onChange={(e) => updateNode(node.id, { name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  
                  {node.type === "agent" && (
                    <>
                      <div>
                        <label className="text-sm font-medium">Agent</label>
                        <Select 
                          value={node.agent} 
                          onValueChange={(value) => updateNode(node.id, { agent: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableAgents.map(agent => (
                              <SelectItem key={agent} value={agent}>{agent}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Action</label>
                        <Input
                          value={node.action || ""}
                          onChange={(e) => updateNode(node.id, { action: e.target.value })}
                          placeholder="send_message, book_appointment, etc."
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  
                  {node.type === "condition" && (
                    <div>
                      <label className="text-sm font-medium">Condition</label>
                      <Input
                        value={node.condition || ""}
                        onChange={(e) => updateNode(node.id, { condition: e.target.value })}
                        placeholder="patient.isNew === true"
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  {node.type === "delay" && (
                    <div>
                      <label className="text-sm font-medium">Delay (minutes)</label>
                      <Input
                        type="number"
                        value={node.delay || 0}
                        onChange={(e) => updateNode(node.id, { delay: parseInt(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              );
            })()}
            
            {!selectedNode && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Click on a component in the canvas to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
