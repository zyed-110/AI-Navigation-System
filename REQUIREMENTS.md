# AI Navigation Project Requirements

## Hardware Requirements

*   **Processor:** Quad-core 2.4+ GHz (Intel Core i5/i7 or Apple M1/M2/M3)
*   **Memory (RAM):** 16GB minimum (32GB recommended for model training)
*   **Storage:** 50GB free space
*   **Camera:** Built-in webcam or external USB camera for object detection.
*   **GPS:** Integrated smartphone GPS or a connected GPS module for accurate location data.
*   **Audio:** High-quality microphone and speakers for voice interaction.

## Software Requirements

### Development Environment

*   **Operating System:** Windows 10/11, macOS (Latest), or Linux (Ubuntu 22.04+)
*   **Node.js:** v18.0.0 or higher
*   **Package Manager:** pnpm (v8.x or 9.x) - *Note: The project uses pnpm-workspace.*
*   **Python:** v3.10.x - v3.11.x (Required for YOLOv8 scripts)
*   **IDE:** Visual Studio Code (Recommended) with ESLint, Prettier, and Python extensions.

### Core Frameworks & Libraries

*   **Frontend:** React Native with Expo Router (v54.x)
*   **UI Components:** React Native Reanimated, Safe Area Context, Vector Icons.
*   **Navigation:** React Native Maps (Mapbox or Google Maps based integration).
*   **Artificial Intelligence:**
    *   **Conversational:** Google Gemini (Generative-ai library) and OpenAI API.
    *   **Object Detection:** YOLOv8 (Ultralytics package) for real-time vision.
    *   **Voice/Speech:** Expo Speech and Expo AV.
*   **Backend & Auth:** Supabase (PostgreSQL, Realtime, Auth, Storage).

## API & Service Dependencies

*   **Supabase:** For database, user authentication, and profile management.
*   **Google Gemini AI:** For conversational reasoning.
*   **OpenAI:** For fallback NLP and complex query processing.
*   **OpenRouteService:** For route calculation and trip planning.
*   **Expo Web Browser:** For OAuth and external link handling.

## Network Requirements

*   Stable broadband internet connection for real-time AI and map data.
*   Mobile data connectivity for field-tested navigation.
