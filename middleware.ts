// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   // Define public paths that don't require authentication
//   const isPublicPath =
//     path === "/auth/login" || path === "/auth/register" || path === "/";

//   const isProtectedPath = path.startsWith("/dashboard");

//   // Check if user is authenticated
//   const token = request.cookies.get("auth-token")?.value || "";
//   const user = request.cookies.get("user")?.value || "";

//   // Redirect logic
//   if (isPublicPath && token) {
//     // If user is authenticated and tries to access public path, redirect to dashboard
//     if (isProtectedPath && (!token || !user)) {
//       const url = new URL("/auth/login", request.url);
//       url.searchParams.set("callbackUrl", encodeURI(request.nextUrl.pathname));
//       return NextResponse.redirect(url);
//     }
//   }

//   // If user is authenticated and tries to access public path, redirect to dashboard
//   if (isPublicPath && token && user) {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     // Match all paths except for:
//     // - API routes
//     // - Static files (e.g., favicon.ico)
//     // - Public files
//     "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
//   ],
// };


import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Since we're using client-side authentication with localStorage,
  // we can't check authentication status in middleware.
  // Instead, we'll rely on client-side redirects.
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // Match all paths except for:
    // - API routes
    // - Static files (e.g., favicon.ico)
    // - Public files
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
