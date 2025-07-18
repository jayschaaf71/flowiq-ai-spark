import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Camera, 
  Upload,
  Check,
  X,
  RotateCcw,
  Eye,
  Loader2,
  CreditCard,
  AlertCircle,
  Smartphone
} from 'lucide-react';

interface InsuranceCardUploadProps {
  patientId?: string;
  onUploadComplete?: (cardData: any) => void;
  className?: string;
}

export const InsuranceCardUpload: React.FC<InsuranceCardUploadProps> = ({
  patientId,
  onUploadComplete,
  className
}) => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [frontPreview, setFrontPreview] = useState<string | null>(null);
  const [backPreview, setBackPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const frontCameraRef = useRef<HTMLInputElement>(null);
  const backCameraRef = useRef<HTMLInputElement>(null);
  
  const { toast } = useToast();

  const handleFileSelect = (
    file: File, 
    side: 'front' | 'back'
  ) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    if (side === 'front') {
      setFrontImage(file);
      setFrontPreview(URL.createObjectURL(file));
    } else {
      setBackImage(file);
      setBackPreview(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = (side: 'front' | 'back') => {
    // Check if we're on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Use camera input for mobile
      const input = side === 'front' ? frontCameraRef.current : backCameraRef.current;
      input?.click();
    } else {
      // Fallback to file input for desktop
      const input = side === 'front' ? frontInputRef.current : backInputRef.current;
      input?.click();
    }
  };

  const extractCardData = async (frontImageUrl: string, backImageUrl?: string) => {
    setExtracting(true);
    try {
      // Simulate OCR/AI extraction (in real implementation, use OCR service)
      const mockExtraction = {
        insuranceProvider: "Blue Cross Blue Shield",
        memberName: "JOHN DOE",
        memberId: "ABC123456789",
        groupNumber: "GRP001",
        policyNumber: "POL987654321",
        effectiveDate: "01/01/2024",
        copayPCP: "$25",
        copaySpecialist: "$50",
        deductible: "$1,500",
        rxBin: "123456",
        rxPcn: "ABC",
        rxGroup: "GROUP1",
        customerServicePhone: "1-800-555-0123",
        confidence: 0.92
      };

      setExtractedData(mockExtraction);
      return mockExtraction;
    } catch (error) {
      console.error('Error extracting card data:', error);
      toast({
        title: "Extraction Failed",
        description: "Could not extract insurance information from the image",
        variant: "destructive"
      });
      return null;
    } finally {
      setExtracting(false);
    }
  };

  const uploadImages = async () => {
    if (!frontImage) {
      toast({
        title: "Missing Front Image",
        description: "Please capture or upload the front of your insurance card",
        variant: "destructive"
      });
      return;
    }

    if (!patientId) {
      toast({
        title: "Patient ID Required",
        description: "Patient must be logged in to upload insurance cards",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload front image
      const frontFileName = `${user.id}/front_${Date.now()}.jpg`;
      const { data: frontUpload, error: frontError } = await supabase.storage
        .from('insurance-cards')
        .upload(frontFileName, frontImage);

      if (frontError) throw frontError;

      let backUpload = null;
      if (backImage) {
        const backFileName = `${user.id}/back_${Date.now()}.jpg`;
        const { data: backData, error: backError } = await supabase.storage
          .from('insurance-cards')
          .upload(backFileName, backImage);
        
        if (backError) throw backError;
        backUpload = backData;
      }

      // Get public URLs
      const { data: frontUrl } = supabase.storage
        .from('insurance-cards')
        .getPublicUrl(frontUpload.path);

      const backUrl = backUpload 
        ? supabase.storage.from('insurance-cards').getPublicUrl(backUpload.path).data
        : null;

      // Extract data from images
      const extractedInfo = await extractCardData(frontUrl.publicUrl, backUrl?.publicUrl);

      // Save to database
      const { data: cardRecord, error: dbError } = await supabase
        .from('insurance_cards')
        .insert({
          patient_id: user.id,
          card_type: 'primary',
          front_image_path: frontUpload.path,
          back_image_path: backUpload?.path,
          insurance_provider_name: extractedInfo?.insuranceProvider,
          policy_number: extractedInfo?.policyNumber,
          group_number: extractedInfo?.groupNumber,
          member_id: extractedInfo?.memberId,
          extracted_data: extractedInfo,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "Upload Successful",
        description: "Your insurance card has been uploaded and is being processed",
      });

      onUploadComplete?.(cardRecord);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload insurance card",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const clearImages = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontPreview(null);
    setBackPreview(null);
    setExtractedData(null);
    
    // Clear file inputs
    if (frontInputRef.current) frontInputRef.current.value = '';
    if (backInputRef.current) backInputRef.current.value = '';
    if (frontCameraRef.current) frontCameraRef.current.value = '';
    if (backCameraRef.current) backCameraRef.current.value = '';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Upload Insurance Card
        </CardTitle>
        <CardDescription>
          Take photos or upload images of your insurance card (front and back)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mobile Camera Notice */}
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
          <Smartphone className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-700">
            On mobile? Tap "Take Photo" to use your camera for best results
          </p>
        </div>

        {/* Front of Card */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Front of Insurance Card *</Label>
          
          {frontPreview ? (
            <div className="relative">
              <img 
                src={frontPreview} 
                alt="Front of insurance card"
                className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFrontImage(null);
                  setFrontPreview(null);
                  if (frontInputRef.current) frontInputRef.current.value = '';
                }}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-4">
              <CreditCard className="h-12 w-12 mx-auto text-gray-400" />
              <div className="space-y-2">
                <p className="text-lg font-medium">Front of Insurance Card</p>
                <p className="text-sm text-gray-600">
                  Capture the front side with member info, ID numbers, and coverage details
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  onClick={() => handleCameraCapture('front')}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => frontInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={frontInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'front')}
            className="hidden"
          />
          <input
            ref={frontCameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'front')}
            className="hidden"
          />
        </div>

        {/* Back of Card */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Back of Insurance Card (Optional)</Label>
          
          {backPreview ? (
            <div className="relative">
              <img 
                src={backPreview} 
                alt="Back of insurance card"
                className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBackImage(null);
                  setBackPreview(null);
                  if (backInputRef.current) backInputRef.current.value = '';
                }}
                className="absolute top-2 right-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center space-y-4">
              <CreditCard className="h-12 w-12 mx-auto text-gray-300" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-600">Back of Insurance Card</p>
                <p className="text-sm text-gray-500">
                  Optional: Capture the back side for additional coverage information
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => handleCameraCapture('back')}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Take Photo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => backInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </Button>
              </div>
            </div>
          )}

          {/* Hidden file inputs */}
          <input
            ref={backInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'back')}
            className="hidden"
          />
          <input
            ref={backCameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0], 'back')}
            className="hidden"
          />
        </div>

        {/* Extracted Data Preview */}
        {extracting && (
          <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <p className="text-sm text-blue-700">Extracting insurance information...</p>
          </div>
        )}

        {extractedData && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <h3 className="font-medium">Extracted Information</h3>
              <Badge variant="outline" className="text-green-600 border-green-300">
                {Math.round(extractedData.confidence * 100)}% confidence
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label className="text-xs text-gray-600">Insurance Provider</Label>
                <p className="font-medium">{extractedData.insuranceProvider}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Member Name</Label>
                <p className="font-medium">{extractedData.memberName}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Member ID</Label>
                <p className="font-medium">{extractedData.memberId}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Group Number</Label>
                <p className="font-medium">{extractedData.groupNumber}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">PCP Copay</Label>
                <p className="font-medium">{extractedData.copayPCP}</p>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Specialist Copay</Label>
                <p className="font-medium">{extractedData.copaySpecialist}</p>
              </div>
            </div>
            
            {extractedData.confidence < 0.8 && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium">Low confidence extraction</p>
                  <p>Please verify the extracted information is correct before submitting.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={uploadImages}
            disabled={!frontImage || uploading}
            className="flex-1"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload Insurance Card
              </>
            )}
          </Button>
          
          {(frontImage || backImage) && (
            <Button variant="outline" onClick={clearImages}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Start Over
            </Button>
          )}
        </div>

        {/* Tips */}
        <div className="text-sm text-gray-600 space-y-2">
          <p className="font-medium">Tips for best results:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Ensure good lighting and avoid glare</li>
            <li>Keep the card flat and fill the frame</li>
            <li>Make sure all text is clear and readable</li>
            <li>Include the entire card in the photo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};