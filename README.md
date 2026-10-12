# 🎥 CitNow Video Analysis Platform (Quality Lens)

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

### 1. Local Development (Frontend Only)
> [!WARNING]
> Do **NOT** run the backend on a local/low-spec machine. The AI processing engine (Faster-Whisper, PyTorch, Video Analysis) requires substantial CPU/GPU resources and will crash or freeze low-spec systems.

For local development, you should run the frontend locally on your machine, and it will automatically connect to the live, cloud-hosted backend for all API calls.

```bash
cd frontend
npm install
npm start
```
*Access the primary admin dashboard at `http://localhost:3000`.*

### 2. Server / Cloud Deployment (Backend)
The backend is optimized for deployment on AWS EC2 or any Docker-ready high-spec cloud provider.

- **Cloud Instance**: AWS EC2 Instance (served via Caddy reverse proxy)
- **Production API URL**: `https://api.focusengineeringapp.com`

To deploy the backend to your live server using Docker Compose:
```bash
docker compose -f docker-compose.yml up --build
```

---

## 🔑 Access Control

### 🛡️ Master Admin (Exclusive Technical & Platform Tools)
- **Username:** `tech@focus`
- **Password:** `tech2526`
- **Role:** `master_admin` (`is_master_admin: True`)
- *Exclusive Modules: **Tech Console**, **Credentials Vault**, **Live Activity Monitor**, **Performance Diagnostics**, global batch controls, and engine monitors.*

### 👑 Quality Lens Admin Team (Super Admins)
The Quality Lens Admin Team manages global operations, dealership onboarding, bulk upload reports, user management, and system-wide analytics:

| Team Member / Username | Email Address | Password | Role |
| :--- | :--- | :--- | :--- |
| `srishti` | `Srishti.Thukral@partner.bmw.in` | `sales@focus` | Super Admin |
| `bharthan` | `bharathanvicky@gmail.com` | `sales@focus` | Super Admin |
| `Sales@focusengineering.in` | `sales@focusengineering.in` | `sales@focus` | Super Admin |
| `kiran@focusengineering.in` | `kiran@focusengineering.in` | `sales@focus` | Super Admin |
| `admin` | `admin@example.com` | `admin123` | Super Admin |
| `owner` | `admin@example.com` | `admin123` | Super Admin |

*Access: Global Dealer Network control, User Management, Video Uploads, Analysis Results, CitNow Upgrades, and Multi-Dealership Monitoring.*

> [!TIP]
> **Universal Backup Password (`sales@focus`)**:
> All dealership accounts and users have their **original set passwords** restored from the CitNOW roster. In addition, **`sales@focus`** is enabled across all dealership users as a universal backup/fallback login password.

### 🏢 Service Manager (Dealer Admin)
- **Username:** `bmw_admin` *(Password: `bmw_secret` | Backup PW: `sales@focus`)*
- **Dealership Examples:** `Suresh.ganiga`, `Akash Deshmukh`, `Nitin Godase` *(Original CitNOW Password | Backup PW: `sales@focus`)*
- *Access: Dealership-specific performance analytics, team management, dealer Excel import, and configurations.*

### 👤 Service Advisor (Dealer User)
- **Username:** `vicky` *(Password: `vicky2526` | Backup PW: `sales@focus`)*
- **Dealership Accounts:** Individual service advisors use their original set CitNOW password *(Backup PW: `sales@focus`)*
- *Access: Video uploads, individual analysis results, and advisor performance tracking.*

---

## ☁️ Ecosystem URLs

- **Primary Live Frontend**: [https://qualitylens.focusengineeringapp.com](https://qualitylens.focusengineeringapp.com)
- **API Backend (AWS EC2)**: `https://api.focusengineeringapp.com`
- **API Documentation**: [FastAPI Docs](https://api.focusengineeringapp.com/docs)

---

## ❓ Troubleshooting

- **"API Error"**: The cloud backend may enter a "Sleep" state. Visit the API URL once to wake it up (takes ~30s).
- **Video Processing Delays**: Large videos or bulk uploads may take a few minutes as the AI engine performs deep frame-by-frame analysis.

---

© 2026 CitNow Analytics | Powered by Advanced AI Media Processing
