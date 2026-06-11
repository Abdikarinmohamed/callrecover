import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database";

import { getSupabasePublicConfig } from "./public-env";

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });
  let refreshedCookies: Parameters<SetAllCookies>[0] = [];
  let cookieHeaders: Record<string, string> = {};

  const { supabaseUrl, supabasePublishableKey } = getSupabasePublicConfig();

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          refreshedCookies = cookiesToSet;
          cookieHeaders = headers;

          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtectedAppRoute =
    pathname === "/dashboard" ||
    pathname === "/settings" ||
    pathname.startsWith("/leads/");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  if (!user && isProtectedAppRoute) {
    return withSupabaseCookies(
      NextResponse.redirect(new URL("/login", request.url)),
      refreshedCookies,
      cookieHeaders,
    );
  }

  if (user && isAuthRoute) {
    return withSupabaseCookies(
      NextResponse.redirect(new URL("/dashboard", request.url)),
      refreshedCookies,
      cookieHeaders,
    );
  }

  return response;
}

function withSupabaseCookies(
  response: NextResponse,
  cookiesToSet: Parameters<SetAllCookies>[0],
  headers: Record<string, string>,
) {
  cookiesToSet.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options);
  });

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}
