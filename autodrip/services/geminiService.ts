import { GoogleGenAI } from "@google/genai";

// Prompt defined by user requirements
const DRIP_PROMPT = "Remake this image into a 10 out of 10 for instagram. Upgrade its sex appeal to the opposite sex. Add Aura and rizz\n\n";

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback if helper not present (dev env)
};

export const promptForApiKey = async (): Promise<void> => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio helper not found.");
  }
};

export const generateDripImage = async (base64Image: string, mimeType: string, temperature: number = 0): Promise<string> => {
  try {
    // Always init new instance to capture latest env key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Remove header if present in base64 string for the API call
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: DRIP_PROMPT },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          }
        ]
      },
      config: {
        temperature: temperature,
        imageConfig: {
          aspectRatio: "1:1", // Defaulting to square for Insta, though we could detect. 
          // Keeping it simple as per "10/10 for instagram" implies 1:1 or 4:5 usually.
          // Let's stick to 1:1 or allow model default? 
          // The prompt guidance says "aspectRatio: Changes the aspect ratio... Default is 1:1".
          // Let's explicitly request 1:1 for that classic Insta vibe unless the input is wildly different.
          // Actually, let's leave aspect ratio to default to respect the input composition usually, 
          // but specifically for 'gemini-3-pro-image-preview' we can specify imageSize.
          imageSize: "1K"
        }
      }
    });

    // Parse response
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    // Handle specific API key error to prompt re-selection
    if (error.message && error.message.includes("Requested entity was not found")) {
      throw new Error("API_KEY_INVALID");
    }
    
    throw error;
  }
};