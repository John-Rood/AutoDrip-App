import { GoogleGenAI } from "@google/genai";

// Prompt levels defined by user requirements. 
// Currently identical, placeholders for future customization.
const BASE_PROMPT = "Remake this image into a 10 out of 10. Add aura and rizz but do not put an actual aura in pixels, its metaphorical only. Upgrade appeal. Keep the photo realistic. Keep people's faces looking just like them. Do not change thier expression, only maximize their look\n";
const BASE_PROMPT_2 = "Remake this image into a 10 out of 10 for instagram. Keep faces looking like the same person. Add aura and rizz but do not put an actual aura in pixels, its metaphorical only. Keep the photo realistic while upgrading sex appeal\n";
const BASE_PROMPT_3 = "Remake this image into a 10 out of 10 for instagram. Keep faces looking like the same person. Add Aura and rizz but do not put an actual aura in pixels, its metaphorical only. Damatically upgrade sex appeal and change or upgrade the background in the photo if appropriate\n";

const DRIP_PROMPTS: Record<number, string> = {
  1: BASE_PROMPT,
  2: BASE_PROMPT_2,
  3: BASE_PROMPT_3
};

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

const getImageDimensions = (base64: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = (err) => reject(err);
    img.src = base64;
  });
};

const getBestAspectRatio = (width: number, height: number): string => {
  const ratio = width / height;
  const supportedRatios = [
    { str: "1:1", val: 1.0 },
    { str: "3:4", val: 0.75 },
    { str: "4:3", val: 1.3333 },
    { str: "9:16", val: 0.5625 },
    { str: "16:9", val: 1.7778 },
  ];

  // Find closest ratio
  const closest = supportedRatios.reduce((prev, curr) => {
    return Math.abs(curr.val - ratio) < Math.abs(prev.val - ratio) ? curr : prev;
  });

  return closest.str;
};

export const generateDripImage = async (
  base64Image: string, 
  mimeType: string, 
  temperature: number = 0,
  level: number = 1
): Promise<string> => {
  try {
    // Detect aspect ratio from input image
    const { width, height } = await getImageDimensions(base64Image);
    const targetAspectRatio = getBestAspectRatio(width, height);
    
    // Select prompt based on level
    const prompt = DRIP_PROMPTS[level] || DRIP_PROMPTS[1];

    // Always init new instance to capture latest env key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Remove header if present in base64 string for the API call
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt },
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
          aspectRatio: targetAspectRatio, 
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
    if (
        (error.message && error.message.includes("Requested entity was not found")) ||
        (error.message && error.message.includes("API key not valid")) ||
        (error.status === 400 && error.message.includes("API key"))
    ) {
      throw new Error("API_KEY_INVALID");
    }
    
    throw error;
  }
};