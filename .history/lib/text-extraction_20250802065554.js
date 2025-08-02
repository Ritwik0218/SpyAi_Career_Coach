// Client-side text extraction utilities for resume files
// Uses server-side API for PDF/DOCX processing to avoid Node.js module issues

/**
 * Extract text from various file formats using server-side API
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
  
  // For PDF and DOCX files, use server-side API
  if (
    fileType === 'application/pdf' || 
    fileName.endsWith('.pdf') ||
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
      console.error('Text extraction error:', error);
      throw new Error(error.message || 'Failed to extract text from file');
    }
  }
  
  throw new Error('Unsupported file format. Please use PDF, DOCX, or TXT files.');
}
