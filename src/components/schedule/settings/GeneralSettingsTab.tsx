
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const GeneralSettingsTab = () => {
  const { toast } = useToast();
  const [practiceName, setPracticeName] = useState("Midwest Dental Sleep Medicine Institute");
  const [timeZone, setTimeZone] = useState("cst");
  const [language, setLanguage] = useState("en");

  const handleSave = () => {
    // Here you would typically save to your backend
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated successfully.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Practice Name</Label>
            <Input 
              value={practiceName}
              onChange={(e) => setPracticeName(e.target.value)}
              placeholder="Enter your practice name" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Time Zone</Label>
            <Select value={timeZone} onValueChange={setTimeZone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="est">Eastern Time</SelectItem>
                <SelectItem value="cst">Central Time</SelectItem>
                <SelectItem value="mst">Mountain Time</SelectItem>
                <SelectItem value="pst">Pacific Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
