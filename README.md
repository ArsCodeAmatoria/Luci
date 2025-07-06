# Luci: AI-Powered Call Assistant

<p align="center">
  <img src="public/images/luci-logo.png" alt="Luci Logo" width="200" />
</p>

![Image](https://github.com/user-attachments/assets/22ef7079-41c0-4ad4-95ce-ec7c1631bb9a)

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)](https://openai.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DD0031?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)](https://www.twilio.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Luci is a smart mobile call assistant that screens incoming calls, detects spam, and handles call routing with real-time voice processing.

## Features

- **Call Screening**: Automatically screens incoming calls
- **AI Voice Assistant**: Handles initial conversation with callers
- **Spam Detection**: Identifies and blocks spam calls
- **Smart Scheduling**: Schedules callbacks for missed calls
- **Call Analytics**: Tracks call history and provides insights

## Tech Stack

- **Frontend**: 
  - Mobile: React Native with Expo and NativeWind (Tailwind for RN)
  - Web: Next.js with Tailwind CSS
- **Backend**: Rust (Axum + Tokio)
- **AI**: ElevenLabs (TTS), Whisper (STT), OpenAI GPT-4o (NLP)
- **Voice API**: Twilio/Telnyx Programmable Voice
- **Database**: PostgreSQL, Redis
- **Authentication**: Firebase Auth/Magic.link

## Project Structure

```
luci/
├── apps/
│   ├── mobile/        # React Native Expo app
│   ├── web/           # Next.js web application
│   └── backend/       # Rust Axum API
├── packages/
│   ├── voice/         # Shared voice processing modules
│   └── common/        # Shared types and utilities
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- pnpm (v8+)
- Rust (latest stable)
- PostgreSQL
- Redis
- API keys for:
  - OpenAI
  - ElevenLabs
  - Twilio/Telnyx
  - Firebase (optional)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/luci.git
   cd luci
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. Start the development servers
   ```bash
   pnpm dev
   ```

## Backend Setup

The backend is built with Rust using the Axum framework.

1. Navigate to the backend directory
   ```bash
   cd apps/backend
   ```

2. Set up the PostgreSQL database
   ```bash
   # Create database
   psql -U postgres -c "CREATE DATABASE luci;"
   
   # Run migrations
   psql -U postgres -d luci -f sql/schema.sql
   ```

3. Run the backend server
   ```bash
   cargo run
   ```

The API will be available at http://localhost:3000.

## Mobile App Setup

The mobile app is built with React Native and Expo.

1. Navigate to the mobile app directory
   ```bash
   cd apps/mobile
   ```

2. Start the Expo development server
   ```bash
   pnpm start
   ```

3. Run on iOS or Android
   ```bash
   # iOS
   pnpm ios
   
   # Android
   pnpm android
   ```

## Voice Service Integration

### Twilio Setup

1. Set up a Twilio account and purchase a phone number
2. Configure the voice webhook to point to your backend's `/api/call/start` endpoint
3. Use TwiML for call handling via the Twilio API

### ElevenLabs & OpenAI

1. Obtain API keys for ElevenLabs and OpenAI
2. Set the API keys in your .env file

## Development Workflow

This project uses Turborepo to manage the monorepo workspace.

- Build all packages: `pnpm build`
- Develop all packages: `pnpm dev`
- Test all packages: `pnpm test`
- Lint all packages: `pnpm lint`

## Testing

### Backend Testing

```bash
cd apps/backend
cargo test
```

### Mobile Testing

```bash
cd apps/mobile
pnpm test
```

## License

[MIT License](LICENSE)

## Acknowledgements

- Thanks to the developers of Axum, React Native, and all the other open-source libraries used in this project. 
