# 🚀 TypeRace Deployment Guide

This full-stack application (React + Node.js + Express + WebSockets) is pre-configured for **1-Click Deployment** on **Render** (Recommended for WebSockets) or **Vercel / Railway**.

---

## ⚡ Option 1: Render Deployment (RECOMMENDED — Best for WebSockets)

Render provides free Node.js web services with full WebSocket support out-of-the-box.

### Steps:
1. Push your repository to **GitHub**.
2. Log in to [Render.com](https://render.com) and click **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Name**: `typerace-app`
   - **Environment**: `Node`
   - **Build Command**: `npm run install-all && npm run build`
   - **Start Command**: `npm run start`
5. Click **Create Web Service**.

Render will automatically install dependencies, build the Vite frontend, serve the production bundle, and launch the real-time WebSocket server on your live URL (`https://typerace-app.onrender.com`).

---

## 🌐 Option 2: Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` from the root directory (`d:\Game`).
3. Vercel will auto-detect `vercel.json` and deploy both the REST API backend and Vite static frontend.

---

## 🧹 Database Leaderboard Purge

All demo/seeded dummy users have been wiped from the database.
From now on, **only real registered users who complete actual races** will appear on the Hall of Fame Leaderboard!

To clear the leaderboard manually at any time in local/production:
```bash
npm run clear-db
```
