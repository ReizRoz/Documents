// src/types/index.ts

export type DocumentType ={
    id: number;
    OriginalFile: string;
    OriginalText: string;
    SubjectHebrew: string;
    SummaryHebrew: string;
    SummaryEnglish: string;
    Date: string;
    SubjectEnglish: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export type UploadResponse = {
    id: number;
    message: string;
  }
  
  export type ApiError = {
    message: string;
  }
  
  export type MessageState = {
    type: 'success' | 'error' | '';
    text: string;
  }