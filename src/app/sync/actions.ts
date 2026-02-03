"use server";

import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

// Initialize OpenAI client with error handling
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Syncs packages from raw text using GPT-4o text extraction
 *
 * This function takes messy package manifest text (copied from PDFs/emails),
 * uses AI to extract structured data, and syncs it to the database.
 *
 * @param packageText - Raw package list text from manifest
 * @returns Success status, message, and count of packages synced
 */
export async function syncPackages(packageText: string): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  try {
    // Validate API key is configured
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured. Please add OPENAI_API_KEY to your .env file.");
    }

    // Call OpenAI API with strict parsing prompt
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a specialized parser for a messy hotel package log. 
          
          The Data Pattern is roughly: 
          [UNIT] Unit [Owner] [Carrier] - #[Ref] - [TRACKING] [GUEST_NAME] 3901 [Date]

          YOUR TASK:
          1. Extract the UNIT (e.g., "C01K", "C02A").
          2. Find the TRACKING NUMBER. It is usually the LONG code after the second hyphen (e.g., "GFUSO...", "tba...", "1z...", "420..."). 
          3. Extract the LAST 4 characters of that tracking number.
          4. Extract the GUEST NAME. This is the name appearing AFTER the tracking number and BEFORE the code "3901".
          
          EXAMPLES:
          Input: "C01K Unit SAMPLE ENTERPRISE LLC USPS - #2158797859 - 420330199400150106151023930196 John Doe 3901 1/8/2026"
          Output: {"unit": "C01K", "last_four": "0196", "guest_name": "John Doe"}

          Input: "C02A Unit Sample Company Inc AMAZON - #2158026780 - tba327462399298 Jane Smith 3901 1/6/2026"
          Output: {"unit": "C02A", "last_four": "9298", "guest_name": "Jane Smith"}

          Return ONLY a raw JSON array of these objects. No markdown.`,
        },
        {
          role: "user",
          content: packageText.slice(0, 15000), // Safety truncation
        },
      ],
      temperature: 0, // Strict mode
    });

    let responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error("No AI response");

    // Clean up markdown formatting if AI includes it
    responseContent = responseContent.replace(/```json/g, "").replace(/```/g, "").trim();

    // Parse AI response into structured data
    const packages = JSON.parse(responseContent);

    // Filter out invalid entries (missing required fields)
    const validPackages = packages.filter((p: any) => p.unit && p.last_four);

    if (validPackages.length === 0) return { success: false, message: "No valid packages found." };

    // Upsert into Supabase (updates existing, inserts new)
    // onConflict ensures no duplicates on (unit, last_four) composite key
    const { error } = await supabase.from("packages").upsert(validPackages, {
      onConflict: "unit,last_four",
    });

    if (error) throw error;

    return {
      success: true,
      message: `Successfully cleaned and synced ${validPackages.length} packages.`,
      count: validPackages.length,
    };
  } catch (error) {
    console.error("Sync Error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Clears all packages from the database
 *
 * Used at the start of a shift to reset the inventory list.
 * This is a destructive operation and should be used with caution.
 *
 * @returns Success status and message
 */
export async function clearDatabase() {
  // Delete all rows (neq condition ensures we match all records)
  const { error } = await supabase.from("packages").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("Clear error:", error);
    return { success: false, message: "Failed to clear database." };
  }
  return { success: true, message: "Database wiped clean." };
}