import fs from 'fs';
import { createRequire } from 'module';
import { translateAndSummarize } from './ai.js';

// תיקון לייבוא pdf-parse-fork ב-ESM
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse-fork');

// פונקציה ראשית לעיבוד PDF
export const processPDFWithAI = async (filePath) => {
  // בדיקה שהקובץ קיים
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileStats = fs.statSync(filePath);
  console.log(`📄 Processing PDF: ${filePath} (${(fileStats.size / 1024).toFixed(2)} KB)`);

  try {
    console.log('🔍 Extracting text from PDF...');
    const dataBuffer = fs.readFileSync(filePath);
    
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text.trim();
    
    if (!text || text.length < 10) {
      throw new Error('PDF appears to be empty or contains only images. Please upload a text-based PDF.');
    }

    console.log(`✅ Extracted ${text.length} characters from PDF`);
    console.log(`📑 Number of pages: ${pdfData.numpages}`);

    // שליחה לעיבוד AI
    console.log('🤖 Sending text to AI for analysis...');
    const aiResult = await translateAndSummarize(text);
    console.log('✅ AI processing completed');

    return {...aiResult,originalText: text};

  } catch (err) {
    console.error('❌ PDF processing failed:', err.message);
    
    if (err.message.includes('empty') || err.message.includes('images')) {
      throw err;
    }
    
    throw new Error('Failed to extract text from PDF. The file might be corrupted or password-protected.');
  }
};

// פונקציה עזר לבדיקת PDF
export const validatePDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    return { 
      valid: true, 
      pages: pdfData.numpages,
      textLength: pdfData.text.length,
      info: pdfData.info
    };
  } catch (err) {
    return { 
      valid: false, 
      error: err.message 
    };
  }
};