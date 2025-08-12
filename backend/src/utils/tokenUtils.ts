import crypto from 'crypto';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  type: 'passwordReset' | 'emailVerification';
}

interface DecodedToken extends TokenPayload {
  iat: number;
  exp: number;
}

class TokenUtils {
  private readonly jwtSecret: string;
  private readonly resetTokenExpiry = '24h'; // 24 hours
  private readonly verificationTokenExpiry = '7d'; // 7 days

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
  }

  /**
   * Generate a secure random token for password reset or email verification
   */
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate a JWT token for password reset
   */
  generatePasswordResetToken(userId: string, email: string): string {
    const payload: TokenPayload = {
      userId,
      email,
      type: 'passwordReset'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.resetTokenExpiry
    });
  }

  /**
   * Generate a JWT token for email verification
   */
  generateEmailVerificationToken(userId: string, email: string): string {
    const payload: TokenPayload = {
      userId,
      email,
      type: 'emailVerification'
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.verificationTokenExpiry
    });
  }

  /**
   * Verify and decode a token
   */
  verifyToken(token: string): DecodedToken | null {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as DecodedToken;
      return decoded;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Check if a token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.verifyToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  /**
   * Generate a hash for storing tokens in database
   */
  hashToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  /**
   * Compare a plain token with a hashed token
   */
  compareTokens(plainToken: string, hashedToken: string): boolean {
    const hashedPlainToken = this.hashToken(plainToken);
    return hashedPlainToken === hashedToken;
  }

  /**
   * Generate a temporary password for social auth users
   */
  generateTempPassword(): string {
    return crypto.randomBytes(16).toString('hex');
  }
}

export const tokenUtils = new TokenUtils();