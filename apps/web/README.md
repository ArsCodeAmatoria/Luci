# Luci Web Application

<p align="center">
  <img src="../../public/images/luci-logo.png" alt="Luci Logo" width="200" />
</p>

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

The Luci web application provides a browser-based interface for managing your AI call assistant settings, viewing call history, and configuring preferences.

## Features

- **Dark Mode UI**: Modern, sleek dark-themed interface
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Call Management**: View, search, and manage your call history
- **User Settings**: Configure your AI assistant's voice, behavior, and preferences
- **Analytics Dashboard**: Visualize call statistics and insights

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)

### Installation

1. Install dependencies
   ```bash
   pnpm install
   ```

2. Set up environment variables
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API configuration
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## Development

### Project Structure

```
web/
├── public/            # Static assets
├── src/
│   ├── app/           # Next.js app router components
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and shared logic
│   ├── styles/        # Global styles
│   └── types/         # TypeScript type definitions
├── next.config.js     # Next.js configuration
└── tailwind.config.js # Tailwind CSS configuration
```

### Commands

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm lint` - Run ESLint

## Deployment

The web application can be deployed with Vercel:

```bash
pnpm install -g vercel
vercel
```

For more information on deployment options, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
