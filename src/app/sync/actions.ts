"use server";

import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function syncPackages(packageText: string): Promise<{
  success: boolean;
  message: string;
  count?: number;
}> {
  try {
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

    // Clean up if AI adds markdown
    responseContent = responseContent.replace(/```json/g, "").replace(/```/g, "").trim();

    const packages = JSON.parse(responseContent);

    // Filter valid rows
    const validPackages = packages.filter((p: any) => p.unit && p.last_four);

    if (validPackages.length === 0) return { success: false, message: "No valid packages found." };

    // Insert into Supabase
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

export async function clearDatabase() {
  const { error } = await supabase.from("packages").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // Deletes all rows

  if (error) {
    console.error("Clear error:", error);
    return { success: false, message: "Failed to clear database." };
  }
  return { success: true, message: "Database wiped clean." };
}