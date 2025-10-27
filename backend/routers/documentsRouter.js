import express from 'express';
import { uploadDocument, fetchDocuments, getById,deleteById } from '../controllers/documentsController.js';
import { upload } from '../middiewares/upload.js';

const router = express.Router();

// נתיב העלאת קובץ (POST)
router.post('/', upload.single('file'), uploadDocument);

// נתיב לקבלת כל הקבצים (GET)
router.get('/', fetchDocuments);
//נתיב לקבלת קובץ לפי הid 
router.get('/:id',getById);
router.delete('/:id', deleteById);
export default router;
