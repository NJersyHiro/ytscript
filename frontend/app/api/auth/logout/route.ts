import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear OAuth session cookie
  response.cookies.delete('user');
  
  return response;
}