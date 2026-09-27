# 🌿 FitFest EcoLoop: Smart Waste Collection & Recycling Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-Backend-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render)](https://render.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Frontend-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com/)

> **Event**: FIT Fest Hackathon 2026 (Flora Institute of Technology & GDG Pune)  
> **Problem Statement 4**: Smart Waste Collection & Recycling Platform  
> **Theme**: *"Reduce Waste. Recycle More. Build a Cleaner Tomorrow."*  
> **Live Architecture**: Netlify (Frontend) + Render (Express API) + MongoDB Atlas + Google Gemini Vision & Chatbot  

---

## 🏆 Project Overview

**FitFest EcoLoop** is an intelligent, full-stack waste logistics and recycling platform engineered for urban campuses and municipal areas like Pune. It addresses segregation confusion, optimizes truck dispatching, rewards sustainable citizen behavior with localized incentives, and integrates Google Gemini AI for instant visual waste categorization.

### 🚩 The Problems We Solve
1. **Citizen Segregation Fatigue**: Difficulty identifying proper disposal protocol for tricky materials (e-waste, hazardous batteries, PET plastics, bio-waste).
2. **Blind Spot Logistics**: Municipal dispatchers and campus managers lack real-time visibility into collection queues, driver assignments, and GIS geographic distribution.
3. **Low Community Engagement**: Without tangible rewards and transparent impact tracking, recycling rates stagnate.

### 💡 The EcoLoop Solution
- 📸 **Gemini AI Waste Scanner**: Take or upload a photo to immediately detect recyclable materials, obtain PMC handling protocols, and 1-click prefill a pickup request.
- 💬 **EcoBot Pune Assistant**: Bilingual (English/Marathi) municipal chatbot capable of explaining segregation rules, PMPML transit rewards, and collection schedules.
- 🚚 **4-Stage Live Dispatch Pipeline**: Real-time status tracker (`Submitted` ➔ `Collector Assigned` ➔ `On the Way` ➔ `Completed/Recycled`) with driver telemetry and live ETA.
- 🛡️ **Dispatcher & Admin Fleet OS**: Operational command center with interactive GIS radar map, driver task allocation, and live pickup lifecycle toggling.
- 🎟️ **Localized Pune EcoRewards**: Redeem earned EcoPoints for Pune Metro transit cards, PMPML monthly bus passes, organic farm compost, and Swachh Bharat green certificates.
- 📱 **1000% Mobile-First Responsive**: Flawless experience across smartphones, tablets, and desktops with bottom navigation bar, safe paddings, and docked non-intrusive widgets.

---

## 🏗️ Architecture & Cloud Infrastructure

```
                      ┌────────────────────────────────────────┐
                      │          Citizen / Dispatcher          │
                      │     (Mobile, Tablet, Desktop)          │
                      └───────────────────┬────────────────────┘
                                          │
                      HTTPS Requests      │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          NETLIFY (Frontend)            │
                      │     Next.js 16 + React 19 + Tailwind   │
                      │     Global CDN Edge Distribution       │
                      └───────────────────┬────────────────────┘
                                          │
                     API Calls via        │
                     NEXT_PUBLIC_API_URL  │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │           RENDER (Backend)             │
                      │   Express.js API + CORS + Healthcheck  │
                      └──────────────┬──────────────────┬──────┘
                                     │                  │
                                     ▼                  ▼
                       ┌──────────────────────┐  ┌──────────────────────┐
                       │  MongoDB Atlas Cloud │  │   Google Gemini AI   │
                       │ (Persisted Requests) │  │  (Vision & Chatbot)  │
                       └──────────────────────┘  └──────────────────────┘
```

---

## ✨ Core Features & Modules

### 1. 🌿 Citizen Booking & Scheduling Wizard
- **Category Selection**: Dry Plastics, E-Waste & Electronics, Organic Compost, Paper & Cardboard, Hazardous & Batteries, Scrap Metals.
- **Pune Geotagging**: Pre-configured campus zones (Flora Institute of Technology, Katraj, Kothrud, Hinjewadi, Viman Nagar, Shivajinagar, Baner).
- **Smart Time Slots**: Morning (8 AM - 11 AM), Afternoon (12 PM - 3 PM), Evening (4 PM - 7 PM).
- **Estimated Weight & EcoPoints**: Instant calculation of points earned and CO₂ offset.

### 2. 🤖 Gemini AI Material Vision Classifier
- Upload or capture any waste item.
- Uses `gemini-1.5-flash` to extract material composition, segregation category, recyclability status, and handling precautions.
- Auto-populates the booking form with a single tap.

### 3. 💬 EcoBot Pune Virtual Assistant
- Interactive floating AI chatbot tuned with Pune municipal waste regulations (PMC) and Swachh Pune guidelines.
- Responsive docked interface that avoids overlapping mobile navigation bars and buttons.
- Answers FAQs regarding collection timings, hazardous waste drop-offs, and EcoRewards redemption.

### 4. 🚚 Live Pickup Tracker & Telemetry
- Step-by-step progress tracking:
  1. **Request Submitted**: Logged in MongoDB database.
  2. **Collector Assigned**: Driver allocated with vehicle number (e.g., `MH-12-EC-4021`).
  3. **On the Way**: Live ETA countdown and driver phone hotline.
  4. **Completed & Recycled**: Digital green certificate generated.

### 5. 🛡️ Dispatcher & Fleet Management OS
- Real-time GIS radar simulating truck coordinates across Pune sectors.
- Status updater: Instantly toggle request statuses from `Pending` to `Assigned`, `In Transit`, or `Completed`.
- Driver assignment dropdown to balance fleet load across collection units.

### 6. 🎁 EcoRewards & Pune Transit Store
- **PMPML Bus Pass**: ₹50-₹200 discount coupons for Pune public buses.
- **Pune Metro Card**: Smart transit card recharge vouchers.
- **Organic Compost**: Free 5kg compost bags for garden enthusiasts.
- **Swachh Campus Certificate**: Official digital badge for hackathon & community volunteers.

---

## 📂 Project Directory Structure

```text
FIT-FEST/
├── backend/                  # Express.js REST API Server
│   ├── server.js             # API routes (/api/requests, /api/chat, /api/classify)
│   ├── package.json          # Backend dependencies (express, mongoose, cors, dotenv)
│   └── .env.example          # Backend environment template
│
├── src/                      # Next.js Frontend Application
│   ├── app/
│   │   ├── layout.tsx        # App layout with viewport & font metadata
│   │   ├── page.tsx          # Master tab router & application shell
│   │   ├── globals.css       # Tailwind CSS v4 styling rules
│   │   └── api/              # Fallback / Next.js Serverless API endpoints
│   │       ├── chat/route.ts
│   │       ├── classify/route.ts
│   │       └── requests/route.ts
│   └── components/
│       ├── AdminDashboard.tsx   # Fleet dispatcher console & radar
│       ├── BookingWizard.tsx    # Multi-step waste pickup booking
│       ├── CitizenLoginPage.tsx # Citizen authentication & profile
│       ├── EcoBotChat.tsx       # Floating AI chatbot assistant
│       ├── LandingPage.tsx      # High-converting hero & feature showcase
│       ├── LiveTracker.tsx      # Real-time pickup status & driver telemetry
│       ├── Navigation.tsx       # Top navbar & responsive mobile bottom dock
│       ├── PickupHistory.tsx    # Citizen collection history & receipt cards
│       ├── RewardsSection.tsx   # EcoPoints store & Pune municipal vouchers
│       ├── WasteClassifier.tsx  # Gemini Vision camera & file analyzer
│       └── HackathonPoster.tsx  # FIT Fest 2026 poster & social sharing hub
│
├── public/                   # Static assets, SVG icons, and generated visuals
├── render.yaml               # Render Infrastructure-as-Code blueprint
├── netlify.toml              # Netlify build and redirect configuration
├── Dockerfile                # Multi-stage production container for Cloud Run
├── DEPLOYMENT_GUIDE.md       # Step-by-step production deployment instructions
└── README.md                 # This documentation
```

---

## ⚡ Quick Start: Local Development

### Prerequisites
- **Node.js** (v18.x or v20.x recommended)
- **npm** or **pnpm**
- **Google Gemini API Key** ([Get one here](https://aistudio.google.com/))
- **MongoDB Atlas Connection URI** (Free cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/ShindeDhananjay/FIT-FEST-Hackathon-.git
cd FIT-FEST-Hackathon-
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the frontend:
```bash
npm run dev
```
Access at: [http://localhost:3000](http://localhost:3000)

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecoloop?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:3000
```

Start the backend:
```bash
node server.js
```
API running at: [http://localhost:5000](http://localhost:5000)

---

## 🚀 Production Deployment

### Option A: Render (Backend) + Netlify (Frontend) — Recommended
Detailed step-by-step instructions with screenshots and config files are available in [DEPLOYMENT_GUIDE.md](file:///d:/A%20MY%20FILES/MY%20PROJECTS/FIT%20FEST/DEPLOYMENT_GUIDE.md).

1. **Deploy Backend on Render**:
   - Create Web Service pointing to `backend` directory.
   - Build Command: `npm install`, Start Command: `node server.js`.
   - Set environment variables (`MONGODB_URI`, `GEMINI_API_KEY`, `FRONTEND_URL`).
2. **Deploy Frontend on Netlify**:
   - Connect repository, Base directory: `.`, Build command: `npm run build`, Publish directory: `.next`.
   - Set `NEXT_PUBLIC_API_URL` to your Render backend URL.

### Option B: Google Cloud Run (Containerized)
The repository contains a production-ready `Dockerfile`:
```bash
# Authenticate & deploy to Cloud Run
gcloud run deploy fitfest-ecoloop \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080
```

---

## 📡 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | Health check & database connection status |
| `/api/requests` | `GET` | Fetch all waste pickup requests (filterable by status/phone) |
| `/api/requests` | `POST` | Create a new waste pickup request |
| `/api/requests/:id` | `PATCH` | Update request status (`assigned`, `in_transit`, `completed`) |
| `/api/classify` | `POST` | Upload base64 image for Gemini Vision classification |
| `/api/chat` | `POST` | Chat with EcoBot AI assistant |

---

## 🏅 Hackathon Compliance & Credits

This project was built for the **FIT Fest Hackathon 2026**:
- **Host Institution**: Flora Institute of Technology, Pune
- **Community Partner**: Google Developer Groups (GDG) Pune
- **Problem Statement 4**: Smart Waste Collection & Recycling Platform
- **Mentions**:
  - Organized by: **Flora Institute of Technology**
  - **@gdg.fit.pune**
  - **@the_flora_institutes**

*Built with passion for a cleaner, greener, and smarter tomorrow!* 🌱
