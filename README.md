<div align="center">

# 🎙️ Speeki Pronounce

An interactive web application designed to help users master their English pronunciation through real-time feedback and AI-driven assessment.

![React](https://img.shields.io/badge/react-19.1.0-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-18.x-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Azure Speech](https://img.shields.io/badge/Azure_Speech-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)

</div>

## 📖 What it does

**Speeki Pronounce** is a full-stack tool empowering users to perfect their spoken English by providing real-time, highly granular feedback using **Microsoft Azure Cognitive Speech Services**. 

Key features include:
- 🌍 **Multi-Dialect Support**: Seamlessly switch between American English (`en-US`) and British English (`en-GB`).
- 🗣️ **Language-Specific Word Lists**: Dynamic vocabulary sets curated to focus on phonetic challenges typical of specific dialects (e.g., rhotic vs. non-rhotic, /æ/ sounds).
- 🎯 **Phoneme-Level Analysis**: Advanced grading algorithm offering precise breakdowns of pronunciation accuracy down to the individual phoneme layer.
- 🔊 **Localized Voice Feedback**: High-quality Native Neural Text-To-Speech (e.g., `en-US-JennyNeural`, `en-GB-SoniaNeural`), letting users hear the "perfect" pronunciation before attempting it themselves.
- 🔐 **Secure Session Management**: Built-in state recovery with token-based URL parameters guarding securely tracked user progress.

---

## 💻 Tech Stack

### Frontend
- **React 19**
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS** (Utility-first styling, rapid responsive design)
- **Lucide React** (Beautifully consistent iconography)
- **Axios** (Robust API requests)

### Backend
- **Node.js & Express.js**
- **Microsoft Cognitive Services Speech SDK** (Core pronunciation assessment engine)
- **FFmpeg & Fluent-FFmpeg** (Backend audio transcoding & processing)
- **Multer** (Handling multipart/form-data audio file uploads)
- **Docker** (Containerized deployment readiness)

---

## 📸 Screenshots

<!-- Space left for actual UI screenshots -->
| Application Dashboard | Live Feedback & Assessment |
| :---: | :---: |
| *(Insert Screenshot Here)* | *(Insert Screenshot Here)* |

> **Note:** Capture screenshots of your application layout and replace the placeholders above using markdown formatting: `![Feature Name](path/to/image.png)`.

---

## 🚀 Setup Steps

Follow these steps to get the app running locally on your machine.

### 1. Prerequisites
- **Node.js** (v18.x or higher)
- **Git** (for cloning the repository)
- **FFmpeg** installed on your system (the backend uses `@ffmpeg-installer/ffmpeg`, but having native FFmpeg installed system-wide is highly recommended).
- An active **Microsoft Azure Account** with a Speech Service resource configured (you will need the Resource Key and Region).

### 2. Clone the Repository
```bash
git clone <repository-url>
cd speeki_pronounce
```

### 3. Backend Setup

Open a terminal window and navigate to the backend folder:
```bash
cd backend

# Install necessary dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

Open the newly created `.env` file and insert your Azure credentials:
```env
SPEECH_KEY=your_azure_speech_key_here
SPEECH_REGION=your_azure_region_here
PORT=3000
```

Start the backend API application:
```bash
# Recommended for development (requires nodemon via dev dependencies)
npm run dev

# Alternatively, standard start
npm start
```
*(The backend should now run locally on port 3000)*

### 4. Frontend Setup

Leave the backend running and **open a new terminal** window:
```bash
cd frontend

# Install frontend dependencies
npm install

# Start the Vite development sever
npm run dev
```

### 5. Launch the Application

Navigate to your browser to view the application in action. *Note: Ensure you include the URL parameters to inject the session properly.*
```text
http://localhost:5173/speeki_pronounce/index.html?token=test_token_123&language=en-us
```
> Change the language parameter to `language=en-gb` to switch the application to British English.

---

## 🐳 Docker Deployment

The backend application is Docker-ready. To build and run using Docker:
```bash
cd backend
npm run docker:build

# Runs the container on port 8080 and reads .env file
npm run docker:run
```
