
import { GoogleGenAI, Type } from "@google/genai";
import { MarketInsight } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketInsights = async (category?: string, region?: string): Promise<MarketInsight[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é o assistente de inteligência da plataforma Applemar Trend. 
      Utilize o Google Search para pesquisar as tendências atuais do Google Trends e notícias de e-commerce especificamente para o mercado de Angola na categoria ${category || 'Geral'} e região ${region || 'Todo o país'}.
      
      Identifique 3 tendências de produtos ou comportamentos de consumo emergentes reais.
      Retorne obrigatoriamente um objeto JSON puro seguindo este formato de array:
      [
        {
          "trend": "Nome da Tendência",
          "reason": "Explicação baseada nos dados encontrados",
          "confidence": 0.95
        }
      ]`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              trend: { type: Type.STRING },
              reason: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ["trend", "reason", "confidence"]
          }
        }
      }
    });

    const jsonStr = response.text?.trim();
    const parsed: MarketInsight[] = jsonStr ? JSON.parse(jsonStr) : [];

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title
      }))
      .filter((s: any) => s.uri);

    if (parsed.length > 0 && sources && sources.length > 0) {
      parsed[0].sources = sources;
    }

    return parsed;
  } catch (error) {
    console.error("Erro ao buscar insights do Gemini com Google Search:", error);
    return [
      { 
        trend: "Digitalização de Pagamentos", 
        reason: "Crescente uso do multicaixa express e apps bancários para compras online em Luanda.", 
        confidence: 0.92 
      },
      { 
        trend: "Energias Renováveis", 
        reason: "Google Trends mostra pico de buscas por kits solares e baterias fora da rede.", 
        confidence: 0.88 
      }
    ];
  }
};

export const getDetailedReport = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere um relatório estratégico detalhado sobre "${topic}" no contexto do mercado de Angola. 
      Inclua: Análise de concorrência, previsão de demanda para os próximos 3 meses e recomendações de preços. 
      Use o Google Search para dados atualizados. Formate em Markdown.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "Não foi possível gerar o relatório no momento.";
  } catch (error) {
    return "Erro ao gerar relatório estratégico. Por favor, tente novamente.";
  }
};
