import { Router } from 'express';
import * as transcriptController from '../controllers/transcript.controller';
import { optionalAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Extract transcript endpoint (matches frontend expectation)
// No authentication required - free for everyone!
// But we use optionalAuth to track usage for logged-in users
router.post(
  '/',
  optionalAuth, // Check for auth but don't require it
  validate({
    url: { required: true, type: 'string' },
    language: { required: false, type: 'string', maxLength: 10 },
    formats: { required: false, custom: (value) => Array.isArray(value) || 'formats must be an array' },
    includeSummary: { required: false, type: 'boolean' },
  }),
  transcriptController.extractTranscript
);

export default router;