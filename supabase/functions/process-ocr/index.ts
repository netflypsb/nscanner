import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GOOGLE_VISION_API_KEY = Deno.env.get('GOOGLE_VISION_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { documentId } = await req.json()
    
    if (!GOOGLE_VISION_API_KEY) {
      throw new Error('Google Vision API key not configured')
    }

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

    // Call Google Cloud Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                source: {
                  imageUri: publicUrl,
                },
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        }),
      }
    )

    if (!visionResponse.ok) {
      const errorData = await visionResponse.text()
      console.error('Vision API error:', errorData)
      throw new Error('Failed to process image with Vision API')
    }

    const visionData = await visionResponse.json()
    const extractedText = visionData.responses[0]?.fullTextAnnotation?.text || ''

    console.log('Text extracted successfully')

    // Update the document with extracted text
    const { error: updateError } = await supabase
      .from('documents')
      .update({ ocr_text: extractedText })
      .eq('id', documentId)

    if (updateError) {
      console.error('Error updating document:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ text: extractedText }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
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