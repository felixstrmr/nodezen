import type { NextRequest } from "next/server";
import { supabaseMiddleware } from "@/lib/clients/supabase-middleware";

export async function proxy(request: NextRequest) {
  return await supabaseMiddleware(request);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
