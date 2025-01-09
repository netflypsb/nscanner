import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { generatePDF } from './utils.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, format } = await req.json()

    if (!content || !format) {
      throw new Error('Content and format are required')
    }

    let fileData: Uint8Array | string
    let contentType: string
    let filename: string

    switch (format) {
      case 'pdf':
        fileData = await generatePDF(content)
        contentType = 'application/pdf'
        filename = 'document.pdf'
        break
      case 'txt':
        fileData = content
        contentType = 'text/plain'
        filename = 'document.txt'
        break
      default:
        throw new Error('Unsupported format')
    }

    return new Response(fileData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})