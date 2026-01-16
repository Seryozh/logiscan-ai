"use client";

import { useState } from "react";
import { syncPackages, clearDatabase } from "./actions";

export default function SyncPage() {
  const [packageList, setPackageList] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
  } | null>(null);

  async function handleSync() {
    if (!packageList.trim()) {
      setResult({ success: false, message: "Please paste a package list first." });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await syncPackages(packageList);
      setResult(response);
      if (response.success) {
        setPackageList("");
      }
    } catch {
      setResult({ success: false, message: "An error occurred while syncing packages." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-blue-900">Package Sync</h1>
          <p className="mt-2 text-lg text-blue-600">
            Paste your package list below to extract and sync tracking information
          </p>
        </div>

        {/* Danger Zone */}
        <div className="mb-8 rounded-lg border-2 border-red-200 bg-red-50 p-4">
          <h2 className="mb-2 font-bold text-red-800">⚠️ Danger Zone</h2>
          <button
            onClick={async () => {
              if (confirm("Are you sure? This deletes ALL packages.")) {
                const res = await clearDatabase();
                alert(res.message);
              }
            }}
            className="w-full rounded bg-red-600 px-4 py-2 text-white shadow hover:bg-red-700"
          >
            🗑️ Clear Database (Start of Shift)
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-blue-200/50">
          {/* Textarea */}
          <div className="mb-6">
            <label
              htmlFor="package-list"
              className="mb-2 block text-sm font-semibold text-blue-800"
            >
              Package List
            </label>
            <textarea
              id="package-list"
              value={packageList}
              onChange={(e) => setPackageList(e.target.value)}
              placeholder="Paste your package list here...&#10;&#10;Example:&#10;C01K - John Smith - TRK123456789&#10;B02J - Jane Doe - PKG987654321"
              className="h-64 w-full resize-none rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 text-gray-800 placeholder-blue-300 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100"
              disabled={isLoading}
            />
          </div>

          {/* Result Message */}
          {result && (
            <div
              className={`mb-6 rounded-lg p-4 ${
                result.success
                  ? "border border-green-200 bg-green-50 text-green-800"
                  : "border border-red-200 bg-red-50 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <svg
                    className="h-5 w-5"
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
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                <span className="font-medium">{result.message}</span>
              </div>
            </div>
          )}

          {/* Sync Button */}
          <button
            onClick={handleSync}
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:cursor-not-allowed disabled:from-blue-400 disabled:to-blue-500 disabled:shadow-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Syncing...
              </span>
            ) : (
              "Sync Packages"
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-xl bg-blue-900/5 p-6">
          <h2 className="mb-3 text-lg font-semibold text-blue-900">
            What gets extracted?
          </h2>
          <ul className="space-y-2 text-blue-700">
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
                1
              </span>
              <span>
                <strong>Unit</strong> - The unit identifier (e.g., C01K, B02J)
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
                2
              </span>
              <span>
                <strong>Guest Name</strong> - The recipient&apos;s name
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
                3
              </span>
              <span>
                <strong>Last Four</strong> - Last 4 digits of the tracking code
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
