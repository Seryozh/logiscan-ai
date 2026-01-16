import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-6xl font-bold text-transparent">
            LogiScan AI
          </h1>
          <p className="mb-2 text-2xl font-semibold text-gray-700">
            Intelligent Inventory Audit Platform
          </p>
          <p className="text-lg text-gray-600">
            AI-powered package management for modern logistics operations
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Scan Feature Card */}
          <Link href="/scan">
            <div className="group cursor-pointer rounded-2xl bg-white p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-blue-100 p-4 group-hover:bg-blue-200">
                  <svg
                    className="h-12 w-12 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-3 text-center text-2xl font-bold text-gray-800">
                Shelf Audit
              </h2>
              <p className="mb-4 text-center text-gray-600">
                Scan shelves with your camera. AI extracts package information from stickers
                and matches against your inventory in real-time.
              </p>
              <div className="flex items-center justify-center text-blue-600 font-semibold">
                Launch Scanner
                <svg
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </Link>

          {/* Sync Feature Card */}
          <Link href="/sync">
            <div className="group cursor-pointer rounded-2xl bg-white p-8 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
              <div className="mb-4 flex items-center justify-center">
                <div className="rounded-full bg-purple-100 p-4 group-hover:bg-purple-200">
                  <svg
                    className="h-12 w-12 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="mb-3 text-center text-2xl font-bold text-gray-800">
                Package Sync
              </h2>
              <p className="mb-4 text-center text-gray-600">
                Paste messy package logs. AI extracts unit numbers, guest names, and tracking
                codes, then syncs everything to your database.
              </p>
              <div className="flex items-center justify-center text-purple-600 font-semibold">
                Go to Sync
                <svg
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Features List */}
        <div className="mt-16 rounded-2xl bg-white/50 p-8 backdrop-blur-sm">
          <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Key Features
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">GPT-4o Vision</h4>
                <p className="text-sm text-gray-600">
                  Advanced AI analyzes package stickers with high accuracy
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Real-time Matching</h4>
                <p className="text-sm text-gray-600">
                  Client-side matching for instant verification
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Session Tracking</h4>
                <p className="text-sm text-gray-600">
                  Track progress throughout your audit session
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
