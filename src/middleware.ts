import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Array of public routes that don't require authentication
  publicRoutes: [
    "/",
    "/login",
    "/signup",
    "/api/auth/login",
    "/api/auth/signup",
    "/api(.*)"
  ],
  
  // Array of routes to be ignored by the authentication middleware
  ignoredRoutes: [],
  afterAuth(auth, req) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const signInUrl = new URL('/sign-in', req.url)
      signInUrl.searchParams.set('redirect_url', req.url)
      return Response.redirect(signInUrl)
    }

    // Redirect logged-in users from public pages to dashboard
    if (auth.userId && auth.isPublicRoute && req.nextUrl.pathname === '/') {
      const dashboard = new URL('/dashboard', req.url)
      return Response.redirect(dashboard)
    }
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}; 