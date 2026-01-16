"use server";

import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function auditShelf(formData: FormData) {
  const file = formData.get("image") as File;
  if (!file) {
    return {
      success: false,
      message: "No image provided",
      scannedItems: [],
    };
  }

  // Convert image to base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64Image = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64Image}`;

  try {
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

    // Parse AI Response - Return raw scanned items only
    let content = completion.choices[0].message.content || "[]";
    content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    const scannedItems = JSON.parse(content);

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

export async function getAllPackages() {
  try {
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
