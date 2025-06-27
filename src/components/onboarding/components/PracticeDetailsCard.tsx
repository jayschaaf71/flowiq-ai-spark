
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Clock, Users } from 'lucide-react';

interface BusinessHours {
  start: string;
  end: string;
}

interface PracticeData {
  address: string;
  description?: string;
  businessHours?: BusinessHours;
  teamSize?: number;
}

interface PracticeDetailsCardProps {
  formData: PracticeData;
  onInputChange: (field: keyof PracticeData, value: any) => void;
}

export const PracticeDetailsCard: React.FC<PracticeDetailsCardProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Practice Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Practice Address</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
            placeholder="123 Main Street, City, State 12345"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            Used for patient directions and local search optimization
          </p>
        </div>

        <div>
          <Label htmlFor="description">Practice Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Brief description of your practice and services..."
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" />
              Business Hours
            </Label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <Label htmlFor="startTime" className="text-sm text-gray-600">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.businessHours?.start || '09:00'}
                  onChange={(e) => onInputChange('businessHours', {
                    ...formData.businessHours,
                    start: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center justify-center pt-6">
                <span className="text-gray-500 text-sm">to</span>
              </div>
              <div className="flex-1">
                <Label htmlFor="endTime" className="text-sm text-gray-600">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.businessHours?.end || '17:00'}
                  onChange={(e) => onInputChange('businessHours', {
                    ...formData.businessHours,
                    end: e.target.value
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="teamSize" className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4" />
              Team Size
            </Label>
            <Input
              id="teamSize"
              type="number"
              min="1"
              max="100"
              value={formData.teamSize || 1}
              onChange={(e) => onInputChange('teamSize', parseInt(e.target.value) || 1)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of team members in your practice
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
