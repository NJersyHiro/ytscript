import { Router } from 'express';
import {
  extractTranscript,
  getExtractionHistory,
  getExtraction,
} from '../controllers/extraction.controller';
import { optionalAuth, authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';

const router = Router();

// Main extraction endpoint - works for both authenticated and unauthenticated users
router.post(
  '/',
  optionalAuth, // Check for auth but don't require it
  validate({
    url: { required: true, type: 'string' },
    language: { required: false, type: 'string', maxLength: 10 },
    formats: { required: false, custom: (value) => Array.isArray(value) || 'formats must be an array' },
    includeSummary: { required: false, type: 'boolean' },
    summaryType: { required: false, type: 'string' },
  }),
  extractTranscript
);

// History endpoints - require authentication
router.get('/history', authenticate, getExtractionHistory);
router.get('/history/:id', authenticate, getExtraction);

export default router;