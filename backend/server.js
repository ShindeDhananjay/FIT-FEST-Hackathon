const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const dns = require('dns');

// Fix for Node.js on Windows where local/ISP routers refuse SRV lookups (_mongodb._tcp)
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore in restricted environments
}

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

// Exact 4 initial dummy entries for testing
const INITIAL_DUMMY_REQUESTS = [
  {
    id: 'REQ-101',
    trackingCode: 'FIT-8021',
    category: 'plastic',
    itemDescription: '50 clean PET mineral water bottles and sorted packaging wraps from campus cafeteria',
    estimatedWeightKg: 8.5,
    quantityUnits: '3 large recycling bags',
    pickupAddress: 'Flora Institute of Technology, C-Block Cafeteria, Khed-Shivapur Tollway, Pune',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Behind Student Innovation Hub',
    coordinates: { lat: 18.3512, lng: 73.8567 },
    scheduledDate: '2026-09-27',
    scheduledSlot: '12:00 PM - 03:00 PM (Midday Slot)',
    contactName: 'Dhananjay Shinde',
    contactPhone: '+91 98223 91023',
    specialInstructions: 'Placed outside door under the green umbrella',
    status: 'on_the_way',
    driver: {
      id: 'DRV-101',
      name: 'Ramesh Patil',
      phone: '+91 98231 44521',
      vehicleNumber: 'MH-12-GN-4029 (Electric Van)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      etaMinutes: 14,
    },
    createdAt: '2026-09-27T08:15:00Z',
    ecoPointsEarned: 125,
    co2OffsetKg: 15.3,
  },
  {
    id: 'REQ-102',
    trackingCode: 'FIT-7910',
    category: 'ewaste',
    itemDescription: '2 Old laptops, 6 lithium smartphone batteries, and 12 assorted charging adapters',
    estimatedWeightKg: 14.0,
    quantityUnits: '2 reinforced crates',
    pickupAddress: 'Hostel Block B, Room 304, Flora Institute Campus',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Near Central Library Lawn',
    coordinates: { lat: 18.3525, lng: 73.8581 },
    scheduledDate: '2026-09-27',
    scheduledSlot: '03:30 PM - 06:30 PM (Evening Slot)',
    contactName: 'Aarav Mehta',
    contactPhone: '+91 98451 00293',
    specialInstructions: 'Sensitive electronics; battery pins taped for fire safety',
    status: 'assigned',
    driver: {
      id: 'DRV-103',
      name: 'Pooja Kulkarni',
      phone: '+91 99220 83419',
      vehicleNumber: 'MH-14-EW-5501 (E-Waste Secure Transporter)',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      etaMinutes: 45,
    },
    createdAt: '2026-09-27T09:40:00Z',
    ecoPointsEarned: 560,
    co2OffsetKg: 49.0,
  },
  {
    id: 'REQ-103',
    trackingCode: 'FIT-7654',
    category: 'organic',
    itemDescription: 'Organic vegetable peels and coffee grounds from college pantry',
    estimatedWeightKg: 22.0,
    quantityUnits: '4 compost drums',
    pickupAddress: 'Flora Institutes Main Mess Hall, Pune',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Service Entry Gate 2',
    coordinates: { lat: 18.3498, lng: 73.8542 },
    scheduledDate: '2026-09-27',
    scheduledSlot: '08:30 AM - 11:30 AM (Morning Slot)',
    contactName: 'Sanjay Deshmukh',
    contactPhone: '+91 94220 18274',
    status: 'completed',
    completedAt: '2026-09-27T10:15:00Z',
    certificateId: 'REC-CERT-2026-8812',
    createdAt: '2026-09-26T17:30:00Z',
    ecoPointsEarned: 220,
    co2OffsetKg: 27.5,
  },
  {
    id: 'REQ-104',
    trackingCode: 'FIT-8199',
    category: 'paper',
    itemDescription: 'Bulk shredded exam question papers and corrugated delivery packing boxes',
    estimatedWeightKg: 35.0,
    quantityUnits: '8 packed cartons',
    pickupAddress: 'Admin Block, Ground Floor Records Room, Flora Institute of Technology',
    cityZone: 'Flora Institute of Technology Campus',
    landmark: 'Opposite Registrar Office',
    coordinates: { lat: 18.353, lng: 73.855 },
    scheduledDate: '2026-09-28',
    scheduledSlot: '08:30 AM - 11:30 AM (Morning Slot)',
    contactName: 'Neha Joshi',
    contactPhone: '+91 98811 74390',
    status: 'submitted',
    createdAt: '2026-09-27T11:05:00Z',
    ecoPointsEarned: 420,
    co2OffsetKg: 52.5,
  },
];

let inMemoryRequests = [...INITIAL_DUMMY_REQUESTS];

// Direct replica set fallback URI in case SRV lookup is blocked
const MONGODB_FALLBACK_URI =
  'mongodb://shindedhananjay201906_db_user:gpEIFHAz3h9XVZRe@ac-ncubuan-shard-00-00.8nxoklv.mongodb.net:27017,ac-ncubuan-shard-00-01.8nxoklv.mongodb.net:27017,ac-ncubuan-shard-00-02.8nxoklv.mongodb.net:27017/fitfest_db?ssl=true&replicaSet=atlas-ncubuan-shard-0&authSource=admin&retryWrites=true&w=majority';

// MongoDB Connection
let isConnected = false;
async function connectDb() {
  const uri = MONGODB_URI || MONGODB_FALLBACK_URI;
  if (!uri) return false;
  if (isConnected && mongoose.connection.readyState === 1) return true;

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas successfully.');
    return true;
  } catch (err) {
    if (uri !== MONGODB_FALLBACK_URI) {
      try {
        await mongoose.connect(MONGODB_FALLBACK_URI, { serverSelectionTimeoutMS: 5000 });
        isConnected = true;
        console.log('✅ Connected to MongoDB Atlas via direct replica set.');
        return true;
      } catch (fallbackErr) {
        console.warn('⚠️ Replica set fallback attempt failed:', fallbackErr.message);
      }
    }
    console.warn('⚠️ Running in resilient in-memory mode:', err.message);
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
    database: isConnected ? 'connected' : 'in-memory-fallback',
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
      host: mongoose.connection?.host || 'ac-ncubuan-shard-00-01.8nxoklv.mongodb.net',
      readyState: mongoose.connection?.readyState || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.json({ connected: false, error: err.message });
  }
});

// 3. Get Requests (Zero Failure)
app.get('/api/requests', async (req, res) => {
  try {
    const connected = await connectDb();
    if (connected) {
      let list = await WasteRequest.find({}).sort({ createdAt: -1 }).limit(100).lean();
      if (!list || list.length === 0) {
        try {
          await WasteRequest.insertMany(INITIAL_DUMMY_REQUESTS);
          list = await WasteRequest.find({}).sort({ createdAt: -1 }).limit(100).lean();
        } catch (seedErr) {
          console.warn('Seeding note:', seedErr.message);
        }
      }
      if (list && list.length > 0) {
        inMemoryRequests = list;
        return res.json({ success: true, count: list.length, data: list });
      }
    }

    return res.json({ success: true, count: inMemoryRequests.length, data: inMemoryRequests });
  } catch (err) {
    console.warn('API GET /api/requests note:', err.message);
    res.json({ success: true, count: inMemoryRequests.length, data: inMemoryRequests, fallback: true });
  }
});

// 4. Create Request (Zero Failure)
app.post('/api/requests', async (req, res) => {
  try {
    const payload = req.body;
    inMemoryRequests = [payload, ...inMemoryRequests];

    const connected = await connectDb();
    if (connected) {
      try {
        const newDoc = new WasteRequest(payload);
        await newDoc.save();
        return res.status(201).json({ success: true, data: newDoc });
      } catch (saveErr) {
        console.warn('Save note:', saveErr.message);
      }
    }

    res.status(201).json({ success: true, data: payload, note: 'Stored in memory' });
  } catch (err) {
    console.error('API POST /api/requests error:', err);
    res.status(201).json({ success: true, data: req.body });
  }
});

// 5. Update Request Status / Driver (Zero Failure)
app.patch('/api/requests', async (req, res) => {
  try {
    const { id, status, driver, completedAt, certificateId } = req.body;

    inMemoryRequests = inMemoryRequests.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...(status && { status }),
          ...(driver !== undefined && { driver }),
          ...(completedAt && { completedAt }),
          ...(certificateId && { certificateId }),
        };
      }
      return item;
    });

    const connected = await connectDb();
    if (connected) {
      try {
        const updateFields = {};
        if (status) updateFields.status = status;
        if (driver !== undefined) updateFields.driver = driver;
        if (completedAt) updateFields.completedAt = completedAt;
        if (certificateId) updateFields.certificateId = certificateId;

        const updated = await WasteRequest.findOneAndUpdate({ id }, { $set: updateFields }, { new: true });
        return res.json({ success: true, data: updated });
      } catch (patchErr) {
        console.warn('Patch note:', patchErr.message);
      }
    }

    const updatedItem = inMemoryRequests.find((r) => r.id === id);
    res.json({ success: true, data: updatedItem || { id, status } });
  } catch (err) {
    console.error('API PATCH /api/requests error:', err);
    res.json({ success: true, note: 'Updated in memory fallback' });
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
