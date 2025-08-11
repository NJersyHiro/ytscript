import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export interface ValidationRules {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'boolean' | 'email' | 'url';
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^https?:\/\/.+/;

export const validate = (rules: ValidationRules) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const errors: string[] = [];
    
    for (const field in rules) {
      const value = req.body[field];
      const fieldRules = rules[field];
      
      // Check required
      if (fieldRules.required && (value === undefined || value === null || value === '')) {
        errors.push(`${field} is required`);
        continue;
      }
      
      // Skip validation if field is optional and not provided
      if (!fieldRules.required && (value === undefined || value === null)) {
        continue;
      }
      
      // Type validation
      if (fieldRules.type) {
        switch (fieldRules.type) {
          case 'email':
            if (!emailRegex.test(value)) {
              errors.push(`${field} must be a valid email`);
            }
            break;
          case 'url':
            if (!urlRegex.test(value)) {
              errors.push(`${field} must be a valid URL`);
            }
            break;
          case 'string':
            if (typeof value !== 'string') {
              errors.push(`${field} must be a string`);
            }
            break;
          case 'number':
            if (typeof value !== 'number' && isNaN(Number(value))) {
              errors.push(`${field} must be a number`);
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push(`${field} must be a boolean`);
            }
            break;
        }
      }
      
      // String length validation
      if (typeof value === 'string') {
        if (fieldRules.minLength && value.length < fieldRules.minLength) {
          errors.push(`${field} must be at least ${fieldRules.minLength} characters`);
        }
        if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
          errors.push(`${field} must be at most ${fieldRules.maxLength} characters`);
        }
      }
      
      // Number range validation
      if (typeof value === 'number' || !isNaN(Number(value))) {
        const numValue = Number(value);
        if (fieldRules.min !== undefined && numValue < fieldRules.min) {
          errors.push(`${field} must be at least ${fieldRules.min}`);
        }
        if (fieldRules.max !== undefined && numValue > fieldRules.max) {
          errors.push(`${field} must be at most ${fieldRules.max}`);
        }
      }
      
      // Pattern validation
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors.push(`${field} has invalid format`);
      }
      
      // Custom validation
      if (fieldRules.custom) {
        const result = fieldRules.custom(value);
        if (result !== true) {
          errors.push(typeof result === 'string' ? result : `${field} is invalid`);
        }
      }
    }
    
    if (errors.length > 0) {
      return next(new AppError(errors.join(', '), 400));
    }
    
    next();
  };
};