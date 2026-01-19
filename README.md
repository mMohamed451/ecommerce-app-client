# Marketplace Frontend

A modern multi-vendor marketplace platform built with Next.js 16, TypeScript, and Tailwind CSS.

## Tech Stack

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **next-intl** - Internationalization (i18n)
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Running backend API

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local .env

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── providers.tsx      # App providers
├── components/            # React components
├── lib/                   # Library code and utilities
│   ├── axios.ts          # Axios instance
│   └── utils.ts          # Utility functions
├── types/                # TypeScript type definitions
├── hooks/                # Custom React hooks
├── utils/                # Utility functions
├── config/               # Configuration files
│   └── constants.ts      # App constants
├── store/                # Zustand stores
└── public/               # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Path Aliases

The following path aliases are configured:

- `@/*` - Root directory
- `@components/*` - Components directory
- `@lib/*` - Library directory
- `@types/*` - Types directory
- `@hooks/*` - Hooks directory
- `@utils/*` - Utils directory
- `@config/*` - Config directory
- `@store/*` - Store directory

## Environment Variables

See `.env.local` for all available environment variables.

## Features

- ✅ Next.js 16 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS with custom theme
- ✅ ESLint and Prettier
- ✅ Path aliases
- ✅ Environment variables
- ✅ Modern folder structure
- ✅ Axios with interceptors
- ✅ TanStack Query setup
- 🔜 i18n with next-intl
- 🔜 Authentication
- 🔜 State management

## Development Guidelines

1. Use TypeScript for all files
2. Follow the ESLint configuration
3. Use Prettier for code formatting
4. Use path aliases for imports
5. Keep components small and focused
6. Write meaningful commit messages

## License

MIT
