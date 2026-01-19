# LogiScan AI: Intelligent Inventory Audits

**An enterprise-grade PWA that reduces manual inventory labor by 87% using AI-driven automation.**

LogiScan AI is a Next.js 15 Progressive Web App designed to prove the immediate ROI of AI in logistics. It transforms a tedious, error-prone manual process into a fast, accurate, and streamlined workflow. This repository demonstrates production-ready code, from its offline-first mobile architecture to its resilient, high-concurrency database operations.

## Business Impact & ROI

This system was implemented to replace a manual audit process that took two employees ~4 hours daily (8 labor hours). 

**With LogiScan AI, the same task is completed by one employee in under 1 hour.**

- **Labor Reduction:** 87% reduction in daily labor hours.
- **Accuracy:** Eliminates human error in data entry and matching.
- **Speed:** From hours to minutes, with real-time inventory visibility.

## Core Technical Features

### **GPT-4o Vision with Schema Adherence**

The AI vision pipeline doesn't just *look* at images—it analyzes them against a strict data schema. By using a detailed system prompt in `src/app/scan/actions.ts`, we instruct GPT-4o to ignore irrelevant shipping labels and only parse the exact internal sticker format. This ensures clean, predictable JSON output and prevents bad data from ever reaching the database.

### **PostgreSQL Fuzzy Search & Composite Keys**

The system is built for resilience. Package data is synced via a `UNIQUE` composite key on `(unit, last_four)` in the Supabase PostgreSQL database. The `upsert` operation is atomic and automatically handles conflicts, making it safe for high-concurrency operations. When matching, the client-side logic uses a forgiving `includes()` check, providing the tactical flexibility of a fuzzy search while the database maintains strict data integrity.

### **200+ Pair Golden Dataset for Regressions**

To guarantee AI reliability, a golden dataset of over 200 image/JSON pairs is used for regression testing. Before deploying changes to the core prompt, this dataset is used to verify that accuracy remains at 99%+. This practice is essential for maintaining enterprise-grade predictability in a system reliant on non-deterministic AI outputs.

### **Local-First PWA with Offline Capabilities**

The application is fully installable on mobile devices (`manifest.json`) and uses a service worker (`sw.js`) to cache core assets. This "local-first" strategy ensures the app loads instantly and remains functional even in spotty Wi-Fi environments, which are common in storage rooms and basements where inventory is stored. 

## Deployment Readiness

This project is configured for a one-click Vercel deployment. All necessary environment variables are defined in `.env.example`.

### 1. Clone & Install
```bash
git clone https://github.com/Seryozh/logiscan-ai.git
cd logiscan-ai
npm install
```

### 2. Configure Environment
Copy the `.env.example` to `.env.local` and add your API keys:
```bash
cp .env.example .env.local
```

### 3. Set Up Supabase
Run the provided SQL schema in your Supabase project to create the `packages` table with its unique constraints.

### 4. Run Locally
```bash
npm run dev
```

### 5. Deploy
Push to a Vercel-linked GitHub repository.
