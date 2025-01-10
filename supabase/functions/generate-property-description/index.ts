import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { propertyDetails } = await req.json()

    const prompt = `Gere uma descrição profissional e atraente para um imóvel com as seguintes características:
    - Tipo: ${propertyDetails.type}
    - Quartos: ${propertyDetails.bedrooms}
    - Banheiros: ${propertyDetails.bathrooms}
    - Vagas: ${propertyDetails.parkingSpaces}
    - Área: ${propertyDetails.area}m²
    - Localização: ${propertyDetails.location}
    
    A descrição deve ser em português, enfatizar os pontos fortes do imóvel e ter um tom profissional de corretor.`

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
            content: 'Você é um corretor de imóveis profissional especializado em criar descrições atraentes para imóveis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    })

    const data = await response.json()
    const description = data.choices[0].message.content

    return new Response(
      JSON.stringify({ description }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})