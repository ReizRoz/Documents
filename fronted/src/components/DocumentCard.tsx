// src/components/DocumentCard.tsx
import React, { useState } from 'react';

import { deleteDocument } from '../services/api';
import { type DocumentType } from '../types/types'
import { formatDate } from '../utils/helpers';
import { Calendar, Eye, Loader, Trash2 } from 'lucide-react';

interface DocumentCardProps {
  doc: DocumentType;
  onView: (doc: DocumentType) => void;
  onDelete: (id: number) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ doc, onView, onDelete }) => {
  const [deleting, setDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המסמך?')) return;

    setDeleting(true);
    try {
      await deleteDocument(doc.id);
      onDelete(doc.id);
    } catch (error) {
      alert('שגיאה במחיקת המסמך');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 hover:border-blue-400 transform hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {doc.SubjectHebrew || 'ללא נושא'}
          </h3>
          <p className="text-sm text-gray-500 mb-1">
            {doc.SubjectEnglish || 'No subject'}
          </p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
          #{doc.id}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {doc.SummaryHebrew || 'אין תקציר זמין'}
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(doc.Date)}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(doc)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          צפייה
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;