import authConfig from "./auth.config"

import NextAuth from "next-auth"

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - images (static images from public directory)
   * - login (login page)
   * Also do not match home path
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|login|$).*)"],
}

export const { auth: middleware } = NextAuth(authConfig)
