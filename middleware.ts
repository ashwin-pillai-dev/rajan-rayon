import { auth } from "@/auth"
export default auth((req) => {    
    if (!req.auth && req.nextUrl.pathname !== "/login") {  
      const newUrl = new URL("/login", req.nextUrl.origin,)
      newUrl.searchParams.append('callbackUrl',req.nextUrl.href );
      return Response.redirect(newUrl)
    }
  })
export const config = {
    matcher: ['/admin/:path*'],
  }