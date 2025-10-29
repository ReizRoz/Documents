import React, { useState, useEffect } from 'react';

import { Upload, FileText, AlertCircle, CheckCircle, Loader, Search, Calendar, Eye, Trash2, X, Sparkles } from 'lucide-react';
import './index.css';



// Types

type DocumentType = {

  id: number;

  OriginalFile: string;

  OriginalText: string;

  SubjectHebrew: string;

  SummaryHebrew: string;

  SummaryEnglish: string;

  Date: string;

  SubjectEnglish: string;

};



type MessageState = {

  type: 'success' | 'error' | '';

  text: string;

};
// Helper Functions

const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'לא זמין';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // אם התאריך לא תקין, החזר את המחרוזת המקורית
    return date.toLocaleDateString('he-IL');
  } catch {
    return dateStr;
  }
};

// FileUpload Component

const FileUpload: React.FC<{ onUploadSuccess: () => void }> = ({ onUploadSuccess }) => {

  const [isDragging, setIsDragging] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });



  const uploadFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'רק קבצי PDF מותרים' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      setMessage({ type: 'success', text: `הקובץ הועלה בהצלחה! מזהה: ${result.id}` });
      onUploadSuccess();
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאה בהעלאת הקובץ' });
    } finally {
      setUploading(false);
    }
  };



  return (

    <div className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 bg-gradient-to-br from-white via-purple-50 to-blue-50">

      {/* Animated Background */}

      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-10 animate-pulse"></div>

      

      {/* Border Animation */}

      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-[3px]">

        <div className="h-full w-full rounded-3xl bg-white"></div>

      </div>



      <div className="relative p-8">

        <div className="flex items-center gap-3 mb-6">

          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">

            <Upload className="w-8 h-8 text-white" />

          </div>

          <div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">

              העלאת מסמך חדש

            </h2>

            <p className="text-sm text-gray-500">גרור קובץ או לחץ לבחירה</p>

          </div>

        </div>



        <div

          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}

          onDragLeave={() => setIsDragging(false)}

          onDrop={(e) => {

            e.preventDefault();

            setIsDragging(false);

            if (e.dataTransfer.files.length > 0) uploadFile(e.dataTransfer.files[0]);

          }}

          className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-500 ${

            isDragging

              ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-blue-100 scale-[1.02]'

              : 'border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-purple-400'

          }`}

        >

          {uploading ? (

            <div className="flex flex-col items-center gap-4">

              <div className="relative">

                <Loader className="w-16 h-16 text-purple-600 animate-spin" />

                <Sparkles className="w-8 h-8 text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

              </div>

              <p className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

                מעלה ומעבד את המסמך...

              </p>

            </div>

          ) : (

            <>

              <div className="relative mb-4">

                <FileText className="w-20 h-20 text-gray-300 mx-auto" />

                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl"></div>

              </div>

              <p className="text-2xl font-bold text-gray-800 mb-2">גרור קובץ PDF לכאן</p>

              <p className="text-gray-500 mb-6">או</p>

              <label className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 font-semibold">

                בחר קובץ מהמחשב

                <input

                  type="file"

                  accept=".pdf"

                  onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}

                  className="hidden"

                />

              </label>

            </>

          )}

        </div>



        {message.text && (

          <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 border-2 ${

            message.type === 'success'

              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-400 text-green-800'

              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-400 text-red-800'

          }`}>

            {message.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}

            <p className="font-semibold">{message.text}</p>

          </div>

        )}

      </div>

    </div>

  );

};



// SearchBar Component

const SearchBar: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {

  return (

    <div className="relative w-full md:w-96 group">

      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

      <div className="relative">

        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-500 w-5 h-5 z-10" />

        <input

          type="text"

          placeholder="חפש מסמכים..."

          value={value}

          onChange={(e) => onChange(e.target.value)}

          className="w-full pr-12 pl-6 py-4 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 outline-none transition-all bg-white shadow-lg"

        />

      </div>

    </div>

  );

};



// DocumentCard Component

const DocumentCard: React.FC<{ doc: DocumentType; onView: (doc: DocumentType) => void; onDelete: (id: number) => void }> = ({ doc, onView, onDelete }) => {

  const [deleting, setDeleting] = useState(false);



  const handleDelete = () => {

    if (!window.confirm('האם למחוק את המסמך?')) return;

    setDeleting(true);

    setTimeout(() => {

      onDelete(doc.id);

      setDeleting(false);

    }, 1000);

  };



  return (

    <div className="group relative">

      {/* Gradient Border */}

      <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>

      

      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-transparent hover:border-purple-200 transform hover:-translate-y-2">

        {/* Header with gradient badge */}

        <div className="flex justify-between items-start mb-4">

          <div className="flex-1">

            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">

              {doc.SubjectHebrew}

            </h3>

            <p className="text-sm text-gray-500">{doc.SubjectEnglish}</p>

          </div>

          <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-bold shadow-lg">

            #{doc.id}

          </div>

        </div>



        {/* Summary with gradient background */}

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 mb-4 border border-purple-100">

          <p className="text-gray-700 text-sm line-clamp-3">{doc.SummaryHebrew}</p>

        </div>



        {/* Date */}

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 bg-gray-50 rounded-lg p-2">

          <Calendar className="w-4 h-4 text-purple-500" />

          <span className="font-semibold">{formatDate(doc.Date)}</span>

        </div>



        {/* Actions */}

        <div className="flex gap-3">

          <button

            onClick={() => onView(doc)}

            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"

          >

            <Eye className="w-5 h-5" />

            צפייה

          </button>

          <button

            onClick={handleDelete}

            disabled={deleting}

            className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50"

          >

            {deleting ? <Loader className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}

          </button>

        </div>

      </div>

    </div>

  );

};



// DocumentDetail Component

const DocumentDetail: React.FC<{ doc: DocumentType; onClose: () => void }> = ({ doc, onClose }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-lg" 
      onClick={handleBackdropClick}
    >

    

<div 
        className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Gradient Border */}

        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-[3px]">

          <div className="h-full w-full rounded-3xl bg-white overflow-hidden">

            {/* Header with animated gradient */}

            <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-8 z-10">

              <div className="flex justify-between items-start">

                <div className="flex-1">

                  <h2 className="text-3xl font-bold mb-3">{doc.SubjectHebrew}</h2>

                  <p className="text-blue-100 text-lg">{doc.SubjectEnglish}</p>

                </div>

                <button 

                  onClick={onClose} 

                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-3 transition-all hover:scale-110"

                >

                  <X className="w-7 h-7" />

                </button>

              </div>

            </div>



            {/* Content */}

            <div className="p-8 space-y-6">

              {/* Metadata */}

              <div className="flex flex-wrap gap-4">

                <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">

                  <span className="font-bold">מזהה: #{doc.id}</span>

                </div>

                <div className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg">

                  <span className="font-bold">{formatDate(doc.Date)}</span>

                </div>

                <div className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl shadow-lg">

                  <span className="font-bold">{doc.OriginalFile}</span>

                </div>

              </div>



              {/* Hebrew Summary */}

              <div className="relative">

                <div className="absolute -inset-[2px] bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-sm opacity-50"></div>

                <div className="relative bg-white rounded-2xl p-6 border-2 border-blue-200">

                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">

                    <FileText className="w-6 h-6 text-blue-600" />

                    סיכום בעברית

                  </h3>

                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">

                    <p className="text-gray-700 leading-relaxed">{doc.SummaryHebrew}</p>

                  </div>

                </div>

              </div>



              {/* English Summary */}

              <div className="relative">

                <div className="absolute -inset-[2px] bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-sm opacity-50"></div>

                <div className="relative bg-white rounded-2xl p-6 border-2 border-green-200">

                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">

                    <FileText className="w-6 h-6 text-green-600" />

                    English Summary

                  </h3>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">

                    <p className="text-gray-700 leading-relaxed">{doc.SummaryEnglish}</p>

                  </div>

                </div>

              </div>



              {/* Original Text */}

              <div className="relative">

                <div className="absolute -inset-[2px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-sm opacity-50"></div>

                <div className="relative bg-white rounded-2xl p-6 border-2 border-purple-200">

                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">

                    <FileText className="w-6 h-6 text-purple-600" />

                    טקסט מקורי

                  </h3>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 max-h-96 overflow-y-auto">

                    <p className="text-gray-700 text-sm leading-relaxed">{doc.OriginalText}</p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};



// Main App

const App: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [showDocumentList, setShowDocumentList] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/documents');
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


 
  const filteredDocs = documents.filter(
    (doc) =>
      doc.SubjectHebrew?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.SubjectEnglish?.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">

      <div className="container mx-auto px-4 py-12 max-w-7xl">

        {/* Animated Header */}

        <header className="text-center mb-16 relative">

          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-10 blur-3xl"></div>

          <h1 className="relative text-6xl font-black mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">

            מערכת ניהול מסמכים חכמה

          </h1>

          <p className="relative text-gray-600 text-xl font-medium">
נתח ונהל מסמכים בקלות עם עיבוד של AI ✨ 

          </p>

        </header>



        <FileUpload onUploadSuccess={fetchDocuments} />



        {/* Toggle Button */}

        <div className="my-8 text-center">

          <button

            onClick={() => setShowDocumentList(!showDocumentList)}

            className="px-10 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 font-bold text-lg"

          >

            {showDocumentList ? '✖ סגור רשימת מסמכים' : '📂 הצג רשימת מסמכים'}

          </button>

        </div>



        {/* Documents List */}

        {showDocumentList && (

          <div className="relative">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-[3px]">

              <div className="h-full w-full rounded-3xl bg-white p-8">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">

                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">

                    המסמכים שלי ({filteredDocs.length})

                  </h2>

                  <SearchBar value={searchQuery} onChange={setSearchQuery} />

                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {filteredDocs.map((doc) => (

                    <DocumentCard

                      key={doc.id}

                      doc={doc}

                      onView={setSelectedDoc}

                      onDelete={(id) => setDocuments(documents?.filter(d => d.id !== id))}

                    />

                  ))}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>



      {selectedDoc && <DocumentDetail doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}

    </div>

  );

};



export default App;