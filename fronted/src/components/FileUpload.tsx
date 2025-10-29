// src/components/FileUpload.tsx

import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { uploadDocument } from '../services/api';
import React, {useState, type DragEvent, type ChangeEvent } from 'react';
import { isPdfFile } from '../utils/helpers';
import {type MessageState } from '../types/types';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<MessageState>({ type: '', text: '' });

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!isPdfFile(file)) {
      setMessage({ type: 'error', text: 'רק קבצי PDF מותרים' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await uploadDocument(file);
      setMessage({ type: 'success', text: `הקובץ הועלה בהצלחה! מזהה: ${result.id}` });
      onUploadSuccess();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'שגיאה בהעלאת הקובץ' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">העלאת מסמך חדש</h2>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 bg-gray-50 hover:border-blue-400'
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <p className="text-lg text-gray-600">מעלה קובץ ומעבד עם AI...</p>
          </div>
        ) : (
          <>
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-700 mb-2">גרור קובץ PDF לכאן</p>
            <p className="text-gray-500 mb-6">או</p>
            <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
              בחר קובץ
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </>
        )}
      </div>

      {message.text && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{message.text}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;


