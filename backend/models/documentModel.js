import mongoose from 'mongoose';
import { getNextSequence } from '../utils/getNextSequence.js';

// הגדרת הסכימה (Schema)
const DocumentSchema = new mongoose.Schema({
    id: { type: Number, unique: true }, // ID מספרי עוקב
    OriginalFile: { type: String, required: true },
    OriginalText: { type: String, required: true },
    SubjectHebrew: { type: String },
    SummaryHebrew: { type: String },
    SummaryEnglish: { type: String },
    Date: { type: String },
    SubjectEnglish: { type: String }
}, { timestamps: true }); // מוסיף createdAt ו-updatedAt אוטומטית

// יצירת המודל (Model)
const Document = mongoose.model('Document', DocumentSchema);

// פונקציות CRUD מעודכנות:

export const addDocument = async (docData) => {
    // 1️⃣ קבלת המספר הבא ברצף
    const nextId = await getNextSequence('documents');

    // 2️⃣ יצירת המסמך עם id חדש
    const doc = new Document({
        ...docData,
        id: nextId
    });

    // 3️⃣ שמירה למסד
    const result = await doc.save();

    // 4️⃣ מחזיר את ה-id המספרי העוקב
    return result.id;
};
// documentModel.js

// פונקציה שמסירה שדות מונגו מיותרים
// documentModel.js
export const sanitize = (data) => {
    if (!data) return null;
  
    // אם מדובר במערך של מסמכים
    if (Array.isArray(data)) {
      return data.map(doc => {
        const { _id, __v, ...cleanDoc } = doc.toObject();
        return cleanDoc;
      });
    }
  
    // אם מדובר במסמך יחיד
    const { _id, __v, ...cleanDoc } = data.toObject();
    return cleanDoc;
  };
  
export const getAllDocuments = async () => {
    return Document.find({}); // מביא את כל המסמכים מהקולקשן
};
export const getDocumentById = async (id) => {
    return Document.findOne({ id }); // מחפש לפי השדה id שלנו
  };
  export const deleteDocumentById = async (id) => {
    return Document.findOneAndDelete({ id });
  };
  