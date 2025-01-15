import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, type, bedrooms, bathrooms, parking, area, city, neighborhood, features } = await req.json();

    // Validação dos dados necessários
    if (!title || !type || !city) {
      throw new Error('Dados essenciais do imóvel não fornecidos (título, tipo e cidade são obrigatórios)');
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('API key não configurada');
    }

    console.log('Dados recebidos:', { title, type, bedrooms, bathrooms, parking, area, city, neighborhood, features });

    const prompt = `Crie uma descrição atraente para um imóvel com as seguintes características:
      - Título: ${title}
      - Tipo: ${type}
      - Quartos: ${bedrooms || 0}
      - Banheiros: ${bathrooms || 0}
      - Vagas: ${parking || 0}
      - Área: ${area || 0}m²
      - Cidade: ${city}
      - Bairro: ${neighborhood || ''}
      - Características: ${features ? features.join(', ') : ''}
      
      A descrição deve ser profissional, destacar os principais atributos e ter aproximadamente 3 parágrafos em português.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um especialista em descrições imobiliárias profissionais.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Erro na resposta da OpenAI:', error);
      throw new Error('Falha ao gerar descrição com OpenAI');
    }

    const data = await response.json();
    const description = data.choices[0].message.content;

    return new Response(JSON.stringify({ description }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erro na função generate-property-description:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});