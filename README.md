# LogiScan AI

**Intelligent Inventory Audit Platform**

LogiScan AI is a modern package management system that uses AI-powered vision and text parsing to streamline hotel package tracking and inventory audits. Built with Next.js 15, OpenAI GPT-4o, and Supabase.

---

## Features

### 📸 Shelf Audit
- **AI Vision Scanning**: Photograph shelves and let GPT-4o Vision extract package information from stickers
- **Real-time Matching**: Client-side matching for instant verification against your inventory
- **Session Progress Tracking**: Track audit progress with real-time statistics
- **Missing Items Report**: Quickly identify packages that haven't been scanned yet
- **Audio & Haptic Feedback**: Instant success notifications for smooth workflow

### 🔄 Package Sync
- **Smart Text Parsing**: Paste messy package logs and let AI extract structured data
- **Intelligent Extraction**: Automatically identifies unit numbers, guest names, and tracking codes
- **Database Integration**: Seamlessly syncs parsed data to Supabase with conflict resolution
- **Bulk Operations**: Clear database at shift start with one-click danger zone controls

---

## Tech Stack

- **Framework**: Next.js 15.1.2 with React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o (Vision + Text)
- **Database**: Supabase (PostgreSQL)
- **Image Processing**: HTML5 Canvas API for client-side compression

---

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))
- Supabase account and project ([Sign up here](https://supabase.com))

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/logiscan-ai.git
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
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
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

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

### Package Sync Workflow
1. Navigate to **Package Sync** from the home page
2. Paste your messy package logs into the textarea
3. Click **Sync Packages** to let AI extract and parse the data
4. View success message with count of synced packages
5. Use **Clear Database** at shift start to wipe previous data

**Example Input:**
```
C01K Unit SAMPLE ENTERPRISE LLC USPS - #2158797859 - 420330199400150106151023930196 John Doe 3901 1/8/2026
C02A Unit Sample Company Inc AMAZON - #2158026780 - tba327462399298 Jane Smith 3901 1/6/2026
```

**Extracted Data:**
- Unit: `C01K`, `C02A`
- Guest Name: `John Doe`, `Jane Smith`
- Last Four: `0196`, `9298`

### Shelf Audit Workflow
1. Navigate to **Shelf Audit** from the home page
2. Take a photo of the shelf (AI extracts sticker information automatically)
3. View matched packages instantly with guest names
4. See real-time progress (e.g., "42 / 156 packages scanned")
5. Click **Show Missing Items** to see what hasn't been scanned yet
6. Continue scanning until audit is complete

**Sticker Format (Internal White Stickers):**
```
Line 1: [UNIT] (e.g., C01K, C06V)
Line 2: [DATE]
Line 3: [CODE] [INITIALS] (e.g., "5723 PD", "NO TRK PD")
```

---

## Configuration

### Image Upload Limits
The system is configured to handle photos up to **10MB** in size with client-side compression:
- **Max Width**: 2500px (maintains aspect ratio)
- **Quality**: 80% JPEG compression
- **Format**: Automatic conversion to JPEG

Configured in `next.config.ts`:
```typescript
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',
    allowedOrigins: ["localhost:3000", "192.168.50.70:3000"],
  },
}
```

### AI Model Configuration
Both features use **GPT-4o** for optimal performance:
- **Shelf Audit**: `gpt-4o` with Vision API (max_tokens: 1000)
- **Package Sync**: `gpt-4o` text model (temperature: 0 for strict parsing)

---

## Project Structure

```
package-audit-tool/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Landing page with navigation
│   │   ├── layout.tsx            # Root layout
│   │   ├── scan/
│   │   │   ├── page.tsx          # Shelf audit UI (camera, results)
│   │   │   └── actions.ts        # AI vision + package fetching
│   │   └── sync/
│   │       ├── page.tsx          # Package sync UI (textarea, sync button)
│   │       └── actions.ts        # AI text parsing + database ops
│   └── lib/
│       └── supabase.ts           # Supabase client initialization
├── .env.local                    # Environment variables (not in git)
├── next.config.ts                # Next.js configuration
└── package.json                  # Dependencies and scripts
```

---

## Performance Optimizations

### Client-Side Matching
The Shelf Audit feature loads the **entire inventory once** into client memory, then performs instant local matching:
- **Before**: ~10 seconds (AI scan + multiple DB queries)
- **After**: ~5 seconds (AI scan only + instant client matching)

### Image Compression
Photos are compressed client-side before upload to reduce:
- Network bandwidth usage
- Server processing time
- OpenAI API costs

---

## Database Schema

### `packages` Table
| Column      | Type      | Description                          |
|-------------|-----------|--------------------------------------|
| id          | UUID      | Primary key (auto-generated)         |
| unit        | TEXT      | Unit identifier (e.g., C01K)         |
| guest_name  | TEXT      | Recipient's name                     |
| last_four   | TEXT      | Last 4 digits of tracking number     |
| created_at  | TIMESTAMP | Record creation timestamp            |

**Unique Constraint**: `(unit, last_four)` prevents duplicates

---

## Troubleshooting

### API Key Issues
- Ensure `.env.local` is in the **root directory** (same level as `package.json`)
- Restart the development server after changing environment variables
- Verify API keys are active and have sufficient credits

### Image Upload Errors
- Check that `next.config.ts` has `bodySizeLimit: '10mb'`
- Ensure photos are less than 10MB after compression
- Try taking a new photo if the scan fails

### Database Connection Issues
- Verify Supabase URL and anon key are correct in `.env.local`
- Check that the `packages` table exists in your Supabase project
- Ensure RLS (Row Level Security) policies allow operations

---

## Contributing

This is a specialized hotel package management system. If you'd like to adapt it for your use case, feel free to fork and modify the AI prompts in:
- `src/app/scan/actions.ts` (Vision API system prompt)
- `src/app/sync/actions.ts` (Text parsing system prompt)

---

## License

MIT License - feel free to use this project for your own logistics operations.

---

## Acknowledgments

Built with:
- [Next.js](https://nextjs.org) by Vercel
- [OpenAI GPT-4o](https://openai.com) for AI capabilities
- [Supabase](https://supabase.com) for database infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling
