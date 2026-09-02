import { GoogleGenAI } from "@google/genai";

async function generateArticleImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = "A high-quality, professional photograph of two diverse business executives (one man, one woman) in a modern corporate setting. They are passing a sleek, metallic relay baton to each other, symbolizing a smooth leadership transition and strategic partnership. The lighting is cinematic and inspiring, with a shallow depth of field. Professional business attire, corporate office background.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const imageUrl = `data:image/png;base64,${base64EncodeString}`;
        console.log("IMAGE_URL_START");
        console.log(imageUrl);
        console.log("IMAGE_URL_END");
      }
    }
  } catch (error) {
    console.error("Error generating image:", error);
  }
}

generateArticleImage();
