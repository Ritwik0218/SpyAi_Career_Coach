import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();
    
    let extractedText = '';

    // Handle different file types
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      extractedText = buffer.toString('utf-8');
    } 
    else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      try {
        // Use pdfjs-dist which is more reliable
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
        
        // Initialize PDF.js
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(arrayBuffer),
          verbosity: 0 // Suppress console output
        });
        
        const pdf = await loadingTask.promise;
        const textContent = [];
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContentObj = await page.getTextContent();
          const pageText = textContentObj.items
            .map(item => item.str)
            .join(' ');
          textContent.push(pageText);
        }
        
        extractedText = textContent.join('\n\n');
        
        // Clean up
        pdf.destroy();
        
      } catch (error) {
        console.error('PDF extraction error:', error);
        return NextResponse.json(
          { error: 'Failed to extract text from PDF file. Please ensure it\'s a valid PDF or try converting to DOCX.' },
          { status: 400 }
        );
      }
    } 
    else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      try {
        // Dynamic import to avoid module loading issues
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
      } catch (error) {
        console.error('DOCX extraction error:', error);
        return NextResponse.json(
          { error: 'Failed to extract text from DOCX file. Please ensure it\'s a valid DOCX.' },
          { status: 400 }
        );
      }
    } 
    else if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
      return NextResponse.json(
        { error: 'DOC files are not fully supported. Please convert to DOCX or PDF format.' },
        { status: 400 }
      );
    } 
    else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please use PDF, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'No text content found in the file' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      length: extractedText.length,
      fileName: file.name,
      fileType: file.type
    });

  } catch (error) {
    console.error('Text extraction API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during text extraction' },
      { status: 500 }
    );
  }
}
