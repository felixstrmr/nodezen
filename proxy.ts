import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { PUBLIC_ROUTES } from "@/lib/constants";
import type { Database } from "@/types/supabase";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          response = NextResponse.next({
            request,
          });
          for (const { name, value, ...options } of cookiesToSet) {
            response.cookies.set(name, value, {
              expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
              ...options,
            });
          }
        },
      },
    }
  );

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!(user || PUBLIC_ROUTES.includes(request.nextUrl.pathname))) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.well-known/workflow/).*)",
    },
  ],
};
