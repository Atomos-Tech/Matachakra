# Matachakra 🗳️

**Matachakra** is a civic AI co-pilot designed to make the Indian election process simple, accessible, and understandable for every voter. 

**🔴 Live Demo:** [matachakra-service-619633497266.asia-south1.run.app](https://matachakra-service-619633497266.asia-south1.run.app)

![Matachakra Screenshot](https://raw.githubusercontent.com/Atomos-Tech/Matachakra/main/public/og-image.jpg) <!-- Update with actual image path if available -->

## 🌟 Features

- **AI Assistant:** Instant, zero-jargon answers to your voting queries powered by Gemini 2.5 Flash.
- **Interactive Timeline:** Clear, step-by-step guidance from registration to results.
- **Zero-Cost Caching:** A custom Firestore REST API caching layer ensures blazing-fast responses and minimal API costs.
- **Voter IQ Quiz:** Test your knowledge of election basics.
- **Accessible & Secure:** Full ARIA compliance, Voice-to-Text via Web Speech API, and robust prompt injection detection.

## 🛠️ Tech Stack

- **Frontend:** React, TanStack Start (SSR), Tailwind CSS, Framer Motion
- **Backend:** Node.js (custom `server.mjs` wrapping TanStack fetch handler)
- **AI:** Google Gemini API (`@google/genai`)
- **Database/Cache:** Firebase Firestore (REST API)
- **Deployment:** Google Cloud Run (Dockerized)
- **Testing:** Vitest

## 🚀 Getting Started

### Prerequisites

- Node.js (v22+)
- A Google Gemini API Key
- A Firebase Project (for caching)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Atomos-Tech/Matachakra.git
   cd Matachakra
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Google Gemini (Server-only)
   GEMINI_API_KEY="your_gemini_api_key"

   # Firebase (Firestore REST API)
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_CACHE_COLLECTION="election_faqs"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

Run the comprehensive unit tests (covering security, caching, and performance):
```bash
npm test
```

## 📜 License

MIT
