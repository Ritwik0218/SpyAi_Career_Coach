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
        // Use pdf-lib for basic PDF handling
        const { PDFDocument } = await import('pdf-lib');
        
        // Load the PDF
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = pdfDoc.getPages();
        
        // For now, we'll provide a helpful message
        // Full text extraction from PDF requires additional setup
        return NextResponse.json(
          { error: 'PDF text extraction is in development. For now, please copy and paste your resume text directly into the text area below, or convert your PDF to DOCX format for automatic text extraction.' },
          { status: 400 }
        );
        
      } catch (error) {
        console.error('PDF processing error:', error);
        return NextResponse.json(
          { error: 'Unable to process PDF file. Please copy and paste your resume text directly, or convert to DOCX format.' },
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
