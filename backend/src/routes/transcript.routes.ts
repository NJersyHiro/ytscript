import { Router } from 'express';
import * as transcriptController from '../controllers/transcript.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// All transcript routes require authentication
router.use(authenticate);

// Extract transcript from YouTube URL
router.post(
  '/extract',
  validate({
    url: { required: true, type: 'string' },
    language: { required: false, type: 'string', maxLength: 10 },
    formats: { required: false, custom: (value) => Array.isArray(value) || 'formats must be an array' },
    includeSummary: { required: false, type: 'boolean' },
  }),
  transcriptController.extractTranscript
);

// Get user's transcripts with pagination
router.get('/', transcriptController.getUserTranscripts);

// Get specific transcript by ID
router.get('/:id', transcriptController.getTranscriptById);

export default router;