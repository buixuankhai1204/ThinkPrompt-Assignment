import { Injectable } from '@nestjs/common';
import { CreateProcessDto } from './dto/create-process.dto';
import { promises as fs } from 'fs';
import PdfParse from 'pdf-parse';
import { PDFDocument, rgb } from 'pdf-lib';
import * as path from 'path';
import fontkit from '@pdf-lib/fontkit';

@Injectable()
export class ProcessService {
  create(createProcessDto: CreateProcessDto) {
    return 'This action adds a new process';
  }

  async processPdf(filePath: string): Promise<string> {
    try {
      // Read the PDF file
      const pdfBuffer = await fs.readFile(filePath);

// Extract text using pdf-parse
      const pdfData = await PdfParse(pdfBuffer);
      const extractedText = pdfData.text; // Raw text from the PDF

      // Convert the text to uppercase
      const uppercaseText = extractedText.toUpperCase();
      // Load the original PDF using pdf-lib
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      pdfDoc.registerFontkit(fontkit);

      const fontPath = path.resolve('uploads/Roboto-Regular.ttf');
      const fontBuffer = await fs.readFile(fontPath); // Replace with your font file
      const customFont = await pdfDoc.embedFont(fontBuffer);

      // Get all pages of the PDF
      const pages = pdfDoc.getPages();
      // Overlay the uppercase text on each page
      pages.forEach((page, index) => {
        const { width, height } = page.getSize();

        page.drawRectangle({
          x: 0,
          y: 0,
          width,
          height,
          color: rgb(1, 1, 1), // Xóa nền để vẽ lại
        });

        page.drawText(uppercaseText, {
          x: 50,
          y: height- 30,
          size: 12,
          lineHeight: 14,
          font: customFont, // Use the embedded font
          color: rgb(0, 0, 0), // Black text
        });
      });

      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedFilePath = filePath.replace('.pdf', '_modified.pdf');
      await fs.writeFile(modifiedFilePath, modifiedPdfBytes);

      return modifiedFilePath;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
  }
}
