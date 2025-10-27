import { GoogleGenAI } from "@google/genai";

let client;

const getClient = () => {
  if (!client) {
    console.log("✨ Initializing Gemini Client for the first time...");
    if (!process.env.GEMINI_API_KEY) {
      console.error("FATAL ERROR: GEMINI_API_KEY is not defined. Check your .env file.");
      throw new Error("Missing GEMINI_API_KEY in environment variables.");
    }
    client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return client;
};

// פונקציה חדשה לניקוי והכנת הטקסט ל-JSON.parse
const cleanJsonString = (text) => {
  // 1. מחיקת בלוק הקוד הפותח ("```json") ובלוק הקוד הסוגר ("```")
  let jsonText = text.replace(/```json\n?|```/g, '').trim();
  
  // 2. מחיקת רווחים או שורות ריקות מיותרות בתחילת ובסוף הטקסט
  return jsonText.trim();
};

export const translateAndSummarize = async (text) => {
      
      // המידע המקורי בטקסט
      const originalLength = text.split(/\s+/).length; 
      // הגדרת יעד מקסימלי למילים בסיכום (חצי מהאורך המקורי)
      const maxSummaryWords = Math.floor(originalLength / 2); 
      
      const prompt = `
      Please return ONLY the JSON object, do not include any explanatory text or markdown formatting.
      
      The JSON object must have the following fields:
      {
        "subjectHebrew": "...",
        "summaryHebrew": "...",
        "summaryEnglish": "...",
        "dateHebrew": "...",
        "subjectEnglish": "..."
      }
      
      **Constraint:** The 'summaryHebrew' field must be a concise summary, and the word count **must not exceed ${maxSummaryWords} words**.
      
      Summarize and translate this text: ${text}
      `;
  

  const aiClient = getClient(); 

  const response = await aiClient.models.generateContent({
    model: "gemini-2.5-flash",
    temperature: 0.2,
    contents: prompt,
  });

  // שימוש בפונקציה החדשה כדי לנקות את התשובה לפני ה-Parsing
  const cleanedText = cleanJsonString(response.text);
  
  // במקום JSON.parse(response.text)
  return JSON.parse(cleanedText); 
};