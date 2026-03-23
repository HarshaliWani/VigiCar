# VigiCar - Smart Car Diagnostics and Maintenance Solution

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

<img width="250" height="535" alt="image" src="https://github.com/user-attachments/assets/7abd07de-fd9f-40a5-99e5-3e3fa42fc06d" />               <img width="250" height="535" alt="image" src="https://github.com/user-attachments/assets/639ac6a1-c8c9-4946-bd6b-fc1e848a0196" />



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

