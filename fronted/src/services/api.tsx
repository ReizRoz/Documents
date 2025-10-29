// src/services/api.ts
import type { UploadResponse, DocumentType } from '../types/types';import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/documents';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadResponse>('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getAllDocuments = async (): Promise<DocumentType[]> => {
  const response = await api.get<DocumentType[]>('/');
  return response.data;
};

export const getDocumentById = async (id: number): Promise<DocumentType> => {
  const response = await api.get<DocumentType>(`/${id}`);
  return response.data;
};

export const deleteDocument = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};

export default api;