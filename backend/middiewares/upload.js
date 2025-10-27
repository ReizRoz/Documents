import multer from "multer";
const storage = multer.diskStorage({
    //פונקציה שמגדירה איפה לשמור את הקבצים
  destination: (req, file, cb) => cb(null, "./"),
  //פונקציה שמגדירה שם לקובץ
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
//פונקציה שמסננת איזה קבצים מותר להעלות-PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed"), false);
};
//יוצרים מופע של multer עם ההגדרות הנ"ל
export const upload = multer({ storage, fileFilter });
