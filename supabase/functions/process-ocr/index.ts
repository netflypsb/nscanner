import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createWorker } from 'https://esm.sh/tesseract.js@5.0.5'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId } = await req.json()

    if (!documentId) {
      throw new Error('Document ID is required')
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!)
    
    // Get document details
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', documentId)
      .single()

    if (docError || !document) {
      console.error('Error fetching document:', docError)
      throw new Error('Document not found')
    }

    // Get the document file URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('documents')
      .getPublicUrl(document.file_path)

    console.log('Processing document:', documentId)
    console.log('File URL:', publicUrl)

    // Initialize Tesseract worker
    const worker = await createWorker({
      logger: info => {
        if (info.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`);
        }
      },
    });

    try {
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      
      const { data: { text } } = await worker.recognize(publicUrl);
      
      await worker.terminate();

      console.log('Text extracted successfully');

      // Update the document with extracted text
      const { error: updateError } = await supabase
        .from('documents')
        .update({ ocr_text: text })
        .eq('id', documentId)

      if (updateError) {
        console.error('Error updating document:', updateError)
        throw updateError
      }

      return new Response(
        JSON.stringify({ text }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } catch (error) {
      console.error('Tesseract error:', error);
      await worker.terminate();
      throw new Error('OCR processing failed');
    }
  } catch (error) {
    console.error('Error in process-ocr function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})