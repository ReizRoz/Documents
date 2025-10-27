import { addDocument, getAllDocuments,getDocumentById ,sanitize ,deleteDocumentById} from '../models/documentModel.js';
import path from 'path';
import { processPDFWithAI } from '../utils/aiProcessor.js';
import fs from 'fs';
// פונקציה עזר ליצירת תאריך ושעה בעברית
const getCurrentHebrewDateTime = () => {
  // יצירת אובייקט תאריך ושעה נוכחי
  const now = new Date();

  // הגדרת אופציות לפורמט ישראלי (dd/mm/yyyy hh:mm:ss)
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false, // פורמט 24 שעות
    timeZone: 'Asia/Jerusalem'
  };

  // יצירת מחרוזת תאריך ושעה
  return now.toLocaleString('he-IL', options).replace(/, /g, ' ');
};

// העלאת קובץ + עיבוד AI
export const uploadDocument = async (req, res) => {
  try {
    //שמירת הקובץ שמגיע בבקשה
    const file = req.file;
    //אם אין קובץ 400
    if (!file) return res.status(400).json({ message: 'Missing file' });
    const uploadTime = getCurrentHebrewDateTime();
    const filePath = path.join(file.destination, file.filename); // ✅ הגדרה נכונה
    // שולחים את הקובץ ל-AI
    const aiResult = await processPDFWithAI(filePath);
    // יצירת אובייקט לשמירה בDB
    const id = await addDocument({
      OriginalFile: file.filename,
      OriginalText: aiResult.originalText,
      SubjectHebrew: aiResult.subjectHebrew,
      SummaryHebrew: aiResult.summaryHebrew,
      SummaryEnglish: aiResult.summaryEnglish,
      Date: uploadTime,
      SubjectEnglish: aiResult.subjectEnglish
    });
    try {
      fs.unlinkSync(filePath); // מחיקה סינכרונית של הקובץ
      console.log(`🗑️ Successfully deleted file: ${filePath}`);
    } catch (unlinkError) {
      // חשוב ללכוד שגיאות מחיקה כדי לא להפיל את השרת
      console.error('Error deleting local file:', unlinkError);
    }
    //מחזירים תשובה ללקוח בפורמט JSON.
    res.json({ id, message: 'Document uploaded and processed' });
  } catch (err) {
    console.error(err);
    if (req.file) { // ודא שהקובץ קיים לפני ניסיון המחיקה
      const filePath = path.join(req.file.destination, req.file.filename);
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Error deleting failed upload file:', e);
      }
      res.status(500).json({ message: 'Server error' });
    }
  }
}
  // קבלת כל המסמכים מהDB
  export const fetchDocuments = async (req, res) => {
    const docs = await getAllDocuments();
    res.json(sanitize(docs));
  };
  export const getById = async (req, res) => {
    try {
      const id = parseInt(req.params.id); // נניח שמקבלים את ה-id ב-URL
      const documentById = await getDocumentById(id);
  
      if (!documentById) {
        return res.status(404).json({ message: 'Document not found' });
      }
      res.json(sanitize(documentById));
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  export const deleteById = async (req, res) => {
    try {
      const id = parseInt(req.params.id); // אם id מספרי
      const deletedDoc = await deleteDocumentById(id);
  
      if (!deletedDoc) {
        return res.status(404).json({ message: 'Document not found' });
      }
  
      res.json({
        message: 'Document deleted successfully',
        deleted: sanitize(deletedDoc)
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

