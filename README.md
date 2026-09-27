# 🌿 FitFest EcoLoop: Smart Waste Collection & Recycling Platform

> **Hackathon**: FIT Fest Hackathon 2026 (Flora Institute of Technology & GDG Pune)  
> **Problem Statement 4**: Smart Waste Collection & Recycling Platform  
> **Tagline**: *"Reduce Waste. Recycle More. Build a Cleaner Tomorrow."*  
> **Deployment Target**: Google Cloud Run  

---

## 🏆 Project Overview

**FitFest EcoLoop** is an intelligent, full-stack waste logistics and recycling platform engineered to revolutionize urban and campus solid waste management. It seamlessly bridges citizens with municipal eco-fleet dispatchers, eliminating segregation confusion and optimizing collection routes.

### 🚩 The Real-World Problem
- **Citizen Friction**: People frequently struggle to identify proper disposal protocols for diverse waste streams (PET plastics, e-waste, hazardous batteries, organic compost, cardboard).
- **Logistical Inefficiencies**: Municipal collection services and campus facilities lack synchronized real-time visibility into collection queues, driver statuses, and geographic cluster routing.
- **Low Engagement**: Absence of transparent recycling verification and gamified incentives leads to high landfill diversion loss.

### 💡 The Solution
FitFest EcoLoop delivers an end-to-end software ecosystem featuring:
1. **Multi-Category Smart Booking Wizard**: On-demand request scheduling with dynamic capacity slots, address/landmark geotagging, and volume estimations.
2. **AI Vision Waste Classifier**: Neural material scanner that identifies trash types from photos, flags hazards, provides proper segregation protocols, and auto-fills collection requests with 1-click.
3. **4-Stage Live Dispatch Pipeline**: Live tracking with driver telemetry (`Submitted` ➔ `Collector Assigned` ➔ `On the Way` ➔ `Completed/Recycled`).
4. **Administrative Fleet OS**: Comprehensive dispatcher console featuring real-time GIS fleet radar, driver dispatching, status updates, and advanced filtering.
5. **Gamification & Verifiable Green Certificates**: EcoPoints incentive engine, campus leaderboard, and cryptographically verifiable digital recycling receipts with CO₂ abatement metrics.
6. **Production-Ready Google Cloud Run Architecture**: Pre-configured standalone Next.js containerization with multi-stage Docker build.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | TypeScript (Strict mode) |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons |
| **Architecture** | Component-driven, Responsive, Mobile-First |
| **Containerization** | Docker (Alpine Node 20 Multi-stage build) |
| **Cloud Deployment** | **Google Cloud Run** (Port 8080) |

---

## 🚀 Key Features Walkthrough

```text
FitFest EcoLoop Ecosystem
├── 1. Citizen Portal
│   ├── Multi-Category Waste Selector (Plastics, E-Waste, Organic, Paper, Hazardous, Metal)
│   ├── Geolocation & Campus Zone Pinning (Pune / Flora Institute Sector)
│   ├── Dynamic Slot & Date Booking
│   └── Live ETA & Assigned Driver Telemetry
│
├── 2. EcoAI Vision Material Classifier
│   ├── Instant Neural Recognition of Trash Images
│   ├── Material Matrix & Recyclability Confidence Rating
│   └── Automated 1-Click Form Pre-fill
│
├── 3. Admin & Dispatcher Console
│   ├── Live Fleet & Truck Telemetry Heatmap
│   ├── Driver Assignment & Workload Balancing
│   └── Stage Pipeline Controller (Submitted -> En Route -> Completed)
│
├── 4. Impact Analytics & Leaderboard
│   ├── Diverted Landfill Metrics (Kg diverted & CO₂ Offset)
│   ├── Equivalent Urban Trees & Saved Energy Calculator
│   └── Pune Campus Eco-Citizen Leaderboard
│
└── 5. Social & Poster Hub
    ├── Built-in Hackathon Project Poster
    └── 1-Click Social Media Post Formatter (LinkedIn & Instagram ready)
```

---

## 💻 Local Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ShindeDhananjay/FIT-FEST-Hackathon-.git
   cd FIT-FEST-Hackathon-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Google Cloud Run Deployment Guide

The application is containerized with a production multi-stage Dockerfile adhering to Google Cloud Run specifications:

### Method 1: Deploy with Google Cloud CLI (Recommended)

```bash
# 1. Authenticate with Google Cloud
gcloud auth login
gcloud config set project [YOUR_GCP_PROJECT_ID]

# 2. Build & Deploy to Google Cloud Run
gcloud run deploy fitfest-ecoloop \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --port 8080
```

### Method 2: Local Docker Verification

```bash
# Build Docker image
docker build -t fitfest-ecoloop .

# Run Docker container locally
docker run -p 8080:8080 fitfest-ecoloop
```
Open [http://localhost:8080](http://localhost:8080) to test the production container.

---

## 📢 Hackathon Compliance & Social Media Requirement

This project fulfills all criteria of the **Flora Institute of Technology** Hackathon:
- ✅ **Software-only MVP** achieved within official hackathon duration.
- ✅ **Google Cloud Run** ready deployment setup.
- ✅ **Public GitHub Repository** with comprehensive source code, architecture, and setup instructions.
- ✅ **Official Mentions**:
  - Organized by: **Flora Institute of Technology**
  - **@gdg.fit.pune**
  - **@the_flora_institutes**

*Built with passion for a cleaner, greener tomorrow!* 🌱
