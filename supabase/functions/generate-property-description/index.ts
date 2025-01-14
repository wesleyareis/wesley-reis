import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const propertyData = await req.json()
    
    // Verificar se a chave da API está configurada
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      throw new Error('API key não configurada')
    }

    const configuration = new Configuration({
      apiKey: apiKey
    })
    const openai = new OpenAIApi(configuration)

    // Construir o prompt em português
    const prompt = `Crie uma descrição atraente para um imóvel com as seguintes características:
      - Título: ${propertyData.title}
      - Tipo: ${propertyData.type}
      - Quartos: ${propertyData.bedrooms}
      - Banheiros: ${propertyData.bathrooms}
      - Vagas: ${propertyData.parking}
      - Área: ${propertyData.area}m²
      - Cidade: ${propertyData.city}
      - Bairro: ${propertyData.neighborhood}
      - Características: ${propertyData.features.join(', ')}
      
      A descrição deve ser profissional, destacar os principais atributos e ter aproximadamente 3 parágrafos em português.`

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct", // Modelo mais recente para instruções
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    })

    const description = completion.data.choices[0]?.text?.trim()

    if (!description) {
      throw new Error('Não foi possível gerar a descrição')
    }

    return new Response(
      JSON.stringify({ description }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Erro:', error.message)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})