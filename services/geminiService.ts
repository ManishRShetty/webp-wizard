import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

// Convert Blob to Base64 string (without data prefix) for Gemini
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Remove data:image/webp;base64, prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateAltText = async (imageBlob: Blob): Promise<string> => {
  try {
    const ai = getGeminiClient();
    const base64Data = await blobToBase64(imageBlob);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/webp',
              data: base64Data,
            },
          },
          {
            text: 'Generate a concise, descriptive alt text for this image suitable for web accessibility. Do not include "image of" or "picture of".',
          },
        ],
      },
    });

    return response.text || "Could not generate description.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
