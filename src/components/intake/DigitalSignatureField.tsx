
import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { PenTool, RotateCcw, Check, X } from 'lucide-react';

interface SignatureValue {
  signature?: string;
  signerName?: string;
  signedDate?: string;
  consented?: boolean;
}

interface DigitalSignatureFieldProps {
  field: {
    id: string;
    label: string;
    required?: boolean;
    consentText?: string;
    signerNameRequired?: boolean;
    dateRequired?: boolean;
  };
  value: SignatureValue;
  onChange: (value: SignatureValue) => void;
  error?: string;
}

export const DigitalSignatureField: React.FC<DigitalSignatureFieldProps> = ({
  field,
  value = {},
  onChange,
  error
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);
  const [signerName, setSignerName] = useState(value.signerName || '');
  const [consented, setConsented] = useState(value.consented || false);

  useEffect(() => {
    if (value.signature && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = value.signature;
        setHasSigned(true);
      }
    }
  }, [value.signature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const canvas = canvasRef.current;
    if (canvas) {
      const signatureData = canvas.toDataURL();
      updateSignature({ signature: signatureData });
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    updateSignature({ signature: '' });
  };

  const updateSignature = (updates: Partial<typeof value>) => {
    const newValue = {
      ...value,
      ...updates,
      signedDate: updates.signature ? new Date().toISOString() : value.signedDate
    };
    onChange(newValue);
  };

  const handleSignerNameChange = (name: string) => {
    setSignerName(name);
    updateSignature({ signerName: name });
  };

  const handleConsentChange = (checked: boolean) => {
    setConsented(checked);
    updateSignature({ consented: checked });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas for smooth drawing
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium block">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {field.consentText && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={consented}
                onCheckedChange={handleConsentChange}
                className="mt-1"
              />
              <div className="text-sm text-blue-900">
                {field.consentText}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {field.signerNameRequired && (
        <div>
          <label className="text-sm font-medium mb-2 block">Full Name</label>
          <Input
            value={signerName}
            onChange={(e) => handleSignerNameChange(e.target.value)}
            placeholder="Enter your full legal name"
            className={error && !signerName ? 'border-red-300' : ''}
          />
        </div>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <PenTool className="w-4 h-4" />
            Digital Signature
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className={`border-2 border-dashed cursor-crosshair w-full ${
                error && !hasSigned ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ touchAction: 'none' }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            {!hasSigned && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-400 text-sm">Sign here</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clearSignature}
              className="flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Clear
            </Button>
            
            {hasSigned && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                Signed
                {value.signedDate && (
                  <span className="text-gray-500 ml-2">
                    {new Date(value.signedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">
            By signing above, you acknowledge that this electronic signature has the same legal effect as a handwritten signature.
          </p>
        </CardContent>
      </Card>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
