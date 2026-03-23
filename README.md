# VigiCar
[![Stars](https://img.shields.io/github/stars/your-username/VigiCar?style=for-the-badge)][repo] [![Forks](https://img.shields.io/github/forks/your-username/VigiCar?style=for-the-badge)][repo]

![Demo GIF](https://via.placeholder.com/1200x600?text=VigiCar+Demo) (or Live: [url])

## 🎯 Overview
AI-powered connected-car app that combines real-time OBD-II telemetry with smart diagnostics, driving insights, and in-app assistant guidance.

## 🚀 Features
- Live OBD-II dashboard with RPM, speed, coolant temp, throttle, voltage, and sensor telemetry (polled every few seconds)
- AI diagnostics that convert telemetry into warnings, insights, and actionable driving tips
- AI chat assistant for car-specific Q&A grounded in current vehicle data
- Fuel history tracking and trend visualization based on telemetry + manual fill-up logs
- Vehicle and maintenance views for service reminders and multi-car context

## 🛠 Tech Stack
![Expo](https://img.shields.io/badge/Expo-000000?style=flat-square&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Groq API](https://img.shields.io/badge/Groq-111111?style=flat-square)
![OBD-II / ELM327](https://img.shields.io/badge/OBD--II%20%2F%20ELM327-2E7D32?style=flat-square)

## 📈 Results
- Real-time vehicle telemetry pipeline from OBD adapter to mobile dashboard
- AI-generated diagnostics + driving-score insights from live sensor values
- End-to-end full-stack prototype (mobile + backend) ready for iteration and deployment

## 🤝 Live | GitHub
[Deploy](https://your-live-url.example) | [Repo Stats][repo]

## 📋 Setup
```bash
# Clone repository
git clone https://github.com/your-username/VigiCar.git
cd VigiCar

# Backend setup
cd backend
pip install -r requirements.txt
# Configure .env with GROQ_API_KEY_INSIGHTS, GROQ_API_KEY_DIAGNOSTICS, GROQ_API_KEY_CHAT
uvicorn app.main:app --reload

# Frontend setup (new terminal)
cd ../frontend
npm install
npx expo start
```

