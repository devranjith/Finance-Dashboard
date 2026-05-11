import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey || 'missing_key');

export interface AIStockPick {
  ticker: string;
  name: string;
  currentPrice: number;
  targetPrice: number;
  financials: {
    peRatio: number | string;
    debtToEquity: number | string;
    revenueGrowth: string;
  };
  thesis: string[];
  educationalInsight: string;
  scenarioName: string;
}

export async function generateStockInsightFromNews(headlines: string[]): Promise<AIStockPick> {
  if (!apiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in .env.local');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `You are Zorvyn AI, an elite financial advisor and educator.
Read the following live market headlines:
${headlines.map(h => `- ${h}`).join('\n')}

Based ONLY on these headlines, identify the most important trend right now. 
Then, select ONE real, publicly traded US stock that is directly impacted by this news.

Return your analysis strictly as a JSON object (no markdown, no code blocks, just raw JSON starting with { and ending with }).
Use this exact schema:
{
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "currentPrice": 150.00,
  "targetPrice": 180.00,
  "financials": {
    "peRatio": "28.5",
    "debtToEquity": "1.2",
    "revenueGrowth": "+8%"
  },
  "thesis": [
    "Short reason 1 why this stock benefits",
    "Short reason 2",
    "Short reason 3"
  ],
  "educationalInsight": "A 2-3 sentence explanation teaching the user WHY this specific news event affects this specific sector/stock.",
  "scenarioName": "A catchy 2-4 word title for this current market event"
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting from Gemini
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanedText) as AIStockPick;
  } catch (error) {
    console.error("Gemini AI generation failed:", error);
    throw error;
  }
}
