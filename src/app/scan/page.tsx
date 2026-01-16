"use client";

import { useState, useRef, useEffect } from "react";
import { auditShelf, getAllPackages } from "./actions";

interface Package {
  unit: string;
  guest_name: string;
  last_four: string;
}

interface ScannedItem {
  unit: string;
  last_four: string;
}

export default function ScanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [inventory, setInventory] = useState<Package[]>([]);
  const [sessionResults, setSessionResults] = useState<Package[]>([]);
  const [lastScanFound, setLastScanFound] = useState<Package[]>([]);
  const [lastScanUnmatched, setLastScanUnmatched] = useState<ScannedItem[]>([]);
  const [showMissing, setShowMissing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch all packages on load (The Local Brain)
  useEffect(() => {
    async function fetchInventory() {
      const response = await getAllPackages();
      if (response.success) {
        setInventory(response.packages);
      }
    }
    fetchInventory();
  }, []);

  // Play success sound
  const playSuccessSound = () => {
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVKjn77BdGApCm9/yuHEjBzaP1vPNfS0GKHzJ8duNPwoVYbnr7qVTEgpJouHyvWohBzOJ0/PTgi8NJn/M8d6OPwoWYrrr76hUFApKo+HzvmsiCDSM1PPUfS0HKX3L8t+PQAsWY7zs75hSFApKo+L0wWwiBzWP1vPVfzAHKX/M8uCPPgwYZb7t8JlUFQpMpeL0wWwiBzWO1vPVgDAIKYDN8+CQPgwYZb7t8JlTFQpMpeP1w2wiBzWO1vPUgDAIKYDN8+CQPgwYZr7t8JlTFQpMpeP1w2wiBzWO1vPUgDAIKYDN8+CQPgwYZr7t8JlTFQpMpeP1w2wiBzWO1vPUgDAIKYDN8+CQPgwYZr7t8JlTFQpMpeP1w2wiBzWO1vPUgDAIKYDN8+CQPgwYZr7t8JlTFQpMpeP1w2wiBzWO1vPUgDAIKYDN8+CQPgwYZr7t8JlTFQpMpeP1w2wiBzWO1vPUgDAIKYDN8+CQPgwYZr7t8JlTFQpMpeP1w2wiCAA=");
    audio.play().catch(() => {
      // Ignore audio play errors
    });
  };

  // Trigger haptic feedback
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  // Client-side image compression
  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 2500;
        const scale = maxWidth / img.width;

        const width = scale < 1 ? maxWidth : img.width;
        const height = scale < 1 ? img.height * scale : img.height;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          "image/jpeg",
          0.8
        );

        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    });
  };

  // Client-Side Matching (Instant)
  const matchScannedItems = (scannedItems: ScannedItem[]) => {
    const found: Package[] = [];
    const unmatched: ScannedItem[] = [];

    for (const scanned of scannedItems) {
      // Match on unit and last_four
      const match = inventory.find(
        (item) =>
          item.unit === scanned.unit &&
          item.last_four.toLowerCase().includes(scanned.last_four.toLowerCase())
      );

      if (match) {
        found.push(match);
      } else {
        unmatched.push(scanned);
      }
    }

    return { found, unmatched };
  };

  async function handleImageCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Compress the image before uploading
      const compressedBlob = await compressImage(file);

      const formData = new FormData();
      formData.append("image", compressedBlob, "compressed_image.jpg");

      // Get raw scanned items from AI
      const response = await auditShelf(formData);

      if (!response.success) {
        setErrorMessage(response.message || "Scan failed");
        setLastScanFound([]);
        setLastScanUnmatched([]);
        return;
      }

      // Client-side matching (instant!)
      const { found, unmatched } = matchScannedItems(response.scannedItems);

      setLastScanFound(found);
      setLastScanUnmatched(unmatched);

      if (found.length > 0) {
        // Accumulate session results, filtering out duplicates
        setSessionResults((prev) => {
          const combined = [...prev, ...found];
          const unique = combined.filter(
            (item, index, self) =>
              index ===
              self.findIndex(
                (t) => t.unit === item.unit && t.last_four === item.last_four
              )
          );
          return unique;
        });

        // Play success feedback
        playSuccessSound();
        triggerHaptic();
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred"
      );
      setLastScanFound([]);
      setLastScanUnmatched([]);
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  // Calculate missing items locally
  const missingItems = inventory.filter(
    (item) =>
      !sessionResults.find(
        (r) => r.unit === item.unit && r.last_four === item.last_four
      )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-purple-900">Shelf Audit</h1>
          <p className="mt-2 text-lg text-purple-600">
            Session Audit Mode - Lightning Fast ⚡
          </p>
        </div>

        {/* Session Progress Bar */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-purple-900">
              Session Progress
            </h2>
            <span className="text-2xl font-bold text-purple-700">
              {sessionResults.length} / {inventory.length}
            </span>
          </div>
          <div className="h-4 w-full overflow-hidden rounded-full bg-purple-200">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
              style={{
                width: `${inventory.length > 0 ? (sessionResults.length / inventory.length) * 100 : 0}%`,
              }}
            />
          </div>
          <p className="mt-2 text-sm text-purple-600">
            {inventory.length > 0
              ? `${Math.round((sessionResults.length / inventory.length) * 100)}% Complete`
              : "Loading inventory..."}
          </p>
        </div>

        {/* Show Missing Button */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowMissing(!showMissing)}
            className="flex-1 rounded-xl bg-yellow-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          >
            {showMissing ? "Hide" : "Show"} Missing ({missingItems.length})
          </button>
        </div>

        {/* Missing Items Display */}
        {showMissing && (
          <div className="mb-6 rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-2xl">🔍</span>
              <h2 className="text-2xl font-bold text-orange-800">
                Missing Items ({missingItems.length})
              </h2>
            </div>
            {missingItems.length > 0 ? (
              <div className="max-h-96 space-y-3 overflow-y-auto">
                {missingItems.map((pkg, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border-2 border-orange-200 bg-orange-50 p-4"
                  >
                    <div className="font-bold text-orange-900">
                      Unit {pkg.unit}
                    </div>
                    <div className="text-orange-700">{pkg.guest_name}</div>
                    <div className="text-sm text-orange-600">
                      Last 4: {pkg.last_four}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-green-600">
                🎉 All packages have been verified!
              </p>
            )}
          </div>
        )}

        {/* Camera Button */}
        <div className="mb-8 flex justify-center">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex h-48 w-48 flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-2xl shadow-purple-500/50 transition-all hover:from-purple-700 hover:to-purple-800 hover:shadow-purple-500/60 focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:cursor-not-allowed disabled:from-purple-400 disabled:to-purple-500 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <svg
                  className="mb-4 h-16 w-16 animate-spin"
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
                <span className="text-center text-sm font-medium">
                  Analyzing shelf...
                  <br />
                  (approx 5s)
                </span>
              </>
            ) : (
              <>
                <span className="mb-2 text-6xl">📸</span>
                <span className="text-xl font-bold">Scan Shelf</span>
              </>
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageCapture}
            className="hidden"
            id="camera"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
            <div className="flex items-center gap-2">
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
              <span className="font-medium">{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Last Scan Results */}
        {(lastScanFound.length > 0 || lastScanUnmatched.length > 0) && (
          <div className="space-y-6">
            {/* Last Scan - Verified */}
            {lastScanFound.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <h2 className="text-2xl font-bold text-green-800">
                    Last Scan Found ({lastScanFound.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {lastScanFound.map((pkg, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border-2 border-green-200 bg-green-50 p-4"
                    >
                      <div className="font-bold text-green-900">
                        Unit {pkg.unit}
                      </div>
                      <div className="text-green-700">{pkg.guest_name}</div>
                      <div className="text-sm text-green-600">
                        Last 4: {pkg.last_four}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Last Scan - Unmatched */}
            {lastScanUnmatched.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <h2 className="text-2xl font-bold text-yellow-800">
                    Not Matched ({lastScanUnmatched.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {lastScanUnmatched.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-4"
                    >
                      <div className="font-bold text-yellow-900">
                        Unit: {item.unit}
                      </div>
                      <div className="text-sm text-yellow-700">
                        Last 4: {item.last_four}
                      </div>
                      <div className="mt-2 text-xs text-yellow-600">
                        Not found in inventory - check manually
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {lastScanFound.length === 0 &&
          lastScanUnmatched.length === 0 &&
          !isLoading &&
          !errorMessage && (
            <div className="mt-8 rounded-xl bg-purple-900/5 p-6">
              <h2 className="mb-3 text-lg font-semibold text-purple-900">
                How Session Audit Works
              </h2>
              <ol className="space-y-2 text-purple-700">
                <li className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800">
                    1
                  </span>
                  <span>
                    Scan each shelf - matches happen instantly on your device
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800">
                    2
                  </span>
                  <span>Progress bar updates as you verify packages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-200 text-xs font-bold text-purple-800">
                    3
                  </span>
                  <span>
                    Click "Show Missing" to see which packages need to be found
                  </span>
                </li>
              </ol>
            </div>
          )}
      </div>
    </div>
  );
}
