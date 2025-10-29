// src/utils/helpers.ts

export const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return 'לא זמין';
    return dateStr;
  };
  
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  export const isPdfFile = (file: File): boolean => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  };