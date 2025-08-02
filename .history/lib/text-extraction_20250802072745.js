// Client-side text extraction utilities for resume files
// Uses server-side API for DOCX processing and client-side for PDF

/**
 * Extract text from various file formats
 * @param {File} file - File object (PDF, DOCX, or TXT)
 * @returns {Promise<string>} - Extracted text content
 */
export async function extractTextFromFile(file) {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  // Handle text files directly on client-side
  if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }
  
  // Handle PDF files - use server-side API for consistent processing
  if (
    fileType === 'application/pdf' || 
    fileName.endsWith('.pdf')
  ) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract text from PDF');
      }
      
      return result.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(error.message || 'Failed to extract text from PDF. The PDF might be image-based or protected. Please convert to DOCX or copy the text manually.');
    }
  }
  
  // For DOCX files, use server-side API (mammoth works well there)
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx') ||
    fileType === 'application/msword' ||
    fileName.endsWith('.doc')
  ) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to extract text from file');
      }
      
      return result.text;
    } catch (error) {
      console.error('DOCX extraction error:', error);
      throw new Error(error.message || 'Failed to extract text from DOCX file');
    }
  }
  
  throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT files.');
}
