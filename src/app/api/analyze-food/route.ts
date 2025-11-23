import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Inicializar OpenAI apenas quando a rota for chamada (não no build time)
let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY não configurada");
    }
    
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
  }
  
  return openaiClient;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar API key antes de processar
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Chave da API OpenAI não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente." },
        { status: 500 }
      );
    }

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Imagem não fornecida" },
        { status: 400 }
      );
    }

    // Validar se a imagem está no formato correto (base64)
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Formato de imagem inválido" },
        { status: 400 }
      );
    }

    // Validar tamanho da string base64 (aproximadamente 4MB após encoding)
    if (image.length > 6 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Imagem muito grande. Reduza o tamanho e tente novamente." },
        { status: 400 }
      );
    }

    console.log("✅ Validações passaram. Enviando para OpenAI...");
    console.log("📊 Tamanho da imagem (base64):", Math.round(image.length / 1024), "KB");

    const openai = getOpenAIClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analise esta imagem de comida e forneça as seguintes informações em formato JSON válido:
              {
                "foodName": "nome do prato ou alimento principal",
                "calories": número estimado de calorias totais,
                "protein": gramas de proteína,
                "carbs": gramas de carboidratos,
                "fat": gramas de gordura,
                "analysis": "análise detalhada da refeição, incluindo ingredientes identificados, porções estimadas e recomendações nutricionais (2-3 frases)"
              }
              
              IMPORTANTE: Retorne APENAS o JSON, sem texto adicional antes ou depois.
              Seja preciso nas estimativas nutricionais baseado no que você vê na imagem.`,
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      console.error("❌ Resposta vazia da OpenAI");
      throw new Error("Resposta vazia da OpenAI");
    }

    console.log("✅ Resposta recebida da OpenAI");
    console.log("📝 Conteúdo:", content.substring(0, 200) + "...");

    // Parse JSON from response - melhor tratamento
    let data;
    try {
      // Tentar parse direto primeiro
      data = JSON.parse(content);
    } catch {
      // Se falhar, tentar extrair JSON do texto
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error("❌ Formato de resposta inválido:", content);
        throw new Error("Formato de resposta inválido da OpenAI");
      }
      data = JSON.parse(jsonMatch[0]);
    }

    // Validar estrutura dos dados
    if (!data.foodName || typeof data.calories !== "number") {
      console.error("❌ Dados incompletos:", data);
      throw new Error("Dados incompletos na resposta");
    }

    console.log("✅ Análise concluída com sucesso!");
    console.log("🍽️ Prato:", data.foodName);
    console.log("🔥 Calorias:", data.calories);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("❌ ERRO DETALHADO:", error);
    
    // Melhor tratamento de erros
    let errorMessage = "Erro ao processar a imagem";
    let statusCode = 500;
    
    if (error instanceof Error) {
      console.error("❌ Mensagem do erro:", error.message);
      console.error("❌ Stack:", error.stack);
      
      if (error.message.includes("API key") || error.message.includes("Incorrect API key") || error.message.includes("OPENAI_API_KEY")) {
        errorMessage = "Chave da API OpenAI inválida ou não configurada. Configure OPENAI_API_KEY nas variáveis de ambiente.";
        statusCode = 500;
      } else if (error.message.includes("rate limit") || error.message.includes("Rate limit")) {
        errorMessage = "Limite de requisições atingido. Aguarde alguns segundos e tente novamente.";
        statusCode = 429;
      } else if (error.message.includes("invalid") || error.message.includes("Invalid")) {
        errorMessage = "Formato de imagem inválido. Tente outra foto.";
        statusCode = 400;
      } else if (error.message.includes("timeout") || error.message.includes("Timeout")) {
        errorMessage = "Tempo esgotado. Tente novamente com uma imagem menor.";
        statusCode = 408;
      } else if (error.message.includes("quota") || error.message.includes("insufficient_quota")) {
        errorMessage = "Cota da API OpenAI excedida. Verifique seu plano.";
        statusCode = 429;
      } else {
        // Usar a mensagem do erro original se for mais específica
        errorMessage = error.message || errorMessage;
      }
    }

    return NextResponse.json(
      { 
        error: errorMessage, 
        details: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// Rota GET para verificar se a API está configurada (não causa erro no build)
export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    configured: !!apiKey,
    message: apiKey 
      ? "API OpenAI configurada corretamente" 
      : "OPENAI_API_KEY não configurada. Configure nas variáveis de ambiente."
  });
}
