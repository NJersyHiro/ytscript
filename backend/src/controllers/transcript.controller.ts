import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { TranscriptStatus, PlanType } from '../generated/prisma';

// Mock transcript extraction service - replace with actual implementation
const extractTranscriptFromYouTube = async (url: string, language: string = 'en') => {
  // This is a mock implementation
  // In real application, you would integrate with YouTube's API or a transcript extraction service
  console.log(`Extracting transcript for ${url} in language: ${language}`);
  
  return {
    videoId: extractVideoId(url),
    videoTitle: 'Sample Video Title',
    channelName: 'Sample Channel',
    duration: 300, // 5 minutes
    rawTranscript: 'This is a sample transcript for testing purposes.',
    srtContent: '1\n00:00:00,000 --> 00:00:05,000\nThis is a sample transcript for testing purposes.',
    jsonContent: {
      transcript: [
        {
          start: 0,
          duration: 5,
          text: 'This is a sample transcript for testing purposes.'
        }
      ]
    },
    wordCount: 10,
    processingTime: 1500,
  };
};

const extractVideoId = (url: string): string => {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : '';
};

export const extractTranscript = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { url, language = 'en', formats = ['txt'], includeSummary = false } = req.body;
    
    // Log the request for debugging
    console.log(`Processing request: includeSummary=${includeSummary}, formats=${JSON.stringify(formats)}`);

    if (!url) {
      throw new AppError('YouTube URL is required', 400);
    }

    // Validate YouTube URL
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new AppError('Invalid YouTube URL', 400);
    }

    // If user is authenticated, track usage and check limits
    let user = null;
    if (req.user) {
      user = await prisma.user.findUnique({
        where: { id: req.user.userId },
      });

      if (user) {
        // Simple usage limit check for logged-in users (e.g., PRO features)
        // But basic extraction is always free
        if (includeSummary && user.plan === PlanType.FREE) {
          throw new AppError('AI summaries require a Pro plan', 403);
        }
      }
    }

    // For anonymous users, we don't check cache or save to database
    // Just extract and return the transcript
    let existingTranscript = null;
    
    if (user) {
      // Check if transcript already exists for this video and user
      existingTranscript = await prisma.transcript.findFirst({
        where: {
          userId: user.id,
          videoId,
        },
      });

      if (existingTranscript && existingTranscript.status === TranscriptStatus.COMPLETED) {
        // Return existing transcript
        res.json({
          success: true,
          message: 'Transcript retrieved from cache',
          data: {
            transcript: existingTranscript,
            formats: {
              txt: existingTranscript.rawTranscript,
              srt: existingTranscript.srtContent,
              json: existingTranscript.jsonContent,
            }
          },
        });
        return;
      }
    }

    // For anonymous users, we'll just process without saving to DB
    // For logged-in users, create a transcript record
    let transcript = null;
    if (user) {
      transcript = await prisma.transcript.create({
        data: {
          userId: user.id,
          videoUrl: url,
          videoId,
          language,
          status: TranscriptStatus.PROCESSING,
        },
      });
    }

    // Extract transcript (this would be async in real implementation)
    try {
      const extractedData = await extractTranscriptFromYouTube(url, language);

      // For logged-in users, update transcript record and track usage
      let updatedTranscript = null;
      
      if (user && transcript) {
        updatedTranscript = await prisma.transcript.update({
          where: { id: transcript.id },
          data: {
            videoTitle: extractedData.videoTitle,
            channelName: extractedData.channelName,
            duration: extractedData.duration,
            rawTranscript: extractedData.rawTranscript,
            srtContent: extractedData.srtContent,
            jsonContent: extractedData.jsonContent,
            wordCount: extractedData.wordCount,
            processingTime: extractedData.processingTime,
            status: TranscriptStatus.COMPLETED,
          },
        });

        // Update user usage
        await prisma.user.update({
          where: { id: user.id },
          data: {
            monthlyUsage: user.monthlyUsage + 1,
            totalUsage: user.totalUsage + 1,
          },
        });

        // Log usage
        await prisma.usageLog.create({
          data: {
            userId: user.id,
            action: 'transcript_extraction',
            credits: 1,
            metadata: {
              videoId,
              language,
              formats,
            },
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
          },
        });
      } else {
        // For anonymous users, create response data directly
        updatedTranscript = {
          id: 'anonymous',
          videoTitle: extractedData.videoTitle,
          channelName: extractedData.channelName,
          duration: extractedData.duration,
          rawTranscript: extractedData.rawTranscript,
          srtContent: extractedData.srtContent,
          jsonContent: extractedData.jsonContent,
          wordCount: extractedData.wordCount,
          processingTime: extractedData.processingTime,
          status: TranscriptStatus.COMPLETED,
        };
      }

      // Prepare response formats
      const responseFormats: any = {};
      if (formats.includes('txt')) responseFormats.txt = updatedTranscript.rawTranscript;
      if (formats.includes('srt')) responseFormats.srt = updatedTranscript.srtContent;
      if (formats.includes('json')) responseFormats.json = updatedTranscript.jsonContent;

      res.json({
        success: true,
        message: 'Transcript extracted successfully',
        data: {
          transcript: updatedTranscript,
          formats: responseFormats,
        },
      });

    } catch (extractionError) {
      // Only update transcript status if it exists (for logged-in users)
      if (transcript && user) {
        await prisma.transcript.update({
          where: { id: transcript.id },
          data: {
            status: TranscriptStatus.FAILED,
            error: extractionError instanceof Error ? extractionError.message : 'Unknown error',
          },
        });
      }

      throw new AppError('Failed to extract transcript', 500);
    }

  } catch (error) {
    next(error);
  }
};

export const getUserTranscripts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const transcripts = await prisma.transcript.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      skip: offset,
      take: Number(limit),
      select: {
        id: true,
        videoUrl: true,
        videoId: true,
        videoTitle: true,
        channelName: true,
        duration: true,
        language: true,
        wordCount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const totalCount = await prisma.transcript.count({
      where: { userId: req.user.userId },
    });

    res.json({
      success: true,
      data: {
        transcripts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / Number(limit)),
        },
      },
    });

  } catch (error) {
    next(error);
  }
};

export const getTranscriptById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const { id } = req.params;

    const transcript = await prisma.transcript.findFirst({
      where: {
        id,
        userId: req.user.userId, // Ensure user can only access their own transcripts
      },
    });

    if (!transcript) {
      throw new AppError('Transcript not found', 404);
    }

    res.json({
      success: true,
      data: { transcript },
    });

  } catch (error) {
    next(error);
  }
};