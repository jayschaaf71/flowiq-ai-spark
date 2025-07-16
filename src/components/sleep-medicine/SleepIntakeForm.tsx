import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ClipboardList, 
  User, 
  Heart, 
  Moon, 
  Clock, 
  AlertTriangle,
  Save,
  FileText,
  Stethoscope
} from "lucide-react";
import { useState } from "react";

export const SleepIntakeForm = () => {
  const [formData, setFormData] = useState({
    personalInfo: {},
    sleepHistory: {},
    medicalHistory: {},
    symptoms: {}
  });

  const sleepSymptoms = [
    "Loud snoring",
    "Witnessed breathing pauses",
    "Gasping or choking during sleep",
    "Restless sleep",
    "Frequent awakenings",
    "Morning headaches",
    "Excessive daytime sleepiness",
    "Difficulty concentrating",
    "Memory problems",
    "Irritability or mood changes",
    "Falling asleep during activities",
    "Dry mouth upon waking"
  ];

  const medicalConditions = [
    "High blood pressure",
    "Heart disease",
    "Diabetes",
    "Stroke",
    "Depression/Anxiety",
    "Acid reflux (GERD)",
    "Thyroid disorders",
    "Chronic fatigue",
    "Obesity",
    "Chronic pain",
    "Kidney disease",
    "Lung disease"
  ];

  const medications = [
    "Blood pressure medications",
    "Heart medications",
    "Diabetes medications",
    "Sleep aids",
    "Antidepressants",
    "Pain medications",
    "Muscle relaxants",
    "Allergy medications",
    "Thyroid medications",
    "Seizure medications"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sleep Medicine Intake Form</h2>
          <p className="text-gray-600">Comprehensive assessment for sleep disorder evaluation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Submit Form
          </Button>
        </div>
      </div>

      <Tabs defaultValue="demographics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="sleep-history">Sleep History</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Patient Demographics
              </CardTitle>
              <CardDescription>Basic patient information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Enter last name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input id="dob" type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <RadioGroup className="flex gap-6" orientation="horizontal">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height</Label>
                  <div className="flex gap-2">
                    <Input id="height-ft" placeholder="Feet" className="w-20" />
                    <Input id="height-in" placeholder="Inches" className="w-20" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input id="weight" placeholder="Enter weight" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Street address" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Enter city" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca">California</SelectItem>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="tx">Texas</SelectItem>
                      {/* Add more states */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="Enter ZIP" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="patient@email.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sleep History Tab */}
        <TabsContent value="sleep-history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-purple-600" />
                Sleep History & Patterns
              </CardTitle>
              <CardDescription>Detailed sleep habits and bedroom environment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedtime">Usual Bedtime</Label>
                  <Input id="bedtime" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waketime">Usual Wake Time</Label>
                  <Input id="waketime" type="time" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>How long does it typically take you to fall asleep?</Label>
                  <RadioGroup className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0-15" id="sleep-0-15" />
                      <Label htmlFor="sleep-0-15">0-15 minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="15-30" id="sleep-15-30" />
                      <Label htmlFor="sleep-15-30">15-30 minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30-60" id="sleep-30-60" />
                      <Label htmlFor="sleep-30-60">30-60 minutes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="60+" id="sleep-60" />
                      <Label htmlFor="sleep-60">More than 60 minutes</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>How many times do you typically wake up during the night?</Label>
                  <RadioGroup className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="wake-0" />
                      <Label htmlFor="wake-0">Never or rarely</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1-2" id="wake-1-2" />
                      <Label htmlFor="wake-1-2">1-2 times</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3-4" id="wake-3-4" />
                      <Label htmlFor="wake-3-4">3-4 times</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5+" id="wake-5" />
                      <Label htmlFor="wake-5">5 or more times</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>Sleep Position Preference</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="back-sleeper" />
                      <Label htmlFor="back-sleeper">Back</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="side-sleeper" />
                      <Label htmlFor="side-sleeper">Side</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="stomach-sleeper" />
                      <Label htmlFor="stomach-sleeper">Stomach</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="varies" />
                      <Label htmlFor="varies">Varies</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Bedroom Environment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room Temperature</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select temperature" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cool">Cool (65-68°F)</SelectItem>
                        <SelectItem value="moderate">Moderate (68-72°F)</SelectItem>
                        <SelectItem value="warm">Warm (72-75°F)</SelectItem>
                        <SelectItem value="hot">Hot (75°F+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Room Lighting</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lighting" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark">Completely dark</SelectItem>
                        <SelectItem value="dim">Dim light</SelectItem>
                        <SelectItem value="moderate">Moderate light</SelectItem>
                        <SelectItem value="bright">Bright</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Symptoms Tab */}
        <TabsContent value="symptoms">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Sleep-Related Symptoms
              </CardTitle>
              <CardDescription>Current symptoms and their frequency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Which of the following symptoms do you experience? (Check all that apply)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sleepSymptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`symptom-${index}`} />
                      <Label htmlFor={`symptom-${index}`} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">How would you rate your overall sleep quality?</h4>
                <RadioGroup className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excellent" id="quality-excellent" />
                    <Label htmlFor="quality-excellent">Excellent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="quality-good" />
                    <Label htmlFor="quality-good">Good</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="fair" id="quality-fair" />
                    <Label htmlFor="quality-fair">Fair</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poor" id="quality-poor" />
                    <Label htmlFor="quality-poor">Poor</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="very-poor" id="quality-very-poor" />
                    <Label htmlFor="quality-very-poor">Very Poor</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptom-details">Please describe your main sleep concerns in detail:</Label>
                <Textarea 
                  id="symptom-details" 
                  placeholder="Describe when symptoms started, how they affect your daily life, any patterns you've noticed..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Has anyone witnessed you stop breathing during sleep?</Label>
                <RadioGroup className="flex gap-6" orientation="horizontal">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="witnessed-yes" />
                    <Label htmlFor="witnessed-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="witnessed-no" />
                    <Label htmlFor="witnessed-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsure" id="witnessed-unsure" />
                    <Label htmlFor="witnessed-unsure">Unsure</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-red-600" />
                Medical History
              </CardTitle>
              <CardDescription>Current conditions, medications, and past treatments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Current Medical Conditions (Check all that apply):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medicalConditions.map((condition, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`condition-${index}`} />
                      <Label htmlFor={`condition-${index}`} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Current Medications (Check all that apply):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medications.map((medication, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox id={`medication-${index}`} />
                      <Label htmlFor={`medication-${index}`} className="text-sm">
                        {medication}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other-medications">Other medications not listed above:</Label>
                <Textarea 
                  id="other-medications" 
                  placeholder="List any other medications, supplements, or over-the-counter drugs..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Have you had any previous sleep studies?</Label>
                <RadioGroup className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="study-no" />
                    <Label htmlFor="study-no">No</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="study-home" />
                    <Label htmlFor="study-home">Yes, home sleep test</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lab" id="study-lab" />
                    <Label htmlFor="study-lab">Yes, in-lab sleep study</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="study-both" />
                    <Label htmlFor="study-both">Yes, both types</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Have you tried CPAP therapy?</Label>
                <RadioGroup className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="never" id="cpap-never" />
                    <Label htmlFor="cpap-never">Never tried</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="current" id="cpap-current" />
                    <Label htmlFor="cpap-current">Currently using</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="past" id="cpap-past" />
                    <Label htmlFor="cpap-past">Used in the past</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unsuccessful" id="cpap-unsuccessful" />
                    <Label htmlFor="cpap-unsuccessful">Tried but unsuccessful</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lifestyle Tab */}
        <TabsContent value="lifestyle">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-green-600" />
                Lifestyle Factors
              </CardTitle>
              <CardDescription>Daily habits that may affect sleep quality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Caffeine Consumption</h4>
                  <div className="space-y-2">
                    <Label>How many caffeinated beverages do you consume daily?</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1-2">1-2 beverages</SelectItem>
                        <SelectItem value="3-4">3-4 beverages</SelectItem>
                        <SelectItem value="5+">5+ beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>What time do you have your last caffeinated beverage?</Label>
                    <Input type="time" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Alcohol Consumption</h4>
                  <div className="space-y-2">
                    <Label>How often do you consume alcohol?</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="rarely">Rarely</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>How many drinks do you typically have?</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select amount" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="1">1 drink</SelectItem>
                        <SelectItem value="2-3">2-3 drinks</SelectItem>
                        <SelectItem value="4+">4+ drinks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Exercise Habits</h4>
                <div className="space-y-2">
                  <Label>How often do you exercise?</Label>
                  <RadioGroup className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="exercise-never" />
                      <Label htmlFor="exercise-never">Never</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rarely" id="exercise-rarely" />
                      <Label htmlFor="exercise-rarely">Rarely (less than once per week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sometimes" id="exercise-sometimes" />
                      <Label htmlFor="exercise-sometimes">Sometimes (1-2 times per week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="regularly" id="exercise-regularly" />
                      <Label htmlFor="exercise-regularly">Regularly (3-4 times per week)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="exercise-daily" />
                      <Label htmlFor="exercise-daily">Daily</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Smoking History</h4>
                <div className="space-y-2">
                  <Label>Do you currently smoke or use tobacco products?</Label>
                  <RadioGroup className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="never" id="smoke-never" />
                      <Label htmlFor="smoke-never">Never smoked</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="former" id="smoke-former" />
                      <Label htmlFor="smoke-former">Former smoker</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="current" id="smoke-current" />
                      <Label htmlFor="smoke-current">Current smoker</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional-info">Additional information or concerns:</Label>
                <Textarea 
                  id="additional-info" 
                  placeholder="Please share any other information you think might be relevant to your sleep health..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};