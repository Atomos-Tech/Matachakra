# Matachakra — Enterprise Architecture Document

## 1. The Chosen Vertical: Election Process Education

Matachakra was built to solve a critical civic problem: voter drop-off due to bureaucratic friction and information overload. By translating dense, jargon-heavy electoral documents into an interactive, AI-driven experience, Matachakra serves as a digital co-pilot for the Indian democratic process. It covers everything from checking voter registration eligibility to navigating the polling booth.

## 2. Approach & Logic

Matachakra is architected for **zero-cost, high-performance scale**.

- **Frontend Architecture:** Built with React and TanStack Start, the application utilizes Server-Side Rendering (SSR) to ensure fast First Contentful Paint (FCP) and optimal SEO. The UI is built with Tailwind CSS and Framer Motion for a premium, accessible experience.
- **Security (AI Guardrails):** The Gemini integration strictly uses an immutable system prompt with 10+ prompt injection detection patterns. Input length is capped at 500 characters, preventing prompt stuffing or malicious jailbreaks. The AI is securely locked into its civic education persona.
- **Efficiency (Caching Layer):** The application implements an aggressive cache-first strategy. Before calling the Gemini API, user queries are tokenized and scored against a Firestore database. If a cached answer exists (≥50% keyword match), it is served instantly, bypassing the LLM. This reduces API costs to exactly $0 for common FAQs. The cache organically seeds itself upon successful Gemini responses.

## 3. Google Services Ecosystem

Matachakra heavily integrates the Google ecosystem to deliver enterprise-grade reliability:
1. **Google Gemini API (`@google/genai`):** Specifically `models/gemini-2.5-flash`, providing fast, intelligent responses to voter queries.
2. **Google Firebase Firestore (REST API):** Powers the intelligent caching layer, executing ultra-fast keyword lookups without the overhead of heavy Node.js SDKs.
3. **Google Maps Embed API:** Integrated directly into the AI Assistant chat flow, providing users with immediate spatial context when they ask "Where do I vote?"
4. **Google Cloud Run:** The entire application is containerized and deployed as a serverless Node.js instance. It scales automatically to handle traffic spikes during election cycles and scales down to zero when idle.
5. **Google Cloud Build:** Provides an automated CI/CD deployment pipeline directly from the repository.

## 4. Local Setup & Installation

### Prerequisites
- Node.js (v22+)
- Google Gemini API Key
- Firebase Project setup
- Google Maps API Key

### Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Atomos-Tech/Matachakra.git
   cd Matachakra
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file with the following keys:
   ```env
   GEMINI_API_KEY="your_gemini_key"
   VITE_FIREBASE_PROJECT_ID="your_project_id"
   VITE_FIREBASE_API_KEY="your_firebase_api_key"
   VITE_FIREBASE_CACHE_COLLECTION="election_faqs"
   VITE_GOOGLE_MAPS_API_KEY="your_google_maps_key"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for Production:**
   ```bash
   npm run build
   npm start
   ```

## 5. Live Deployment

**🔴 Live Cloud Run URL:** [https://matachakra-service-619633497266.asia-south1.run.app](https://matachakra-service-619633497266.asia-south1.run.app)
