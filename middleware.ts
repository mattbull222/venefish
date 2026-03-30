import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the session cookie (Firebase sets this if you use session cookies)
  // Or, more commonly with ReactFire/Firebase Client, we protect the layout.
  // However, for a quick, robust redirect:
  const session = request.cookies.get('__session'); // Default Firebase session cookie name

  if (request.nextUrl.pathname.startsWith('/app')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};