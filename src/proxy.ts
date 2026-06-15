import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic in-memory rate limiting map (per Vercel isolate)
// Key: IP address + route, Value: { count, resetTime }
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function proxy(request: NextRequest) {
  // Get IP address safely
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  
  const isOrderRoute = request.nextUrl.pathname.startsWith('/api/v1/orders');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/api/v1/auth'); // If auth endpoints exist here
  
  // Only limit POST requests (form submissions, logins)
  if (request.method === 'POST' && (isOrderRoute || isAuthRoute)) {
    const routeType = isOrderRoute ? 'order' : 'auth';
    const key = `${ip}-${routeType}`;
    
    // Limits: 
    // Auth -> 5 requests per 5 minutes
    // Orders -> 10 requests per 5 minutes
    const maxRequests = isAuthRoute ? 5 : 10;
    const windowMs = 5 * 60 * 1000; // 5 minutes
    
    const now = Date.now();
    const record = rateLimitMap.get(key);
    
    if (record) {
      if (now > record.resetTime) {
        // Time window expired, reset counter
        rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      } else {
        if (record.count >= maxRequests) {
          // Rate limited!
          return NextResponse.json(
            { success: false, message: 'Too many requests. Please try again later.' },
            { 
              status: 429,
              headers: {
                'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString()
              }
            }
          );
        }
        // Increment counter
        record.count++;
      }
    } else {
      // First request
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    }
  }

  // Basic cleanup mechanism: ~1% chance on each request to clear old records
  // Prevents the Map from growing indefinitely in long-running Vercel Edge isolates.
  if (Math.random() < 0.01) {
    const now = Date.now();
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) {
        rateLimitMap.delete(k);
      }
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Apply middleware to API routes
    '/api/v1/orders/:path*',
    '/api/v1/auth/:path*',
  ],
};
