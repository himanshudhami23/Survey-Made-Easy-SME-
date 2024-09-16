import { authMiddleware } from "@clerk/nextjs";


export default authMiddleware({
  publicRoutes: ["/api/auth/callback/salesforce", "/signin", "/api/auth(.*)",
    "/api/salesforce/create-form-response",
    "/api/salesforce/get-record"
   ],
  ignoredRoutes: ["/api/auth/callback/salesforce", "/api/auth(.*)"],
  
});



export const config = {
    // Protects all routes, including api/trpc.
    // See https://clerk.com/docs/references/nextjs/auth-middleware
    // for more information about configuring your Middleware
    matcher: ["/((?!.+\\.[\\w]+$|_next|submit).*)", "/", "/(api|trpc)(.*)"],    
  };