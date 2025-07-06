import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Extract file content function called');
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Processing request...');
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file provided in request');
      throw new Error('No file provided');
    }

    console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    let extractedContent = '';
    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    // Handle different file types
    if (fileType === 'text/plain' || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      // Plain text files
      console.log('Processing as text file');
      extractedContent = await file.text();
    } 
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      // PDF files - check if OpenAI key exists
      if (!Deno.env.get('OPENAI_API_KEY')) {
        console.error('OpenAI API key not found for PDF processing');
        throw new Error('PDF processing requires OpenAI API key. Please configure OPENAI_API_KEY in Supabase secrets.');
      }
      console.log('Processing as PDF file with AI');
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      extractedContent = await extractPDFWithAI(base64);
    }
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc')
    ) {
      // Word documents - check if OpenAI key exists
      if (!Deno.env.get('OPENAI_API_KEY')) {
        console.error('OpenAI API key not found for Word document processing');
        throw new Error('Word document processing requires OpenAI API key. Please configure OPENAI_API_KEY in Supabase secrets.');
      }
      console.log('Processing as Word document with AI');
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      extractedContent = await extractDocumentWithAI(base64, 'word');
    }
    else if (fileType === 'application/rtf' || fileName.endsWith('.rtf')) {
      // RTF files
      if (!Deno.env.get('OPENAI_API_KEY')) {
        console.error('OpenAI API key not found for RTF processing');
        throw new Error('RTF processing requires OpenAI API key. Please configure OPENAI_API_KEY in Supabase secrets.');
      }
      console.log('Processing as RTF file with AI');
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      extractedContent = await extractDocumentWithAI(base64, 'rtf');
    }
    else {
      console.error('Unsupported file type:', fileType);
      throw new Error(`Unsupported file type: ${fileType}. Please upload PDF, Word, Text, or Markdown files.`);
    }

    if (!extractedContent || extractedContent.trim().length === 0) {
      console.error('No content extracted from file');
      throw new Error('No content could be extracted from the file');
    }

    console.log('Successfully extracted content, length:', extractedContent.length);

    return new Response(
      JSON.stringify({ 
        content: extractedContent,
        fileName: file.name,
        fileType: fileType
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('File extraction error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check function logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function extractPDFWithAI(base64Content: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a document text extraction assistant. Extract all text content from the provided PDF file. Focus on form fields, questions, labels, and any structured content. Preserve the original structure and formatting as much as possible.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please extract all text content from this PDF file, paying special attention to form fields, questions, and labels:'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${base64Content}`
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`PDF extraction failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}

async function extractDocumentWithAI(base64Content: string, docType: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a document text extraction assistant. Extract all text content from the provided ${docType.toUpperCase()} document. Focus on form fields, questions, labels, and any structured content. Preserve the original structure and formatting as much as possible.`
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Please extract all text content from this ${docType.toUpperCase()} document, paying special attention to form fields, questions, and labels:`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/${docType === 'word' ? 'vnd.openxmlformats-officedocument.wordprocessingml.document' : 'rtf'};base64,${base64Content}`
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`Document extraction failed: ${response.statusText}`);
  }

  const result = await response.json();
  return result.choices[0].message.content;
}