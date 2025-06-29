
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Upload, CheckCircle } from 'lucide-react';

interface PhotoVerificationStepProps {
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export const PhotoVerificationStep: React.FC<PhotoVerificationStepProps> = ({ onComplete, onSkip }) => {
  const [photoData, setPhotoData] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoData(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    onComplete({ photoId: photoData });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Photo ID Verification (Optional)</h3>
          <p className="text-gray-600 mb-6">
            Please upload a photo of your government-issued ID to help us verify your identity and 
            expedite your check-in process.
          </p>

          {!photoData ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Upload a photo of your ID</p>
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Upload className="w-4 h-4" />
                  Choose File
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Photo uploaded successfully</span>
              </div>
              <div className="max-w-xs mx-auto">
                <img
                  src={photoData}
                  alt="Uploaded ID"
                  className="w-full h-auto rounded-lg border"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => setPhotoData(null)}
              >
                Upload Different Photo
              </Button>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Privacy Notice:</strong> Your ID photo is encrypted and stored securely. 
              It will only be used for identity verification purposes and will be deleted after 
              your appointment unless required for medical records.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onSkip}>
          Skip This Step
        </Button>
        <Button onClick={handleComplete} size="lg">
          Continue to Review
        </Button>
      </div>
    </div>
  );
};
