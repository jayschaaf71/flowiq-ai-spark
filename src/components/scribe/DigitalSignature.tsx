
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  PenTool, 
  Save, 
  Trash2, 
  CheckCircle,
  User
} from "lucide-react";

interface DigitalSignatureProps {
  onSignatureSaved?: (signature: string, metadata: any) => void;
  patientName?: string;
  documentType?: string;
}

export const DigitalSignature = ({ 
  onSignatureSaved, 
  patientName = "Patient",
  documentType = "SOAP Note"
}: DigitalSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [signerName, setSignerName] = useState("");
  const [signerTitle, setSignerTitle] = useState("");
  const { toast } = useToast();

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      setIsDrawing(true);
    }
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000000';
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSignature(null);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas has content
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const hasContent = imageData.data.some((channel, index) => 
      index % 4 !== 3 && channel !== 0
    );

    if (!hasContent) {
      toast({
        title: "Signature Required",
        description: "Please provide a signature before saving",
        variant: "destructive",
      });
      return;
    }

    if (!signerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the signer's name",
        variant: "destructive",
      });
      return;
    }

    const signatureDataURL = canvas.toDataURL('image/png');
    setSignature(signatureDataURL);

    const metadata = {
      signerName,
      signerTitle,
      timestamp: new Date().toISOString(),
      patientName,
      documentType,
      ipAddress: 'masked', // In production, capture actual IP
      browserInfo: navigator.userAgent
    };

    onSignatureSaved?.(signatureDataURL, metadata);

    toast({
      title: "Signature Captured",
      description: `Digital signature saved for ${documentType}`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-blue-600" />
          Digital Signature
        </CardTitle>
        <CardDescription>
          Electronically sign {documentType} for {patientName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Signer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="signer-name">Full Name *</Label>
            <Input
              id="signer-name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="signer-title">Title/Position</Label>
            <Input
              id="signer-title"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              placeholder="e.g., Doctor, Provider, etc."
            />
          </div>
        </div>

        {/* Signature Canvas */}
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="border border-gray-200 rounded cursor-crosshair w-full"
              style={{ maxWidth: '100%', height: 'auto' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Click and drag to create your signature above
            </p>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearSignature}>
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={saveSignature}>
              <Save className="w-4 h-4 mr-2" />
              Save Signature
            </Button>
          </div>
        </div>

        {/* Signature Preview */}
        {signature && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Signature Captured</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Signed by:</span>
                <span className="font-medium">{signerName}</span>
              </div>
              {signerTitle && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Title:</span>
                  <span className="font-medium">{signerTitle}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
            <div className="mt-3 p-2 bg-white border rounded">
              <img src={signature} alt="Digital Signature" className="max-h-16" />
            </div>
          </div>
        )}

        {/* Legal Notice */}
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="flex items-center gap-2 font-medium mb-2">
            <User className="w-4 h-4" />
            Electronic Signature Agreement
          </h4>
          <p className="text-sm text-gray-600">
            By providing my electronic signature, I agree that this signature is legally equivalent 
            to my handwritten signature and I am authorizing the completion of this document. This 
            signature is binding and has the same legal effect as a handwritten signature.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
