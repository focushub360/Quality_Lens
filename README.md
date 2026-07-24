# 🎥 CitNow Video Analysis Platform

[![Status: Active](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()
[![Platform: Web](https://img.shields.io/badge/Platform-Web-blue.svg)]()
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)]()

An elite, AI-driven media analysis ecosystem designed for modern vehicle service centers. This platform leverages high-performance cloud processing to provide deep insights into video quality, audio clarity, and communication effectiveness.

---

## 🚀 Core Features

### 🧠 Intelligent Analysis
- **Quality Ranking**: Automated scoring of video resolution, stability, and lighting.
- **Audio Clarity**: Advanced noise detection, volume normalization, and clarity analysis using `librosa`.
- **AI Transcription**: High-accuracy speech-to-text powered by **Faster-Whisper**.
- **Translation & Summarization**: Seamless multilingual support via NLLB/MarianMT and text summarization with BART.

### 🏛️ Elite Management
- **Multi-Tenant Architecture**: Dedicated spaces for different Dealer Networks (Super Admin vs. Dealer Admin).
- **Team Mgmt**: Robust user control and role-based access (RBAC).
- **Bulk Upload**: High-throughput video analysis pipeline for large-scale operations.
- **PDF Reporting**: Premium, branded report generation with data visualization (`Recharts`).

---

## 🏗️ Project Structure

The repository is organized as a monorepo for seamless development and deployment.

```text
.
├── frontend/           # Primary Admin Dashboard (React + MUI v7)
├── dealer_frontend/    # Dealer-Specific Interface (Lightweight Vite + React)
├── backend/            # FastAPI AI Processing Engine (Python)
├── .github/            # CI/CD Workflows
└── docs/               # Documentation & Performance Guides
```

---

## 🛠️ Environment & Technology

### Frontend
- **Framework**: React 19
- **Components**: Material UI v7 (Custom BMW-Elite Theme)
- **Visuals**: Recharts (Data Viz), html2canvas/jspdf (Reporting)

### Backend (Cloud-Powered)
- **API**: FastAPI (Uvicorn)
- **Processing**: OpenCV (Video), Librosa (Audio)
- **AI Stack**: PyTorch, Transformers, Faster-Whisper
- **Database**: MongoDB Atlas

---

## 🚦 Getting Started

### 1. Local Development (Frontend)
The primary dashboard runs locally while connecting to the stable cloud backend.

```bash
cd frontend
npm install
git push origin main
git push origin main

```
Access the application at `http://localhost:3000`.

### 2. Backend Deployment
The backend is optimized for deployment on **Hugging Face Spaces** or any Docker-ready cloud provider.

- **Cloud Instance**: AWS EC2 Instance (served via Caddy proxy)
- **API Entrypoint**: `https://qualitylensfocustech.duckdns.org`

---

## 🔑 Access Control

### 👑 Super Admin
- **Username:** `admin`
- **Password:** `admin123`
- *Access: Global management of all dealers and system configurations.*

### 🏢 Dealer / Branch Admin
- **Username:** `bmw_admin`
- **Password:** `bmw_secret`
- *Access: Dealership-specific performance analytics and team management.*

---

## ☁️ Ecosystem URLs

- **Live Application**: [https://videoproject-frontend.pages.dev](https://videoproject-frontend.pages.dev)
- **API Documentation**: [FastAPI Docs](https://qualitylensfocustech.duckdns.org/docs)

---

## ❓ Troubleshooting

- **"API Error"**: The cloud backend may enter a "Sleep" state. Visit the API URL once to wake it up (takes ~30s).
- **Video Processing Delays**: Large videos or bulk uploads may take a few minutes as the AI engine performs deep frame-by-frame analysis.

---

© 2026 CitNow Analytics | Powered by Advanced AI Media Processing
