import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const apiGatewayUrl =
    process.env["NEXT_PUBLIC_API_GATEWAY_URL"] || "";

  let apiOrigin = "";
  try {
    apiOrigin = new URL(apiGatewayUrl).origin;
  } catch {
    apiOrigin = "";
  }

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://accounts.google.com;
    style-src 'self' 'unsafe-inline' https://accounts.google.com;
    img-src 'self' data: blob: ${apiOrigin} https://www.google-analytics.com https://www.googletagmanager.com https://www.clarity.ms https://*.googleusercontent.com;
    connect-src 'self' ${apiOrigin} https://www.google-analytics.com https://analytics.google.com https://*.googletagmanager.com https://*.clarity.ms https://accounts.google.com;
    font-src 'self' data:;
    frame-src 'self' https://accounts.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, ' ')
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', cspHeader);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf)$).*)',
  ],
};