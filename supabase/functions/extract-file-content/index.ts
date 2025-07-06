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
      // PDF files - For now, provide instructions to convert to text
      console.log('PDF file detected - providing conversion instructions');
      extractedContent = `PDF File Detected: ${file.name}

To use this PDF with the AI Form Builder, please:

1. Open the PDF file on your computer
2. Select all text content (Ctrl+A or Cmd+A)
3. Copy the text (Ctrl+C or Cmd+C)  
4. Paste the content into the "Form Content" text area below

If the PDF contains forms or complex layouts:
- Try using Adobe Reader or another PDF viewer with good text selection
- For scanned PDFs, you may need to use OCR software first
- Consider converting the PDF to a Word document first

This approach ensures accurate text extraction for the AI form builder.`;
    }
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileType === 'application/msword' ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc')
    ) {
      // Word documents - provide instructions for manual extraction
      console.log('Word document detected - providing conversion instructions');
      extractedContent = `Word Document Detected: ${file.name}

To use this Word document with the AI Form Builder, please:

1. Open the Word document on your computer
2. Select all content (Ctrl+A or Cmd+A)
3. Copy the text (Ctrl+C or Cmd+C)
4. Paste the content into the "Form Content" text area below

This ensures all form fields, questions, and formatting are preserved for accurate AI processing.`;
    }
    else if (fileType === 'application/rtf' || fileName.endsWith('.rtf')) {
      // RTF files - provide instructions for manual extraction
      console.log('RTF document detected - providing conversion instructions');
      extractedContent = `RTF Document Detected: ${file.name}

To use this RTF document with the AI Form Builder, please:

1. Open the RTF document in a word processor (Word, WordPad, etc.)
2. Select all content (Ctrl+A or Cmd+A)
3. Copy the text (Ctrl+C or Cmd+C)
4. Paste the content into the "Form Content" text area below

This ensures proper text extraction for the AI form builder.`;
    }
    else {
      console.error('Unsupported file type:', fileType);
      throw new Error(`Unsupported file type: ${fileType}. Currently supported: Text files (.txt, .md). For PDF/Word files, please copy and paste the content directly into the form.`);
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
