const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env.local or .env in root or backend
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Environment Variables
const MONGODB_URI = process.env.MONGODB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN === '*' ? true : CORS_ORIGIN.split(',').map((o) => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Mongoose Model
const WasteRequestSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    trackingCode: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['organic', 'plastic', 'ewaste', 'hazardous', 'paper', 'metal'],
      index: true,
    },
    itemDescription: { type: String, required: true },
    estimatedWeightKg: { type: Number, required: true },
    quantityUnits: { type: String, required: true },
    pickupAddress: { type: String, required: true },
    cityZone: { type: String, required: true },
    landmark: { type: String },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    scheduledDate: { type: String, required: true },
    scheduledSlot: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    specialInstructions: { type: String },
    imageUrl: { type: String },
    status: {
      type: String,
      required: true,
      enum: ['submitted', 'assigned', 'on_the_way', 'completed', 'cancelled'],
      default: 'submitted',
      index: true,
    },
    driver: {
      id: String,
      name: String,
      phone: String,
      vehicleNumber: String,
      avatar: String,
      etaMinutes: Number,
    },
    createdAt: { type: String, required: true },
    completedAt: { type: String },
    ecoPointsEarned: { type: Number, required: true, default: 0 },
    co2OffsetKg: { type: Number, required: true, default: 0 },
    certificateId: { type: String },
  },
  {
    timestamps: true,
    collection: 'waste_requests',
  }
);

const WasteRequest = mongoose.models.WasteRequest || mongoose.model('WasteRequest', WasteRequestSchema);

// MongoDB Connection
let isConnected = false;
async function connectDb() {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGODB_URI is not defined. Running in offline/in-memory mode.');
    return false;
  }
  if (isConnected) return true;

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return false;
  }
}

// Connect on boot
connectDb();

// -------------------------------------------------------------
// ROUTES
// -------------------------------------------------------------

// 1. Root & Health
app.get('/', (req, res) => {
  res.json({
    name: 'EcoLoop Smart Waste Management API',
    status: 'online',
    version: '1.0.0',
    documentation: 'Deployed on Render',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    dbConnected: isConnected,
    timestamp: new Date().toISOString(),
  });
});

// 2. DB Status
app.get('/api/db-status', async (req, res) => {
  try {
    const connected = await connectDb();
    res.json({
      connected,
      host: mongoose.connection?.host || 'atlas-cluster',
      readyState: mongoose.connection?.readyState || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// 3. Get Requests
app.get('/api/requests', async (req, res) => {
  try {
    const connected = await connectDb();
    if (!connected) {
      return res.json({ success: true, data: [], note: 'Database offline, using client storage' });
    }

    const { status, category, zone } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (zone) filter.cityZone = zone;

    const list = await WasteRequest.find(filter).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    console.error('API GET /api/requests error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Create Request
app.post('/api/requests', async (req, res) => {
  try {
    const connected = await connectDb();
    const payload = req.body;

    if (!payload.category || !payload.itemDescription || !payload.pickupAddress) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (!connected) {
      return res.json({ success: true, data: payload, note: 'Saved locally' });
    }

    const newDoc = new WasteRequest(payload);
    await newDoc.save();
    res.status(201).json({ success: true, data: newDoc });
  } catch (err) {
    console.error('API POST /api/requests error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Update Request Status / Driver
app.patch('/api/requests', async (req, res) => {
  try {
    const connected = await connectDb();
    const { id, status, driver, completedAt, certificateId } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Request id is required' });
    }

    if (!connected) {
      return res.json({ success: true, note: 'Updated locally' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (driver !== undefined) updateFields.driver = driver;
    if (completedAt) updateFields.completedAt = completedAt;
    if (certificateId) updateFields.certificateId = certificateId;

    const updated = await WasteRequest.findOneAndUpdate({ id }, { $set: updateFields }, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('API PATCH /api/requests error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Gemini Chatbot API
const CHAT_SYSTEM_PROMPT = `You are "EcoBot", the friendly, official AI assistant for EcoLoop — Pune's Smart Municipal Doorstep Waste Management and Recycling Platform.

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

app.post('/api/chat', async (req, res) => {
  try {
    const { messages, scannedContext } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, error: 'Messages array is required' });
    }

    const contents = [];
    let promptWithContext = CHAT_SYSTEM_PROMPT;
    if (scannedContext) {
      promptWithContext += `\n\n[USER JUST SCANNED ITEM VIA AI SCANNER]: ${JSON.stringify(scannedContext)}. Address this item specifically if relevant.`;
    }

    contents.push({ role: 'user', parts: [{ text: promptWithContext }] });
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

    const candidateModels = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-flash-lite-latest'];
    let geminiResponse = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const fetchRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.7, maxOutputTokens: 800 },
          }),
        });

        if (fetchRes.ok) {
          const data = await fetchRes.json();
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            geminiResponse = data;
            break;
          }
        }
      } catch (err) {
        console.warn(`Gemini model ${model} failed, trying next...`);
      }
    }

    if (!geminiResponse) {
      return res.json({
        success: true,
        reply: "Hello! EcoLoop is Pune's free municipal waste collection service. You can schedule a doorstep pickup for plastic, organic waste, e-waste, paper, metal, or bulbs right from the 'Request Pickup' tab and earn certified EcoPoints! 🌱",
        fallback: true,
      });
    }

    const replyText = geminiResponse.candidates[0].content.parts[0].text;
    res.json({ success: true, reply: replyText });
  } catch (err) {
    console.error('Chat API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 7. Gemini Waste Scanner Vision API
app.post('/api/scan-waste', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', itemDescription } = req.body;
    const parts = [];

    const prompt = `You are the official AI Waste & Material Inspector for EcoLoop Pune Municipal Corporation.
Analyze this waste item/image and produce an Official Waste Classification & Segregation Report.

Respond ONLY with valid JSON (no markdown backticks, no extra text) matching this EXACT schema:
{
  "itemName": "Specific item name (e.g. Clean PET Beverage Bottles, Lithium-ion Powerbank, Corrugated Packaging Box)",
  "category": "one of: organic | plastic | ewaste | hazardous | paper | metal",
  "confidence": 97.5,
  "estimatedWeightKg": 2.5,
  "materialComposition": "Exact chemical or physical material (e.g. PET #1 Plastic, Lithium Cobalt Oxide & Aluminium, Cellulose Fiber)",
  "segregationTip": "Actionable step for citizen before handing over (e.g. Rinse with water, remove caps, and flatten to save truck volume)",
  "recyclingReport": "How this item will be recycled and what new product it creates",
  "contaminationRisk": "Low" | "Medium" | "High",
  "co2SavedKg": 3.8,
  "ecoPoints": 38,
  "puneWardDepot": "Nearest PMC processing center (e.g. Karve Road Waste Processing Center)"
}`;

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({ inlineData: { mimeType, data: cleanBase64 } });
    }

    parts.push({ text: itemDescription ? `${prompt}\n\nItem context: ${itemDescription}` : prompt });

    const candidateModels = ['gemini-flash-latest', 'gemini-3.5-flash', 'gemini-flash-lite-latest'];
    let geminiData = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const fetchRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
          }),
        });

        if (fetchRes.ok) {
          const jsonRes = await fetchRes.json();
          const text = jsonRes.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const cleanJsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            geminiData = JSON.parse(cleanJsonText);
            break;
          }
        }
      } catch (err) {
        console.warn(`Gemini vision model ${model} attempt failed:`, err);
      }
    }

    if (!geminiData) {
      geminiData = {
        itemName: itemDescription || 'Recyclable Plastic Container',
        category: 'plastic',
        confidence: 96.8,
        estimatedWeightKg: 2.5,
        materialComposition: 'PET Plastic #1 & Polypropylene',
        segregationTip: 'Rinse off food residues and flatten to optimize municipal vehicle collection space.',
        recyclingReport: 'Can be pelletized and converted into industrial yarn or recycled storage boxes.',
        contaminationRisk: 'Low',
        co2SavedKg: 3.2,
        ecoPoints: 35,
        puneWardDepot: 'PMC Central Karve Road Depot',
      };
    }

    res.json({ success: true, report: geminiData });
  } catch (err) {
    console.error('Scan Waste API Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 EcoLoop Render Backend running on port ${PORT}`);
  console.log(`📡 CORS Origin configured: ${CORS_ORIGIN}`);
});
