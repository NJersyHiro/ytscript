import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure the email transporter
    // For development, use ethereal email or mailtrap
    // For production, use actual SMTP service (Gmail, SendGrid, etc.)
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'ethereal.user',
        pass: process.env.SMTP_PASS || 'ethereal.pass'
      }
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || '"YTScript" <noreply@ytscript.com>',
        to: options.to,
        subject: options.subject,
        html: options.html
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: %s', info.messageId);
      
      // Preview URL for ethereal email (development only)
      if (process.env.NODE_ENV === 'development') {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password for your YTScript account. If you didn't make this request, you can safely ignore this email.</p>
              <p>To reset your password, click the button below:</p>
              <center>
                <a href="${resetUrl}" class="button">Reset Password</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">${resetUrl}</p>
              <p><strong>This link will expire in 24 hours for security reasons.</strong></p>
              <p>If you're having trouble, please contact our support team.</p>
            </div>
            <div class="footer">
              <p>© 2024 YTScript. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset Request - YTScript',
      html
    });
  }

  async sendEmailVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; padding: 12px 24px; background: linear-gradient(to right, #3b82f6, #8b5cf6); color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
            .features { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .feature { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to YTScript!</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for signing up for YTScript! We're excited to have you on board.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <center>
                <a href="${verifyUrl}" class="button">Verify Email Address</a>
              </center>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px;">${verifyUrl}</p>
              
              <div class="features">
                <h3>What you can do with YTScript:</h3>
                <div class="feature">✅ Extract transcripts from YouTube videos</div>
                <div class="feature">✅ Export in multiple formats (TXT, SRT, JSON)</div>
                <div class="feature">✅ Get AI-powered summaries (Pro)</div>
                <div class="feature">✅ Process entire channels and playlists (Pro)</div>
              </div>
              
              <p><strong>This link will expire in 7 days.</strong></p>
              <p>If you didn't create an account with YTScript, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>© 2024 YTScript. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Verify Your Email - YTScript',
      html
    });
  }

  async sendPasswordResetSuccessEmail(email: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #10b981, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Successful</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Your password has been successfully reset. You can now log in to your YTScript account with your new password.</p>
              <p>If you didn't make this change, please contact our support team immediately.</p>
              <p>For security reasons, we recommend:</p>
              <ul>
                <li>Using a strong, unique password</li>
                <li>Enabling two-factor authentication when available</li>
                <li>Not sharing your password with anyone</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 YTScript. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Password Reset Successful - YTScript',
      html
    });
  }
}

export const emailService = new EmailService();