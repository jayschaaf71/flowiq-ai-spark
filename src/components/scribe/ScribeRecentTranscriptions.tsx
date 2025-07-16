
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface VoiceRecording {
  id: string;
  transcription: string | null;
  ai_summary: string | null;
  status: string;
  created_at: string;
  duration_seconds: number | null;
  source: string;
}

export const ScribeRecentTranscriptions = () => {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentRecordings();
  }, []);

  const fetchRecentRecordings = async () => {
    try {
      const { data, error } = await supabase
        .from('voice_recordings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recordings:', error);
        return;
      }

      setRecordings(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Transcriptions</CardTitle>
          <CardDescription>Latest voice-to-text sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                    <div>
                      <div className="w-32 h-4 bg-gray-200 rounded mb-1"></div>
                      <div className="w-24 h-3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transcriptions</CardTitle>
        <CardDescription>Latest voice-to-text sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recordings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No transcriptions yet</p>
              <p className="text-sm">Start recording to see your transcriptions here</p>
            </div>
          ) : (
            recordings.map((recording) => (
              <div key={recording.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {recording.transcription ? 
                        `${recording.transcription.substring(0, 40)}...` : 
                        'Voice Recording'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {recording.source} • {formatDistanceToNow(new Date(recording.created_at), { addSuffix: true })}
                      {recording.duration_seconds && ` • ${Math.round(recording.duration_seconds)}s`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(recording.status)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
