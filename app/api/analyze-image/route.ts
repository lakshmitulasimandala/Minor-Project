

import { NextResponse } from "next/server";

// Helper function to call OpenRouter
async function analyzeImageWithOpenRouter(base64Data: string, mimeType: string) {
  const prompt = `
Analyze this image of a civic issue and respond EXACTLY in this format:
TITLE: short title
TYPE: one of (Theft, Fire Outbreak, Illegal Waste Dumping, Pothole, Uncollected Waste, Uneven Road, Unclosed Manhole, Electrical Hazard, Natural Disaster, Road Block, Sewage Overflow, Streetlight Not Working, Exposed Wiring, Other)
DESCRIPTION: short description (max 30 words)
`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Anonymous Issue Reporter",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${base64Data}` },
            },
          ],
        },
      ],
      max_tokens: 200, // Keep response concise
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "OpenRouter API failed");
  }

  return await response.json();
}

// Main API route
export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    // Validate image
    if (!image || !image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format" },
        { status: 400 }
      );
    }

    // Extract base64 data
    const base64Data = image.split(",")[1];
    const mimeType = image.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    // Call OpenRouter
    const data = await analyzeImageWithOpenRouter(base64Data, mimeType);
    const text = data.choices[0].message.content;

    console.log("✅ OpenRouter Response:", text);

    // Parse structured response
    const title = text.match(/TITLE:\s*(.*?)(?:\n|$)/)?.[1]?.trim() || "";
    const reportType = text.match(/TYPE:\s*(.*?)(?:\n|$)/)?.[1]?.trim() || "";
    const description = text.match(/DESCRIPTION:\s*(.*?)(?:\n|$)/)?.[1]?.trim() || "";

    return NextResponse.json({
      title,
      reportType,
      description,
      success: !!(title && reportType), // Flag if AI succeeded
    });

  } catch (error: any) {
    console.error("❌ Image analysis failed:", error);

    // Check for specific errors
    if (error.message?.includes("rate limit")) {
      console.log("⚠️ Rate limit hit, falling back to manual selection");
    }

    // Always return graceful fallback
    return NextResponse.json({
      title: "",
      reportType: "",
      description: "",
      success: false,
    });
  }
}
