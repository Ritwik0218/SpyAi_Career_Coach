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
        // Use pdf-parse with proper error handling
        const pdfParse = (await import('pdf-parse')).default;
        
        // Extract text from PDF
        const data = await pdfParse(buffer, {
          // Configuration to prevent file system access
          max: 0, // Extract all pages
          version: 'v1.10.100'
        });
        
        extractedText = data.text;
        
        if (!extractedText || extractedText.trim().length === 0) {
          return NextResponse.json(
            { error: 'No text content found in PDF. The PDF might be image-based or protected. Please try converting to DOCX or copy the text manually.' },
            { status: 400 }
          );
        }
        
      } catch (error) {
        console.error('PDF extraction error:', error);
        
        // Handle specific errors
        if (error.message && error.message.includes('test/data')) {
          // This is the library initialization error - we can work around it
          console.log('PDF-parse initialization error, but continuing...');
          return NextResponse.json(
            { error: 'PDF processing encountered an initialization issue. Please try converting your PDF to DOCX format, or copy and paste the text directly below.' },
            { status: 400 }
          );
        }
        
        return NextResponse.json(
          { error: 'Failed to extract text from PDF file. Please try converting to DOCX format or copy the text manually.' },
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
