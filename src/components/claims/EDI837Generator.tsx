import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Download,
  Upload,
  Eye
} from "lucide-react";

export const EDI837Generator = () => {
  const [selectedClaims, setSelectedClaims] = useState([]);
  const [batchStatus, setBatchStatus] = useState("ready");
  const [generatedEDI, setGeneratedEDI] = useState("");

  const pendingClaims = [
    { id: "CLM001", patient: "Sarah Johnson", procedure: "D9944", amount: 1200, provider: "Dr. Smith" },
    { id: "CLM002", patient: "Mike Chen", procedure: "D9945", amount: 800, provider: "Dr. Smith" },
    { id: "CLM003", patient: "Lisa Williams", procedure: "D9946", amount: 1400, provider: "Dr. Johnson" }
  ];

  const generateEDI837 = async () => {
    setBatchStatus("generating");
    
    // Simulate EDI generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const ediContent = `ISA*00*          *00*          *ZZ*SENDER_ID      *ZZ*RECEIVER_ID    *${new Date().toISOString().slice(0,10).replace(/-/g,'')}*${new Date().toTimeString().slice(0,8).replace(/:/g,'')}*^*00501*000000001*0*P*:~
GS*HC*SENDER_ID*RECEIVER_ID*${new Date().toISOString().slice(0,10).replace(/-/g,'')}*${new Date().toTimeString().slice(0,8).replace(/:/g,'')}*1*X*005010X222A1~
ST*837*0001*005010X222A1~
BHT*0019*00*0001*${new Date().toISOString().slice(0,10).replace(/-/g,'')}*${new Date().toTimeString().slice(0,8).replace(/:/g,'')}*CH~
NM1*41*2*DENTAL SLEEP IQ*****46*12345~
PER*IC*JOHN DOE*TE*5551234567~`;
    
    setGeneratedEDI(ediContent);
    setBatchStatus("generated");
  };

  const submitToClearinghouse = async () => {
    setBatchStatus("submitting");
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBatchStatus("submitted");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            EDI 837P Generator
          </CardTitle>
          <CardDescription>
            Generate and submit professional claims in EDI 837P format
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claims Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Ready Claims</CardTitle>
            <CardDescription>
              Select claims to include in EDI batch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingClaims.map((claim) => (
                <div key={claim.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{claim.patient}</div>
                    <div className="text-sm text-gray-600">
                      {claim.procedure} • ${claim.amount} • {claim.provider}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedClaims.includes(claim.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedClaims(prev => [...prev, claim.id]);
                      } else {
                        setSelectedClaims(prev => prev.filter(id => id !== claim.id));
                      }
                    }}
                    className="w-4 h-4"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Selected Claims:</span>
                <Badge>{selectedClaims.length}</Badge>
              </div>
              
              <Button 
                onClick={generateEDI837}
                disabled={selectedClaims.length === 0 || batchStatus === "generating"}
                className="w-full"
              >
                {batchStatus === "generating" ? (
                  <>
                    <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Generating EDI...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate EDI 837P
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* EDI Preview & Submission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              EDI Preview
            </CardTitle>
            <CardDescription>
              Review generated EDI content before submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedEDI ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Generate EDI to preview content</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={generatedEDI}
                  readOnly
                  className="h-40 font-mono text-xs"
                />
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Validate
                  </Button>
                </div>

                {batchStatus === "generated" && (
                  <Button 
                    onClick={submitToClearinghouse}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit to Clearinghouse
                  </Button>
                )}

                {batchStatus === "submitting" && (
                  <Button disabled className="w-full">
                    <Upload className="w-4 h-4 mr-2 animate-pulse" />
                    Submitting to Clearinghouse...
                  </Button>
                )}

                {batchStatus === "submitted" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="font-medium">Successfully Submitted</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Batch ID: EDI_{new Date().getTime()} • {selectedClaims.length} claims submitted
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>
            Track EDI batch submissions and acknowledgments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { id: "EDI_001", date: "2024-01-15", claims: 5, status: "accepted", ack: "TA1_001" },
              { id: "EDI_002", date: "2024-01-14", claims: 3, status: "accepted", ack: "TA1_002" },
              { id: "EDI_003", date: "2024-01-13", claims: 7, status: "rejected", ack: "TA1_003" }
            ].map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{submission.id}</div>
                  <div className="text-sm text-gray-600">
                    {submission.date} • {submission.claims} claims • ACK: {submission.ack}
                  </div>
                </div>
                <Badge className={
                  submission.status === "accepted" ? "bg-green-100 text-green-700" :
                  submission.status === "rejected" ? "bg-red-100 text-red-700" :
                  "bg-yellow-100 text-yellow-700"
                }>
                  {submission.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};