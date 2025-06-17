
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetupData } from "@/pages/PracticeSetup";

interface BasicInfoStepProps {
  setupData: SetupData;
  updateSetupData: (updates: Partial<SetupData>) => void;
}

export const BasicInfoStep = ({ setupData, updateSetupData }: BasicInfoStepProps) => {
  const handleInputChange = (field: keyof SetupData, value: string) => {
    updateSetupData({ [field]: value });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Tell us about your practice</h2>
        <p className="text-gray-600">
          This information will be used to personalize your FlowIQ experience and set up your AI agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="practiceName">Practice Name *</Label>
            <Input
              id="practiceName"
              placeholder="e.g., Smith Family Dental"
              value={setupData.practiceName}
              onChange={(e) => handleInputChange('practiceName', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="(555) 123-4567"
              value={setupData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="info@yourpractice.com"
              value={setupData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="address">Practice Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, City, State 12345"
              value={setupData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Used for patient directions and local search optimization
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">Why do we need this information?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Practice Name:</strong> Personalizes patient communications and branding</li>
          <li>• <strong>Phone:</strong> Enables SMS reminders and appointment confirmations</li>
          <li>• <strong>Email:</strong> Sets up automated email workflows and notifications</li>
          <li>• <strong>Address:</strong> Helps patients find you and improves local SEO</li>
        </ul>
      </div>
    </div>
  );
};
