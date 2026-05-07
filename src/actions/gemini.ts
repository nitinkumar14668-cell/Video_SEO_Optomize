'use server';

import { GoogleGenAI, Type } from "@google/genai";

export async function fixSeo(
  currentTitle: string, 
  currentDescription: string, 
  currentTags: string[], 
  problems: string[]
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `You are an expert YouTube Video SEO optimizer. 
Here are the details of a video:
Title: "${currentTitle}"
Description: "${currentDescription}"
Tags: [${currentTags.join(", ")}]

SEO Problems identified:
${problems.length > 0 ? problems.map(p => "- " + p).join("\n") : "- The text could be more engaging and perfectly aligned with YouTube SEO best practices."}

Please fix these issues and rewrite the Title, Description, and Tags to be highly optimized for the YouTube algorithm. 
- Make the title catchy, highly clickable, and strictly within 40-70 characters. 
- Make the description detailed (at least 250 chars) and heavily feature the main Title keywords within its first 2 sentences. Include a call to action.
- Provide 8-15 highly relevant, high-search-volume tags.

Return the result as a json object matching the schema.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "The heavily optimized new title."
          },
          description: {
            type: Type.STRING,
            description: "The complete, optimized new description."
          },
          tags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of 8-15 optimized tags."
          }
        },
        required: ["title", "description", "tags"]
      }
    }
  });

  const text = response.text?.trim() || "{}";
  return JSON.parse(text) as { title: string, description: string, tags: string[] };
}
