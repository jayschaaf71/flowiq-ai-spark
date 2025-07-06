import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      throw new Error('No file provided');
    }

    console.log('Processing file:', file.name, file.type, file.size);

    let content = '';
    
    // Handle different file types
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      content = await file.text();
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      // For PDF files, we'll return an error encouraging manual copy-paste
      // since PDF processing requires additional libraries
      throw new Error('PDF processing not available. Please copy and paste the text manually.');
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
      // For Word documents, we'll return an error encouraging manual copy-paste
      throw new Error('Word document processing not available. Please copy and paste the text manually.');
    } else {
      // Try to read as text for other file types
      try {
        content = await file.text();
      } catch (error) {
        throw new Error(`Unsupported file type: ${file.type}. Please copy and paste the text manually.`);
      }
    }

    if (!content.trim()) {
      throw new Error('No content found in file');
    }

    return new Response(
      JSON.stringify({ content: content.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('File extraction error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});