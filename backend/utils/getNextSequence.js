// utils/getNextSequence.js
import { Counter } from '../models/counterModel.js';

export async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // יוצר אם לא קיים
  );
  return counter.seq;
}
