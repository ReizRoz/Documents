import dotenv from 'dotenv';
import express from 'express';
import documentRoutes from './routers/documentsRouter.js'
import cors from 'cors';

import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json());

// רוטים
app.use('/api/documents', documentRoutes);

// מאזינים
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
// קובץ: app.js (חלק רלוונטי)
import { connectDB } from './db.js'; // או מאיפה ששמרת את הפונקציה

