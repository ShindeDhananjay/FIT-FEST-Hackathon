import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are "EcoBot", the friendly, official AI assistant for EcoLoop — Pune's Smart Municipal Doorstep Waste Management and Recycling Platform.

Your role is to help everyday Pune citizens with:
1. Waste segregation: Tell users clearly which category their items belong to:
   - Organic & Kitchen (🥬 Food scraps, peels, leaves - compostable)
   - Dry Plastics (🧴 Bottles, tubs, packets - rinse & crush)
   - Paper & Cardboard (📦 Boxes, newspapers, cartons)
   - Electronics / E-Waste (📱 Old phones, chargers, batteries, wires)
   - Metal & Scrap (🥫 Cans, foil, appliances)
   - Hazardous (💡 Bulbs, paint, chemicals, medical)
2. EcoPoints & Rewards: Explain how citizens earn points per kg (+15 pts/kg for plastics, +40 pts/kg for e-waste) and digital Green Recycling Certificates.
3. Collection logistics: Doorstep pickup is 100% FREE across all Pune Municipal Corporation (PMC) wards (Kothrud, Shivaji Nagar, Baner, Hinjewadi, Hadapsar, Viman Nagar, etc.) using electric zero-emission vehicles.
4. AI Waste Scanner: Explain how citizens can snap a photo to instantly identify items.

Tone & Style:
- Warm, polite, encouraging, and very easy to understand for non-technical users.
- Use simple English. If the user writes in Hindi or Marathi, respond warmly in that language.
- Use helpful bullet points and cheerful emojis.
- Keep answers concise (2-4 brief paragraphs max).`;

export async function POST(req: Request) {
  try {
    const { messages, scannedContext } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: 'Messages array is required' }, { status: 400 });
    }

    // Format messages for Gemini API
    const contents: any[] = [];

    // System instruction injected into the conversation
    let promptWithContext = SYSTEM_PROMPT;
    if (scannedContext) {
      promptWithContext += `\n\n[USER JUST SCANNED ITEM VIA AI SCANNER]: ${JSON.stringify(scannedContext)}. Address this item specifically if relevant.`;
    }

    contents.push({
      role: 'user',
      parts: [{ text: promptWithContext }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Namaste! I am EcoBot, your EcoLoop Pune waste management & recycling assistant. How can I help you today? 🌱' }],
    });

    for (const m of messages) {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      });
    }

    // Call Gemini API with fallback models
    const candidateModels = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-flash-lite-latest'];
    let geminiResponse: any = null;
    let usedModel = '';

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            geminiResponse = data;
            usedModel = model;
            break;
          }
        }
      } catch (err) {
        console.warn(`Gemini model ${model} failed, trying next...`, err);
      }
    }

    if (!geminiResponse) {
      // Graceful smart fallback if network fails
      return NextResponse.json({
        success: true,
        reply: "Hello! EcoLoop is Pune's free municipal waste collection service. You can schedule a doorstep pickup for plastic, organic waste, e-waste, paper, metal, or bulbs right from the 'Request Pickup' tab and earn certified EcoPoints! 🌱",
        fallback: true,
      });
    }

    const replyText = geminiResponse.candidates[0].content.parts[0].text;
    return NextResponse.json({
      success: true,
      reply: replyText,
      model: usedModel,
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      success: true,
      reply: "I'm here to help with all your waste segregation, doorstep pickup schedules, and EcoPoints rewards in Pune! Feel free to ask any question.",
      fallback: true,
    });
  }
}
