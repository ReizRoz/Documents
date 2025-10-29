import fs from 'fs';
import pdf from '@cedrugs/pdf-parse';
import { translateAndSummarize } from './ai.js';

// פונקציה ראשית לעיבוד PDF
export const processPDFWithAI = async (filePath) => {
  // בדיקה שהקובץ קיים
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileStats = fs.statSync(filePath);
  try {
    console.log('🔍 Extracting text from PDF...');
    const dataBuffer = fs.readFileSync(filePath);
    
    // חילוץ טקסט מה־PDF
    const pdfData = await pdf(dataBuffer);
    const text = pdfData.text.trim();
    
    if (!text || text.length < 3) {
      throw new Error('PDF appears to be empty or contains only images. Please upload a text-based PDF.');
    }

    const aiResult = await translateAndSummarize(text);

    return { ...aiResult, originalText: text };

  } catch (err) {
    console.error('❌ PDF processing failed:', err.message);
    //הודעה אם הקובץ ריק או שמכיל תמונה -לכן אין טקסט לחלץ ממנו
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
    const pdfData = await pdf(dataBuffer);
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
