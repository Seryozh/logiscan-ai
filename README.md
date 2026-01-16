# LogiScan AI

**Intelligent Inventory Audit Platform**

LogiScan AI is a modern package management system designed to streamline hotel package tracking and inventory audits. It leverages AI-powered vision and text parsing to eliminate manual data entry. Built with Next.js 15, OpenAI GPT-4o, and Supabase.

## Features

### 📸 Shelf Audit
* **AI Vision Scanning:** Photograph shelves and let GPT-4o Vision automatically extract package information from stickers.
* **Real-time Matching:** Client-side matching provides instant verification against your inventory.
* **Session Progress Tracking:** View audit progress with real-time statistics.
* **Missing Items Report:** Quickly identify packages that have not been scanned yet.
* **Audio & Haptic Feedback:** Instant success notifications ensure a smooth workflow.

### 🔄 Package Sync
* **Smart Text Parsing:** Paste messy package logs and let AI extract structured data.
* **Intelligent Extraction:** Automatically identifies unit numbers, guest names, and tracking codes.
* **Database Integration:** Seamlessly syncs parsed data to Supabase with conflict resolution.
* **Bulk Operations:** Includes danger zone controls to clear the database at the start of a shift.

## Tech Stack
* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **AI:** OpenAI GPT-4o (Vision + Text)
* **Database:** Supabase (PostgreSQL)
* **Image Processing:** HTML5 Canvas API for client-side compression

## Setup Instructions

### Prerequisites
* Node.js 18+ installed
* OpenAI API key
* Supabase account and project

### 1. Clone the Repository
```bash
git clone [https://github.com/Seryozh/logiscan-ai.git](https://github.com/Seryozh/logiscan-ai.git)
cd logiscan-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=[https://your-project.supabase.co](https://your-project.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Set Up Supabase Database
Run this SQL in your Supabase SQL editor to create the packages table:

```sql
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  unit TEXT NOT NULL,
  guest_name TEXT,
  last_four TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(unit, last_four)
);

CREATE INDEX idx_packages_unit ON packages(unit);
CREATE INDEX idx_packages_last_four ON packages(last_four);
```

### 5. Run the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Usage Guide

### Package Sync Workflow
1. Navigate to **Package Sync** from the home page.
2. Paste your raw package logs into the text area.
3. Click **Sync Packages** to let AI extract and parse the data.
4. View the success message with the count of synced packages.

**Example Input:**
> C01K Unit SAMPLE ENTERPRISE LLC USPS - #2158797859 - 420330199400150106151023930196 John Doe 3901 1/8/2026

**Extracted Data:**
* **Unit:** C01K
* **Guest Name:** John Doe
* **Last Four:** 0196

### Shelf Audit Workflow
1. Navigate to **Shelf Audit** from the home page.
2. Take a photo of the shelf. The AI extracts sticker information automatically.
3. View matched packages instantly along with guest names.
4. Track real-time progress (e.g., "42 / 156 packages scanned").
5. Click **Show Missing Items** to identify what is missing.

**Sticker Format (Internal White Stickers):**
* Line 1: [UNIT] (e.g., C01K, C06V)
* Line 2: [DATE]
* Line 3: [CODE] [INITIALS] (e.g., "5723 PD", "NO TRK PD")

## Configuration

### Image Upload Limits
The system handles photos up to **10MB** with client-side compression to save bandwidth and costs.
* **Max Width:** 2500px (maintains aspect ratio)
* **Quality:** 80% JPEG compression
* **Format:** Automatic conversion to JPEG

### AI Model Configuration
Both features utilize **GPT-4o** for optimal performance.
* **Shelf Audit:** `gpt-4o` with Vision API (max_tokens: 1000)
* **Package Sync:** `gpt-4o` text model (temperature: 0 for strict parsing)

## Performance Optimizations

### Client-Side Matching
The Shelf Audit feature loads the **entire inventory once** into client memory, then performs instant local matching.
* **Before:** ~10 seconds (AI scan + multiple DB queries)
* **After:** ~5 seconds (AI scan only + instant client matching)

### Image Compression
Photos are compressed client-side before upload to reduce network bandwidth usage, server processing time, and OpenAI API costs.

## Troubleshooting
* **API Key Issues:** Ensure `.env.local` is in the root directory and keys are active.
* **Image Upload Errors:** Check that `next.config.ts` includes `bodySizeLimit: '10mb'` and that photos are compressed correctly.
* **Database Connection:** Verify Supabase URL and anon key are correct and that RLS policies allow operations.

## Contributing
This is a specialized hotel package management system. If you would like to adapt it for your use case, feel free to fork and modify the AI prompts in `src/app/scan/actions.ts` (Vision) and `src/app/sync/actions.ts` (Text parsing).

## License
MIT License.