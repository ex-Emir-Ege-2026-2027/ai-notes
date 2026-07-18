import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  return handleAuth(request);
}

async function handleAuth(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Auth sayfaları — giriş yapmışsa dashboard'a yönlendir
  const isAuthRoute = pathname.startsWith("/login");
  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  // Korumalı rotalar — giriş yapmamışsa login'e yönlendir
  const isProtectedRoute =
    pathname.startsWith("/notes") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/profile");

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/login", "/notes/:path*", "/categories/:path*", "/upload/:path*", "/profile/:path*"],
};
