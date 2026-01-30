
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  async generateResponse(userMessage: string) {
    try {
      // Re-initialize for fresh context and key access
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          maxOutputTokens: 2500, // Increased to ensure long survey results finish
          topK: 40,
          topP: 0.95,
        },
      });

      return response.text || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("AI Generation Error:", error);
      if (error instanceof Error && error.message.includes("API key")) {
        return "⚠️ Error: Invalid API Key. Please ensure the environment is configured correctly.";
      }
      return "⚠️ Oops! Something went wrong while connecting to the university server. Please try again or contact the admins.";
    }
  }
}

export const gemini = new GeminiService();
