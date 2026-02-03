"use server";

import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

// Initialize OpenAI client with API key from environment
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Analyzes a shelf photo using GPT-4o Vision to extract package identifiers
 *
 * This function processes an image of packages on a shelf, uses AI vision to
 * read internal stickers, and returns the extracted unit and tracking data.
 * Matching against the database happens client-side for instant feedback.
 *
 * @param formData - Form data containing the image file
 * @returns Array of scanned items with unit and last_four fields
 */
export async function auditShelf(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) {
    return {
      success: false,
      message: "No image provided",
      scannedItems: [],
    };
  }

  // Validate API key is configured
  if (!process.env.OPENAI_API_KEY) {
    return {
      success: false,
      message: "OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.",
      scannedItems: [],
    };
  }

  // Convert image to base64 for Vision API
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Image = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64Image}`;

  try {
    // Call GPT-4o Vision API with structured extraction prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze this image. Ignore shipping labels. Focus ONLY on the internal white sorting stickers.

          THE STICKER FORMAT:
          Line 1: [UNIT NUMBER] (e.g., C01K, C06V)
          Line 2: [DATE]
          Line 3: [CODE] [INITIALS] (e.g., "5723 PD", "3461 AR", "NO TRK PD", "1A2B PD")

          YOUR TASK:
          For every white sticker visible:
          1. Extract the UNIT.
          2. Extract the CODE from Line 3.
             - It is usually the first 4 characters.
             - It can be numbers (5723) OR letters (1A2B).
             - If it says "NO TRK", "NO TRAKING", or similar, return "NO TRK".
             - IGNORE the initials at the end.

          Return JSON array: [{ "unit": "C01K", "last_four": "5723" }]`,
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Scan this shelf." },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      max_tokens: 1000,
    });

    // Parse AI response and clean up markdown formatting
    let content = completion.choices[0].message.content || "[]";
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const scannedItems = JSON.parse(content);

    // Return raw scanned items (client handles matching for instant feedback)
    return {
      success: true,
      scannedItems: scannedItems || [],
    };
  } catch (error) {
    console.error("Audit error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      scannedItems: [],
    };
  }
}

/**
 * Fetches all packages from the database
 *
 * Used on page load to populate the client-side inventory cache.
 * This enables instant matching without server round-trips during scanning.
 *
 * @returns Array of all packages with unit, guest_name, and last_four fields
 */
export async function getAllPackages() {
  try {
    // Fetch all packages ordered by unit for consistent display
    const { data, error } = await supabase
      .from("packages")
      .select("unit, guest_name, last_four")
      .order("unit", { ascending: true });

    if (error) {
      console.error("Fetch error:", error);
      return { success: false, packages: [] };
    }

    return { success: true, packages: data || [] };
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, packages: [] };
  }
}
