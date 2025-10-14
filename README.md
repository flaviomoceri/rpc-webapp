# RPC Monitor

A real-time blockchain RPC endpoint monitoring application built with Next.js, featuring the Switzer font and usdt0.to design system.

## Getting Started

This project uses **pnpm** as the package manager. Make sure you have pnpm installed:

```bash
# Install pnpm globally (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Run the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Features

- **Real-time RPC Monitoring**: Monitor blockchain RPC endpoints with live status updates
- **Multi-chain Support**: Currently supports Polygon and Plasma chains
- **Modern Design**: Built with usdt0.to design system and Switzer font
- **Performance Tracking**: Track latency and health status of RPC endpoints
- **Responsive UI**: Clean, modern interface that works on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4
- **Font**: Switzer (custom font family)
- **Blockchain**: Wagmi + Viem for blockchain interactions
- **Package Manager**: pnpm

## Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack

# Production
pnpm build        # Build for production with Turbopack
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [Wagmi](https://wagmi.sh/) - React hooks for Ethereum
- [Viem](https://viem.sh/) - TypeScript interface for Ethereum

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
