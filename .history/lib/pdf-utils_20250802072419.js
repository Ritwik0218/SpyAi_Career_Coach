// PDF extraction utility with error handling
let pdfParseModule = null;
let pdfParseError = null;

export async function extractPDFText(buffer) {
  try {
    // Try to load pdf-parse if not already loaded
    if (!pdfParseModule && !pdfParseError) {
      try {
        const pdfParse = await import('pdf-parse');
        pdfParseModule = pdfParse.default;
      } catch (error) {
        pdfParseError = error;
        console.error('Failed to load pdf-parse:', error);
      }
    }
    
    // If we couldn't load the module, throw an error
    if (pdfParseError) {
      throw new Error('PDF parsing library not available');
    }
    
    // Extract text using pdf-parse
    const data = await pdfParseModule(buffer, {
      max: 0, // Extract all pages
    });
    
    return data.text;
    
  } catch (error) {
    console.error('PDF extraction error:', error);
    
    // Provide specific error messages
    if (error.message && error.message.includes('test/data')) {
      throw new Error('PDF library has initialization issues. Please convert to DOCX or copy text manually.');
    }
    
    if (error.code === 'ENOENT') {
      throw new Error('PDF library has file system access issues. Please convert to DOCX or copy text manually.');
    }
    
    throw new Error('Failed to extract text from PDF. Please try DOCX format or manual text input.');
  }
}
