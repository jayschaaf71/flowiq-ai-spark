import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ClipboardList, FileCheck, AlertCircle, Save } from "lucide-react";
import { useState } from "react";

export const SleepQuestionnaires = () => {
  const [epworthScore, setEpworthScore] = useState(0);
  const [stopBangScore, setStopBangScore] = useState(0);
  const [berlinScore, setBerlinScore] = useState(0);

  const epworthQuestions = [
    "Sitting and reading",
    "Watching TV",
    "Sitting inactive in a public place",
    "As a passenger in a car for an hour without a break",
    "Lying down to rest in the afternoon when circumstances permit",
    "Sitting and talking to someone",
    "Sitting quietly after a lunch without alcohol",
    "In a car, while stopped for a few minutes in traffic"
  ];

  const stopBangQuestions = [
    { key: "snoring", text: "Do you snore loudly?" },
    { key: "tired", text: "Do you often feel tired, fatigued, or sleepy during daytime?" },
    { key: "observed", text: "Has anyone observed you stop breathing during sleep?" },
    { key: "pressure", text: "Do you have or are you being treated for high blood pressure?" },
    { key: "bmi", text: "BMI > 35 kg/m²?" },
    { key: "age", text: "Age > 50 years old?" },
    { key: "neck", text: "Neck circumference > 40cm?" },
    { key: "gender", text: "Male gender?" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sleep Assessment Questionnaires</h2>
          <p className="text-gray-600">Standardized screening tools for sleep disorders</p>
        </div>
        <Button>
          <Save className="w-4 h-4 mr-2" />
          Save All Assessments
        </Button>
      </div>

      <Tabs defaultValue="epworth" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="epworth">Epworth Sleepiness Scale</TabsTrigger>
          <TabsTrigger value="stop-bang">STOP-BANG</TabsTrigger>
          <TabsTrigger value="berlin">Berlin Questionnaire</TabsTrigger>
        </TabsList>

        {/* Epworth Sleepiness Scale */}
        <TabsContent value="epworth">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" />
                Epworth Sleepiness Scale
              </CardTitle>
              <CardDescription>
                How likely are you to doze off or fall asleep in the following situations? (0 = Never, 3 = High chance)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {epworthQuestions.map((question, index) => (
                <div key={index} className="space-y-2">
                  <Label className="text-sm font-medium">{question}</Label>
                  <RadioGroup className="flex gap-6" orientation="horizontal">
                    {[0, 1, 2, 3].map((score) => (
                      <div key={score} className="flex items-center space-x-2">
                        <RadioGroupItem value={score.toString()} id={`epworth-${index}-${score}`} />
                        <Label htmlFor={`epworth-${index}-${score}`} className="text-sm">
                          {score === 0 ? "Never" : score === 1 ? "Slight" : score === 2 ? "Moderate" : "High"}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Score Interpretation</span>
                </div>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• 0-7: Normal range</p>
                  <p>• 8-9: Mild excessive daytime sleepiness</p>
                  <p>• 10-15: Moderate excessive daytime sleepiness</p>
                  <p>• 16-24: Severe excessive daytime sleepiness</p>
                </div>
                <div className="mt-3 p-3 bg-white rounded border">
                  <span className="text-lg font-bold text-blue-900">Current Score: {epworthScore}/24</span>
                  <Badge className="ml-2" variant={epworthScore <= 7 ? "default" : epworthScore <= 9 ? "secondary" : epworthScore <= 15 ? "destructive" : "destructive"}>
                    {epworthScore <= 7 ? "Normal" : epworthScore <= 9 ? "Mild" : epworthScore <= 15 ? "Moderate" : "Severe"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STOP-BANG */}
        <TabsContent value="stop-bang">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                STOP-BANG Questionnaire
              </CardTitle>
              <CardDescription>
                Sleep apnea screening questionnaire with high sensitivity for OSA detection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stopBangQuestions.map((question, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox id={`stopbang-${index}`} />
                  <Label htmlFor={`stopbang-${index}`} className="text-sm font-medium">
                    {question.text}
                  </Label>
                </div>
              ))}
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="w-5 h-5 text-orange-600" />
                  <span className="font-medium text-orange-900">Risk Assessment</span>
                </div>
                <div className="text-sm text-orange-800 space-y-1">
                  <p>• 0-2: Low risk for OSA</p>
                  <p>• 3-4: Intermediate risk for OSA</p>
                  <p>• 5-8: High risk for OSA</p>
                </div>
                <div className="mt-3 p-3 bg-white rounded border">
                  <span className="text-lg font-bold text-orange-900">Current Score: {stopBangScore}/8</span>
                  <Badge className="ml-2" variant={stopBangScore <= 2 ? "default" : stopBangScore <= 4 ? "secondary" : "destructive"}>
                    {stopBangScore <= 2 ? "Low Risk" : stopBangScore <= 4 ? "Intermediate" : "High Risk"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Berlin Questionnaire */}
        <TabsContent value="berlin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-purple-600" />
                Berlin Questionnaire
              </CardTitle>
              <CardDescription>
                Comprehensive OSA risk assessment across multiple categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category 1: Snoring */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-900">Category 1: Snoring Behavior</h4>
                <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                  <div className="space-y-2">
                    <Label>Do you snore?</Label>
                    <RadioGroup orientation="horizontal" className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="snore-yes" />
                        <Label htmlFor="snore-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="snore-no" />
                        <Label htmlFor="snore-no">No</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="unknown" id="snore-unknown" />
                        <Label htmlFor="snore-unknown">Don't know</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Snoring volume</Label>
                    <RadioGroup className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="slightly" id="volume-slightly" />
                        <Label htmlFor="volume-slightly">Slightly louder than breathing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="talking" id="volume-talking" />
                        <Label htmlFor="volume-talking">As loud as talking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="loud" id="volume-loud" />
                        <Label htmlFor="volume-loud">Louder than talking</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="very-loud" id="volume-very-loud" />
                        <Label htmlFor="volume-very-loud">Very loud - can be heard in adjacent rooms</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              {/* Category 2: Daytime Sleepiness */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-900">Category 2: Daytime Sleepiness</h4>
                <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="tired-waking" />
                    <Label htmlFor="tired-waking">Do you feel tired or fatigued after sleeping?</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="tired-daytime" />
                    <Label htmlFor="tired-daytime">Do you feel tired, fatigued or not up to par during wake time?</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox id="doze-driving" />
                    <Label htmlFor="doze-driving">Have you ever nodded off or fallen asleep while driving?</Label>
                  </div>
                </div>
              </div>

              {/* Category 3: Blood Pressure */}
              <div className="space-y-4">
                <h4 className="font-semibold text-purple-900">Category 3: Blood Pressure & BMI</h4>
                <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="high-bp" />
                    <Label htmlFor="high-bp">Do you have high blood pressure?</Label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bmi-input">BMI</Label>
                      <Input id="bmi-input" placeholder="Enter BMI" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age-input">Age</Label>
                      <Input id="age-input" placeholder="Enter age" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <span className="font-medium text-purple-900">Risk Categories</span>
                </div>
                <div className="text-sm text-purple-800 space-y-1">
                  <p>• Low Risk: 0-1 positive categories</p>
                  <p>• High Risk: 2 or more positive categories</p>
                </div>
                <div className="mt-3 p-3 bg-white rounded border">
                  <span className="text-lg font-bold text-purple-900">Positive Categories: {berlinScore}/3</span>
                  <Badge className="ml-2" variant={berlinScore <= 1 ? "default" : "destructive"}>
                    {berlinScore <= 1 ? "Low Risk" : "High Risk"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};