import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Image file is required" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  
  const result = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a medical imaging specialist. You analyze symptoms like rashes, jaundice, and inflammations with high clinical accuracy. Always include a medical disclaimer.",
      responseMimeType: "application/json"
    },
    contents: [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: buffer.toString("base64"),
        },
      },
      { text: `
ACT AS: A highly experienced clinical diagnostic assistant.
TASK: Analyze the provided medical image for signs of dermatological or systemic conditions.

CONTEXT: The user is presenting symptoms potentially related to: 
[Dengue Fever, Psoriasis, Hepatitis, or Bacterial Infection].

INSTRUCTIONS:
1. VISUAL ANALYSIS: Describe the morphology (e.g., maculopapular rash, silvery scales, erythema, or jaundice in the sclera).
2. CLASSIFICATION: Categorize the image into the most likely clinical condition.
3. RATIONALE: Briefly state WHY this classification was chosen based on visual markers.
4. CONFIDENCE: Provide a score from 0.0 to 1.0.

FORMAT: Return ONLY a JSON object:
{
  "classification": "string",
  "visual_findings": ["marker1", "marker2"],
  "rationale": "string",
  "confidence_score": float,
  "disclaimer": "This is an AI-generated analysis and not a formal diagnosis."
}
` },
    ],
  });

  return NextResponse.json({ reply: [result] });
}