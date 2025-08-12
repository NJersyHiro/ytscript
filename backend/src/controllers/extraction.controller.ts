import { Request, Response, NextFunction } from 'express';
import { extractionService } from '../services/extractionService';
import { asyncHandler } from '../middleware/error.middleware';
import { ValidationError, AuthorizationError, ErrorCode } from '../utils/AppError';
import prisma from '../config/database';
import { PlanType } from '../generated/prisma';

interface ExtractionRequest {
  url: string;
  language?: string;
  formats?: string[];
  includeSummary?: boolean;
  summaryType?: 'concise' | 'detailed' | 'bullet' | 'chapter' | 'academic' | 'executive';
}

const FREE_FORMATS = ['txt', 'srt', 'json'];
const PRO_FORMATS = ['pdf', 'docx', 'xlsx'];
const ALL_FORMATS = [...FREE_FORMATS, ...PRO_FORMATS];

export const extractTranscript = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { 
    url, 
    language = 'en', 
    formats = ['txt'], 
    includeSummary = false,
    summaryType = 'concise' 
  } = req.body as ExtractionRequest;

  // Validate URL
  if (!url) {
    throw new ValidationError('YouTube URL is required');
  }

  // Validate formats
  const invalidFormats = formats.filter(f => !ALL_FORMATS.includes(f));
  if (invalidFormats.length > 0) {
    throw new ValidationError(`Invalid formats: ${invalidFormats.join(', ')}`);
  }

  // Check user plan for Pro formats
  const userPlan = req.user?.plan || PlanType.FREE;
  const requestedProFormats = formats.filter(f => PRO_FORMATS.includes(f));
  
  if (requestedProFormats.length > 0 && userPlan !== PlanType.PRO) {
    throw new AuthorizationError(
      `Pro plan required for formats: ${requestedProFormats.join(', ')}`,
      ErrorCode.AUTH_INSUFFICIENT_PLAN
    );
  }

  // Check if summary is requested (Pro feature)
  if (includeSummary && userPlan !== PlanType.PRO) {
    throw new AuthorizationError(
      'AI summaries are a Pro feature',
      ErrorCode.AUTH_INSUFFICIENT_PLAN
    );
  }

  // Track usage if user is authenticated
  if (req.user) {
    await prisma.usageLog.create({
      data: {
        userId: req.user.userId,
        action: 'transcript_extraction',
        metadata: { url, language, formats },
      },
    });

    // Update user monthly usage
    await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        monthlyUsage: { increment: 1 },
        totalUsage: { increment: 1 },
      },
    });
  }

  // Fetch transcript and metadata
  const [transcript, metadata] = await Promise.all([
    extractionService.fetchTranscript(url, language),
    extractionService.fetchVideoMetadata(url)
  ]);

  // Generate requested formats
  const exports: Record<string, string> = {};
  
  for (const format of formats) {
    switch (format) {
      case 'txt':
        exports.txt = Buffer.from(extractionService.generateTXT(transcript)).toString('base64');
        break;
      case 'srt':
        exports.srt = Buffer.from(extractionService.generateSRT(transcript)).toString('base64');
        break;
      case 'json':
        exports.json = Buffer.from(
          JSON.stringify(extractionService.generateJSON(transcript, metadata))
        ).toString('base64');
        break;
      case 'pdf':
        if (userPlan === PlanType.PRO) {
          const pdfBuffer = await extractionService.generatePDF(transcript, metadata);
          exports.pdf = pdfBuffer.toString('base64');
        }
        break;
      case 'docx':
        if (userPlan === PlanType.PRO) {
          const docxBuffer = await extractionService.generateDOCX(transcript, metadata);
          exports.docx = docxBuffer.toString('base64');
        }
        break;
      case 'xlsx':
        if (userPlan === PlanType.PRO) {
          const xlsxBuffer = await extractionService.generateXLSX(transcript, metadata);
          exports.xlsx = xlsxBuffer.toString('base64');
        }
        break;
    }
  }

  // Generate summary if requested (Pro feature)
  let summary = null;
  if (includeSummary && userPlan === PlanType.PRO) {
    // TODO: Implement AI summary generation with OpenAI
    summary = {
      text: 'AI-generated summary would go here',
      keyPoints: ['Point 1', 'Point 2', 'Point 3'],
      type: summaryType,
    };
  }

  // Save extraction to database if user is authenticated
  if (req.user) {
    await extractionService.saveExtraction(
      req.user.userId,
      url,
      transcript,
      metadata
    );
  }

  // Get video ID from URL
  const videoId = extractionService.extractVideoId(url);

  // Return the response in the format expected by the frontend
  res.json({
    success: true,
    video_id: videoId,
    metadata: {
      video_id: videoId,
      title: metadata.title,
      channel: metadata.channel,
      word_count: transcript.wordCount,
      language: metadata.language,
      duration: metadata.duration,
      segment_count: transcript.segments.length,
    },
    transcript: transcript.text,
    transcript_text: transcript.text,
    formats: {
      txt: exports.txt ? Buffer.from(exports.txt, 'base64').toString() : undefined,
      srt: exports.srt ? Buffer.from(exports.srt, 'base64').toString() : undefined,
      json: exports.json ? JSON.parse(Buffer.from(exports.json, 'base64').toString()) : undefined,
      pdf: exports.pdf ? {
        data: exports.pdf,
        encoding: 'base64',
        content_type: 'application/pdf'
      } : undefined,
      docx: exports.docx ? {
        data: exports.docx,
        encoding: 'base64',
        content_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      } : undefined,
      xlsx: exports.xlsx ? {
        data: exports.xlsx,
        encoding: 'base64',
        content_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      } : undefined,
    },
    ...(summary && { ai_summary: summary }),
  });
});

export const getExtractionHistory = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (!req.user) {
    throw new AuthorizationError('Authentication required');
  }

  const { limit = 10, offset = 0, search } = req.query;

  const where: any = {
    userId: req.user.userId,
  };

  if (search) {
    where.OR = [
      { videoTitle: { contains: search as string, mode: 'insensitive' } },
      { channelName: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const [extractions, total] = await Promise.all([
    prisma.transcript.findMany({
      where,
      take: Number(limit),
      skip: Number(offset),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        videoUrl: true,
        videoTitle: true,
        channelName: true,
        duration: true,
        language: true,
        wordCount: true,
        createdAt: true,
      },
    }),
    prisma.transcript.count({ where }),
  ]);

  res.json({
    success: true,
    data: {
      extractions,
      total,
      hasMore: Number(offset) + Number(limit) < total,
    },
  });
});

export const getExtraction = asyncHandler(async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { id } = req.params;

  const extraction = await prisma.transcript.findUnique({
    where: { id },
  });

  if (!extraction) {
    throw new ValidationError('Extraction not found', { id });
  }

  // Check if user owns this extraction
  if (req.user && extraction.userId !== req.user.userId) {
    throw new AuthorizationError('Access denied');
  }

  res.json({
    success: true,
    data: extraction,
  });
});