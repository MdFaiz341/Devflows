import { NextRequest, NextResponse } from "next/server";



export function middleware(req:NextRequest){

    console.log("middleware dashboard--");

    const token = req.cookies.get("accessToken")?.value;

    const path = req.nextUrl.pathname;

    const isAuthPage = path === "/signin" || path === "/signup"

    const isProtectedRoute  = path.startsWith("/dashboard");

    if(!token && isProtectedRoute){
        return NextResponse.redirect(new URL("/signin", req.url));
    };

    if(token && isAuthPage){
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};