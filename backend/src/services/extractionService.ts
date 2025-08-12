import PDFDocument from 'pdfkit';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import ExcelJS from 'exceljs';
import { ValidationError, ExtractionError, ErrorCode } from '../utils/AppError';
import prisma from '../config/database';
import { TranscriptStatus } from '../generated/prisma';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

interface TranscriptSegment {
  start: number;
  duration: number;
  text: string;
}

interface ExtractedTranscript {
  segments: TranscriptSegment[];
  text: string;
  wordCount: number;
}

interface VideoMetadata {
  title: string;
  channel: string;
  duration: number;
  language: string;
}

export class ExtractionService {
  // Extract video ID from YouTube URL
  extractVideoId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    throw new ValidationError('Invalid YouTube URL', { url });
  }

  // Fetch transcript from YouTube using yt-dlp
  async fetchTranscript(videoUrl: string, language: string = 'en'): Promise<ExtractedTranscript> {
    const execAsync = promisify(exec);
    let tempDir: string | null = null;
    
    try {
      const videoId = this.extractVideoId(videoUrl);
      console.log(`Fetching real transcript for video ${videoId} in language ${language}`);
      
      // Create temporary directory for subtitle files
      tempDir = `/tmp/ytscript_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      await fs.mkdir(tempDir, { recursive: true });
      
      const outputPath = path.join(tempDir, 'transcript');
      const ytDlpPath = path.join(__dirname, '../../yt-dlp');
      
      // Use yt-dlp to extract subtitles
      const command = `${ytDlpPath} --write-subs --write-auto-subs --sub-lang ${language} --skip-download --output "${outputPath}" "${videoUrl}"`;
      
      console.log('Executing yt-dlp command:', command);
      await execAsync(command, { timeout: 30000 });
      
      // Check for VTT subtitle file
      const vttFile = `${outputPath}.${language}.vtt`;
      let subtitleContent: string;
      
      try {
        subtitleContent = await fs.readFile(vttFile, 'utf-8');
      } catch (readError) {
        // Try auto-generated subtitles if manual ones don't exist
        const autoVttFile = `${outputPath}.${language}.auto.vtt`;
        try {
          subtitleContent = await fs.readFile(autoVttFile, 'utf-8');
        } catch (autoReadError) {
          throw new ExtractionError(
            `No subtitles available for this video in language ${language}`,
            ErrorCode.EXTRACTION_FAILED,
            { videoId, language }
          );
        }
      }
      
      // Parse VTT content
      const segments = this.parseVTTContent(subtitleContent);
      const text = segments.map(s => s.text).join(' ');
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      
      console.log(`Successfully extracted ${segments.length} segments, ${wordCount} words`);
      
      return {
        segments,
        text,
        wordCount,
      };
    } catch (error: any) {
      if (error instanceof ValidationError || error instanceof ExtractionError) {
        throw error;
      }
      
      console.error('Transcript extraction error:', error);
      
      // Provide a more specific error message
      let errorMessage = 'Failed to extract transcript';
      if (error.message?.includes('timeout')) {
        errorMessage = 'Transcript extraction timed out';
      } else if (error.message?.includes('not available')) {
        errorMessage = 'Subtitles not available for this video';
      } else if (error.message?.includes('private')) {
        errorMessage = 'Video is private or unavailable';
      }
      
      throw new ExtractionError(
        errorMessage,
        ErrorCode.EXTRACTION_FAILED,
        { originalError: error.message }
      );
    } finally {
      // Clean up temporary directory
      if (tempDir) {
        try {
          await fs.rm(tempDir, { recursive: true, force: true });
        } catch (cleanupError) {
          console.warn('Failed to clean up temp directory:', cleanupError);
        }
      }
    }
  }
  
  // Parse VTT (WebVTT) subtitle content
  private parseVTTContent(vttContent: string): TranscriptSegment[] {
    const segments: TranscriptSegment[] = [];
    const lines = vttContent.split('\n');
    
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      
      // Look for timestamp lines (format: 00:00:01.360 --> 00:00:03.040)
      if (line.includes(' --> ')) {
        const [startTime, endTime] = line.split(' --> ');
        const start = this.parseVTTTimestamp(startTime.trim());
        const end = this.parseVTTTimestamp(endTime.trim());
        const duration = end - start;
        
        // Collect text from subsequent lines until empty line or next timestamp
        const textLines: string[] = [];
        i++;
        while (i < lines.length && lines[i].trim() && !lines[i].includes(' --> ')) {
          const textLine = lines[i].trim();
          // Remove VTT formatting tags and clean up text
          const cleanText = textLine
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/\[.*?\]/g, '') // Remove sound effects like [♪♪♪]
            .replace(/♪/g, '') // Remove music notes
            .trim();
          
          if (cleanText) {
            textLines.push(cleanText);
          }
          i++;
        }
        
        const text = textLines.join(' ').trim();
        if (text) {
          segments.push({
            start,
            duration,
            text,
          });
        }
      }
      i++;
    }
    
    return segments;
  }
  
  // Parse VTT timestamp format (00:00:01.360) to seconds
  private parseVTTTimestamp(timestamp: string): number {
    const parts = timestamp.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const secondsParts = parts[2].split(/[.,]/);
    const seconds = parseInt(secondsParts[0], 10);
    const milliseconds = parseInt(secondsParts[1] || '0', 10);
    
    return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
  }
  
  // Fetch video metadata using yt-dlp
  async fetchVideoMetadata(videoUrl: string): Promise<VideoMetadata> {
    const execAsync = promisify(exec);
    
    try {
      const ytDlpPath = path.join(__dirname, '../../yt-dlp');
      
      // Get video metadata as JSON
      const command = `${ytDlpPath} --print-json --skip-download "${videoUrl}"`;
      
      console.log('Fetching video metadata...');
      const { stdout } = await execAsync(command, { timeout: 15000 });
      
      const metadata = JSON.parse(stdout.trim());
      
      return {
        title: metadata.title || 'Unknown Title',
        channel: metadata.uploader || metadata.channel || 'Unknown Channel',
        duration: metadata.duration || 0,
        language: metadata.language || 'en',
      };
    } catch (error: any) {
      console.warn('Failed to fetch video metadata:', error.message);
      
      // Return default metadata if fetching fails
      return {
        title: 'YouTube Video',
        channel: 'Unknown Channel',
        duration: 0,
        language: 'en',
      };
    }
  }

  // Format converters
  generateTXT(transcript: ExtractedTranscript, includeTimestamps: boolean = true): string {
    if (!includeTimestamps) {
      return transcript.text;
    }

    return transcript.segments
      .map(segment => {
        const timestamp = this.formatTimestamp(segment.start);
        return `[${timestamp}] ${segment.text}`;
      })
      .join('\n\n');
  }

  generateSRT(transcript: ExtractedTranscript): string {
    return transcript.segments
      .map((segment, index) => {
        const startTime = this.formatSRTTimestamp(segment.start);
        const endTime = this.formatSRTTimestamp(segment.start + segment.duration);
        return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
      })
      .join('\n');
  }

  generateJSON(transcript: ExtractedTranscript, metadata?: VideoMetadata): object {
    return {
      metadata: metadata || {},
      wordCount: transcript.wordCount,
      segments: transcript.segments,
      fullText: transcript.text,
    };
  }

  async generatePDF(
    transcript: ExtractedTranscript,
    metadata?: VideoMetadata
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: any) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add metadata
      if (metadata) {
        doc.fontSize(20).text(metadata.title, { align: 'center' });
        doc.fontSize(14).text(`Channel: ${metadata.channel}`, { align: 'center' });
        doc.fontSize(12).text(`Duration: ${this.formatDuration(metadata.duration)}`, { align: 'center' });
        doc.moveDown(2);
      }

      // Add transcript
      doc.fontSize(11);
      transcript.segments.forEach(segment => {
        const timestamp = this.formatTimestamp(segment.start);
        doc.fillColor('#666').text(`[${timestamp}]`, { continued: true });
        doc.fillColor('#000').text(` ${segment.text}`);
        doc.moveDown(0.5);
      });

      doc.end();
    });
  }

  async generateDOCX(
    transcript: ExtractedTranscript,
    metadata?: VideoMetadata
  ): Promise<Buffer> {
    const children: Paragraph[] = [];

    // Add metadata
    if (metadata) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: metadata.title, bold: true, size: 32 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Channel: ${metadata.channel}`, size: 24 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `Duration: ${this.formatDuration(metadata.duration)}`, size: 24 })],
        }),
        new Paragraph({ text: '' }) // Empty line
      );
    }

    // Add transcript
    transcript.segments.forEach(segment => {
      const timestamp = this.formatTimestamp(segment.start);
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `[${timestamp}] `, color: '666666' }),
            new TextRun({ text: segment.text }),
          ],
        })
      );
    });

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    return await Packer.toBuffer(doc);
  }

  async generateXLSX(
    transcript: ExtractedTranscript,
    metadata?: VideoMetadata
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transcript');

    // Add metadata
    if (metadata) {
      worksheet.addRow(['Title', metadata.title]);
      worksheet.addRow(['Channel', metadata.channel]);
      worksheet.addRow(['Duration', this.formatDuration(metadata.duration)]);
      worksheet.addRow(['Word Count', transcript.wordCount]);
      worksheet.addRow([]); // Empty row
    }

    // Add headers
    worksheet.addRow(['Timestamp', 'Duration (seconds)', 'Text']);
    
    // Style headers
    const headerRow = worksheet.getRow(metadata ? 6 : 1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    // Add transcript data
    transcript.segments.forEach(segment => {
      worksheet.addRow([
        this.formatTimestamp(segment.start),
        segment.duration,
        segment.text,
      ]);
    });

    // Auto-fit columns
    worksheet.columns.forEach(column => {
      if (column.values) {
        let maxLength = 0;
        column.values.forEach(value => {
          if (value && value.toString().length > maxLength) {
            maxLength = value.toString().length;
          }
        });
        column.width = Math.min(maxLength + 2, 100);
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  }

  // Helper functions
  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  private formatSRTTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis
      .toString()
      .padStart(3, '0')}`;
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  }

  // Save extraction to database
  async saveExtraction(
    userId: string,
    videoUrl: string,
    transcript: ExtractedTranscript,
    metadata?: VideoMetadata
  ): Promise<string> {
    const videoId = this.extractVideoId(videoUrl);
    
    const extraction = await prisma.transcript.create({
      data: {
        userId,
        videoUrl,
        videoId,
        videoTitle: metadata?.title,
        channelName: metadata?.channel,
        duration: metadata?.duration,
        language: metadata?.language || 'en',
        rawTranscript: transcript.text,
        jsonContent: this.generateJSON(transcript, metadata),
        wordCount: transcript.wordCount,
        status: TranscriptStatus.COMPLETED,
      },
    });

    return extraction.id;
  }
}

export const extractionService = new ExtractionService();