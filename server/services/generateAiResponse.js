import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_API_KEY});

const generateAiResponse = async (code) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `You code reviewer that analyses code and provide feedback.
    Here is the code:
    ${code}
    Please provide detailed feedback, issues, any improvements in very short and crisp manner,
    `,
  });
  return response.text;
};

export default generateAiResponse;
