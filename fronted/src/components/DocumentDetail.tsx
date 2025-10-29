// src/components/DocumentDetail.tsx
import { type DocumentType } from '../types/types';
import { formatDate } from '../utils/helpers';
import { type MouseEvent } from 'react'; // נדרש לייבוא MouseEvent
import { X, FileText } from 'lucide-react';
interface DocumentDetailProps {
  doc: DocumentType | null;
  onClose: () => void;
}

const DocumentDetail: React.FC<DocumentDetailProps> = ({ doc, onClose }) => {
  if (!doc) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" 
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-2xl z-10">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{doc.SubjectHebrew}</h2>
              <p className="text-blue-100">{doc.SubjectEnglish}</p>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              aria-label="סגור"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-gray-600">מזהה:</span>
              <span className="font-bold text-blue-800 mr-2">#{doc.id}</span>
            </div>
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-gray-600">תאריך:</span>
              <span className="font-bold text-green-800 mr-2">{formatDate(doc.Date)}</span>
            </div>
            <div className="bg-purple-50 px-4 py-2 rounded-lg">
              <span className="text-gray-600">קובץ:</span>
              <span className="font-bold text-purple-800 mr-2">{doc.OriginalFile}</span>
            </div>
          </div>

          {/* Hebrew Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              סיכום בעברית
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{doc.SummaryHebrew}</p>
            </div>
          </div>

          {/* English Summary */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              English Summary
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{doc.SummaryEnglish}</p>
            </div>
          </div>

          {/* Original Text */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              טקסט מקורי
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 max-h-96 overflow-y-auto">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{doc.OriginalText}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;