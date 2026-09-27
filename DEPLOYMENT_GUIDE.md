# 🚀 EcoLoop Production Deployment Guide

Deploy **EcoLoop** with high performance and zero cost:
- **Backend API**: Hosted on **Render** (Express + MongoDB Atlas + Gemini AI)
- **Frontend App**: Hosted on **Netlify** (Next.js with global CDN caching)

---

## 🏗️ Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │            Pune Citizen / User         │
                      └───────────────────┬────────────────────┘
                                          │
                     HTTPS Requests       │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          NETLIFY (Frontend)            │
                      │       https://your-app.netlify.app     │
                      │     Next.js 16 + Tailwind + React 19   │
                      └───────────────────┬────────────────────┘
                                          │
                   API calls to           │
                   NEXT_PUBLIC_API_URL    │
                                          ▼
                      ┌────────────────────────────────────────┐
                      │           RENDER (Backend)             │
                      │    https://ecoloop-api.onrender.com    │
                      │     Express.js + CORS + Healthcheck    │
                      └──────────────┬──────────────────┬──────┘
                                     │                  │
                                     ▼                  ▼
                       ┌──────────────────────┐  ┌──────────────────────┐
                       │  MongoDB Atlas Cloud │  │   Google Gemini AI   │
                       │    (Waste Database)  │  │  (Vision & Chatbot)  │
                       └──────────────────────┘  └──────────────────────┘
```

---

## Part 1: Deploy Backend on Render

### Step 1: Push Project to GitHub
Ensure all latest files (including the `backend/` directory and `render.yaml`) are committed to your GitHub repository.

### Step 2: Create a Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name**: `ecoloop-backend` (or any unique name)
   - **Region**: Oregon (US West) or Singapore (closest to India)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

*(Alternatively, use Render Blueprint: click **New +** ➔ **Blueprint** and point to `render.yaml`).*

### Step 3: Add Environment Variables on Render
Scroll down to **Environment Variables** in the Render settings and add:

| Key | Value | Description |
|---|---|---|
| `PORT` | `10000` | Port Render listens to |
| `MONGODB_URI` | `mongodb+srv://shindedhananjay201906_db_user:<password>@cluster0.8nxoklv.mongodb.net/?appName=Cluster0` | Your MongoDB Atlas connection string |
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | Gemini Flash AI API Key |
| `CORS_ORIGIN` | `*` | Allowed origin (or your Netlify URL after Part 2) |

### Step 4: Deploy & Copy Your Render URL
1. Click **Create Web Service**.
2. Once deployed (usually 1-2 minutes), Render will display your live backend URL:
   `https://ecoloop-backend.onrender.com`
3. Test it in your browser:
   - Visit `https://ecoloop-backend.onrender.com/health`
   - It will return:
     ```json
     { "status": "ok", "uptime": 12.4, "dbConnected": true }
     ```

---

## Part 2: Deploy Frontend on Netlify

### Step 1: Connect Netlify to GitHub
1. Go to [Netlify Dashboard](https://app.netlify.com/) and click **Add new site** ➔ **Import an existing project**.
2. Select **GitHub** and authorize your repository.

### Step 2: Configure Build Settings
Netlify will auto-detect the Next.js framework from [`netlify.toml`](file:///d:/A%20MY%20FILES/MY%20PROJECTS/FIT%20FEST/netlify.toml):
- **Base directory**: Leave blank (root `/`)
- **Build command**: `npm run build`
- **Publish directory**: `.next`

### Step 3: Add Netlify Environment Variables
In the site setup (or under **Site configuration** ➔ **Environment variables**), add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://ecoloop-backend.onrender.com` *(Paste your actual Render URL from Part 1 without trailing slash)* |

### Step 4: Deploy Site
1. Click **Deploy Site**.
2. Netlify will run the optimized Next.js build.
3. You will receive a live URL:
   `https://your-app-name.netlify.app`

---

## Part 3: Verify the Complete Working Workflow

1. **Open your Netlify site**: `https://your-app-name.netlify.app`
2. **Citizen Pickup Flow**:
   - Click **Request a Pickup**.
   - You will see the **Citizen Sign In** page.
   - Click **⚡ 1-Click Demo Login** (`Dhananjay Shinde`).
   - You are immediately transitioned into the 4-step **Booking Wizard** with your details prefilled.
   - Complete Step 1 (Waste selection) ➔ Step 2 (Address) ➔ Step 3 (Date & Slot) ➔ Step 4 (Confirm).
   - The new pickup is saved directly to your Render backend and MongoDB Atlas!
3. **Admin Operations**:
   - Visit `https://your-app-name.netlify.app/admin`
   - Sign in with:
     - Email: `admin@gmail.com`
     - Password: `admin@123`
   - View live requests fetched from Render and dispatch drivers.
4. **AI Features**:
   - Open **EcoBot** (bottom right floating button) to chat with Gemini.
   - Open **AI Scanner** from Navbar to test live vision report generation.

---

## 💡 Production Tips & Troubleshooting

- **Render Free Tier Cold Starts**: Render's free tier spins down after 15 minutes of inactivity. When a request arrives after being idle, it may take 30–45 seconds to spin up. The frontend has built-in local caching and graceful fallbacks so users will never see a broken white screen!
- **CORS Protection**: Once you have your final Netlify URL (e.g. `https://ecoloop-pune.netlify.app`), you can update `CORS_ORIGIN` in your Render dashboard from `*` to `https://ecoloop-pune.netlify.app` for strict security.
