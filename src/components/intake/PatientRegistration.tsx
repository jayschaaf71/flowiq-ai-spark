
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Phone, Mail, MapPin, Calendar, Heart, FileText } from "lucide-react";

export const PatientRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    
    // Insurance Information
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",
    
    // Medical History
    medications: "",
    allergies: "",
    medicalConditions: "",
    previousSurgeries: "",
    
    // Visit Information
    visitReason: "",
    preferredProvider: "",
    appointmentType: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Here you would typically submit to your backend
    alert("Patient registration completed successfully!");
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            placeholder="Enter first name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            placeholder="Enter last name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            placeholder="(555) 123-4567"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="name@example.com"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Address & Emergency Contact</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Street Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="123 Main Street"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="City"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={formData.state}
              onChange={(e) => handleInputChange("state", e.target.value)}
              placeholder="State"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange("zipCode", e.target.value)}
              placeholder="12345"
              required
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Contact Name *</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyName}
              onChange={(e) => handleInputChange("emergencyName", e.target.value)}
              placeholder="Full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Phone Number *</Label>
            <Input
              id="emergencyPhone"
              type="tel"
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
              placeholder="(555) 123-4567"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelation">Relationship *</Label>
            <Select value={formData.emergencyRelation} onValueChange={(value) => handleInputChange("emergencyRelation", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Medical History & Insurance</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="medications">Current Medications</Label>
          <Textarea
            id="medications"
            value={formData.medications}
            onChange={(e) => handleInputChange("medications", e.target.value)}
            placeholder="List all current medications, dosages, and frequency"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="allergies">Known Allergies</Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => handleInputChange("allergies", e.target.value)}
            placeholder="List any known allergies (medications, foods, environmental)"
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="medicalConditions">Medical Conditions</Label>
          <Textarea
            id="medicalConditions"
            value={formData.medicalConditions}
            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
            placeholder="List any chronic conditions or ongoing health issues"
            rows={3}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Insurance Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="insuranceProvider">Insurance Provider</Label>
            <Input
              id="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
              placeholder="e.g., Blue Cross Blue Shield"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="policyNumber">Policy Number</Label>
            <Input
              id="policyNumber"
              value={formData.policyNumber}
              onChange={(e) => handleInputChange("policyNumber", e.target.value)}
              placeholder="Policy/Member ID"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Visit Information</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="visitReason">Reason for Visit *</Label>
          <Textarea
            id="visitReason"
            value={formData.visitReason}
            onChange={(e) => handleInputChange("visitReason", e.target.value)}
            placeholder="Please describe the reason for your visit"
            rows={4}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Appointment Type *</Label>
          <RadioGroup
            value={formData.appointmentType}
            onValueChange={(value) => handleInputChange("appointmentType", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="routine" id="routine" />
              <Label htmlFor="routine">Routine Check-up</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent">Urgent Care</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="follow-up" id="follow-up" />
              <Label htmlFor="follow-up">Follow-up</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="consultation" id="consultation" />
              <Label htmlFor="consultation">Consultation</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-2">
          <Label>Preferred Provider</Label>
          <Select value={formData.preferredProvider} onValueChange={(value) => handleInputChange("preferredProvider", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select preferred provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-smith">Dr. Sarah Smith</SelectItem>
              <SelectItem value="dr-johnson">Dr. Michael Johnson</SelectItem>
              <SelectItem value="dr-williams">Dr. Emily Williams</SelectItem>
              <SelectItem value="dr-brown">Dr. David Brown</SelectItem>
              <SelectItem value="no-preference">No Preference</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="consent" required />
            <Label htmlFor="consent" className="text-sm">
              I consent to treatment and acknowledge that I have read and understand the practice policies *
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="hipaa" required />
            <Label htmlFor="hipaa" className="text-sm">
              I acknowledge receipt of the HIPAA Privacy Notice *
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="communications" />
            <Label htmlFor="communications" className="text-sm">
              I consent to receive appointment reminders via SMS and email
            </Label>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Patient Registration</CardTitle>
        <CardDescription>Complete the intake process for a new patient</CardDescription>
        
        {/* Progress Indicator */}
        <div className="flex items-center space-x-2 mt-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 4 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>Personal Info</span>
          <span>Address & Contact</span>
          <span>Medical & Insurance</span>
          <span>Visit Details</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <FileText className="w-4 h-4 mr-2" />
              Complete Registration
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
