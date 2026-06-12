# 🎓 Naseem School Hub

> A modern Learning Management System built with React, TypeScript, and Vite

[![Build Status](https://github.com/Mostafa-SAID7/naseem-school-hub/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/Mostafa-SAID7/naseem-school-hub/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Netlify

1. Connect repo to [Netlify](https://netlify.com)
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable `VITE_CLERK_PUBLISHABLE_KEY`

### Deploy to Vercel

1. Connect repo to [Vercel](https://vercel.com)
2. Add environment variable `VITE_CLERK_PUBLISHABLE_KEY`
3. Deploy

## ⚙️ Configuration

Create `.env` file in root:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

Copy from `.env.example`:

```bash
cp .env.example .env
```

## 📦 Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Components
- **Clerk** - Authentication
- **React Router** - Routing

## 📚 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run serve` | Preview production build |
| `npm run typecheck` | Check TypeScript types |

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)

## 📄 License

MIT © Naseem School Hub
