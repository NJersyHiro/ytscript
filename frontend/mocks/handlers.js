// MSW (Mock Service Worker) handlers
// This file simulates backend API responses during development

import { http, HttpResponse } from 'msw';

// Mock user database (in-memory)
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    password: 'demo123', // In real app, this would be hashed
    name: 'Demo User',
    plan: 'free',
    createdAt: new Date().toISOString(),
    emailVerified: true,
  }
];

let currentUser = null;

export const handlers = [
  // Login endpoint
  http.post('http://localhost:5000/api/auth/login', async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return HttpResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    currentUser = user;
    const token = 'mock-jwt-token-' + user.id;
    
    return HttpResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        createdAt: user.createdAt,
        emailVerified: user.emailVerified,
      },
      token
    });
  }),

  // Signup endpoint
  http.post('http://localhost:5000/api/auth/register', async ({ request }) => {
    const body = await request.json();
    const { email, password, name } = body;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return HttpResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }
    
    const newUser = {
      id: String(users.length + 1),
      email,
      password,
      name: name || email.split('@')[0],
      plan: 'free',
      createdAt: new Date().toISOString(),
      emailVerified: false,
    };
    
    users.push(newUser);
    currentUser = newUser;
    const token = 'mock-jwt-token-' + newUser.id;
    
    return HttpResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        plan: newUser.plan,
        createdAt: newUser.createdAt,
        emailVerified: newUser.emailVerified,
      },
      token
    });
  }),

  // Get current user
  http.get('http://localhost:5000/api/auth/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !currentUser) {
      return HttpResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    return HttpResponse.json({
      user: currentUser
    });
  }),

  // Logout endpoint
  http.post('http://localhost:5000/api/auth/logout', () => {
    currentUser = null;
    return HttpResponse.json({ success: true });
  }),

  // Extract transcript endpoint (mock)
  http.post('http://localhost:5000/api/extract', async ({ request }) => {
    const body = await request.json();
    const { url, language, formats } = body;
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return HttpResponse.json({
      success: true,
      video_id: 'mock_video_123',
      transcript_text: 'This is a mock transcript. In a real application, this would be the actual YouTube video transcript.',
      metadata: {
        title: 'Mock Video Title',
        channel: 'Mock Channel',
        word_count: 150,
        language: language || 'en',
        duration: 300,
        segment_count: 10,
      },
      formats: {
        txt: 'This is a mock transcript. In a real application, this would be the actual YouTube video transcript.',
        srt: '1\n00:00:00,000 --> 00:00:05,000\nThis is a mock transcript.',
        json: [
          {
            text: 'This is a mock transcript.',
            start: 0,
            duration: 5
          }
        ]
      }
    });
  }),

  // User stats endpoint
  http.get('http://localhost:5000/api/user/stats', () => {
    return HttpResponse.json({
      videosProcessed: 12,
      wordsExtracted: 8500,
      timesSaved: '2 hours',
      accuracy: '99.9%'
    });
  }),
];