import express, { Router } from "express";
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import envConfig from "../envConfig";
import asyncHandler from "../utils/asyncHandler";
import ApiResponse from "../utils/ApiResponse";

const router = Router();

const genAI = new GoogleGenerativeAI(envConfig.gemini.apiKey);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

const contextPrompt = `
You are "FixBot", the AI assistant for ClicknFix, a smart technical assignment system. Your purpose is to help users with their technical issues and guide them on how to use the platform.
- Only answer questions about booking services, technician assignment, availability, pricing, and app usage. 
- Help users understand how to book a technician, what info is needed, and how assignment works. 
- Mention that usually a technician is assigned within 1 day if available. 
- Do not answer anything unrelated; politely redirect back to app context. 
- Keep responses short, clear, and professional.

Current user query: `;

export const handleChatbotMsg = asyncHandler(async (req, res) => {
  try {
    const { message } = req.query;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      safetySettings: safetySettings,
      generationConfig: {},
    });

    const fullPrompt = contextPrompt + message;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const aiText = response.text(); // AI's generated response

    res.json({ reply: aiText || "Sorry! I can't with that. Please try again" });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { reply: aiText || "Sorry! I can't with that. Please try again" },
          ""
        )
      );
  } catch (error) {
    console.error("AI Error:", error);
    res.status(200).json(
      new ApiResponse(
        200,
        {
          reply:
            "I'm experiencing some technical difficulties right now. Please try again shortly or submit a ticket directly.",
        },
        ""
      )
    );
  }
});

export default router;
