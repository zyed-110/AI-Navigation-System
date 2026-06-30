- HEAD
# Alice - AI Voice Navigation System

Alice is an advanced, hands-free AI voice navigation system designed for modern mobility. It combines real-time object detection with conversational AI to provide an intuitive and safe navigation experience.

## 🚀 Key Features

*   **🎙️ Hands-free Voice Control:** Fully voice-activated interface using "Alice" as the wake word.
*   **🗣️ Conversational AI:** Natural language interaction powered by Google Gemini and OpenAI.
*   **🗺️ Accurate Navigation:** Seamless mapping and routing powered by Mapbox and OpenRouteService.
*   **👁️ Visual Intelligence:** Real-time object detection (YOLOv8) to identify obstacles and points of interest.
*   **🏙️ Monitoring Dashboard:** A dedicated admin interface for tracking device performance and system logs.

## 📁 Project Structure

*   **/artifacts/ai-navigation**: The core React Native (Expo) mobile application.
*   **/training**: Python scripts for training and running YOLOv8 object detection.
*   **/lib**: Internal libraries and components shared across modules.
*   **/services**: Backend logic for AI integration, GPS tracking, and voice processing.

## 🛠️ Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   pnpm (recommended) or npm/yarn
*   Python 3.10+ (for object detection)
*   Supabase Account (for backend & auth)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-repo/ai-navigation.git
    cd ai-navigation
    ```

2.  **Install dependencies (Mobile App):**
    ```bash
    cd artifacts/ai-navigation
    pnpm install
    ```

3.  **Setup Environment Variables:**
    Create a `.env` file in `/artifacts/ai-navigation` with:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    GEMINI_API_KEY=your_gemini_key
    OPENAI_API_KEY=your_openai_key
    ORS_API_KEY=your_openrouteservice_key
    ```

4.  **Install Python dependencies:**
    ```bash
    cd ../../training
    pip install -r requirements.txt
    ```

### Running the App

*   **Start the Expo Server:**
    ```bash
    cd artifacts/ai-navigation
    npx expo start
    ```
*   **Run Object Detection:**
    ```bash
    cd training
    python detect_realtime.py
    ```

## 🛡️ License

This project is private and for internal use only.
=======
# AI-Navigation-System
An AI Navigation System is a smart app that helps users find directions using voice or text. It uses AI to understand inputs and provide routes, nearby locations, and basic guidance in real time.
842cf4c10852e945c02ec1288fa7093588cd8fb5
