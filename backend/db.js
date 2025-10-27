// קובץ: db/database.js (דוגמה)

import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // MongoDB יצרו את ה-DB באופן אוטומטי כשנעשה בו שימוש לראשונה
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Atlas Connected successfully! 💾');
    // אין צורך ב-initDB ב-MongoDB עבור יצירת טבלאות
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // יציאה מהאפליקציה במקרה של כשל בחיבור
  }
};