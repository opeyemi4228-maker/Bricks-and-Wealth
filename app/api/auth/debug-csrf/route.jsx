// app/api/auth/debug-csrf/route.js
// TEMPORARY DEBUG ENDPOINT — delete after fixing the issue.
// Shows exactly what the CSRF check is seeing.

import { env } from "@/lib/env";

export async function GET(request) {
  // Read cookies the way Next.js routes do
  const csrfCookie = request.cookies?.get?.("csrf_token")?.value || null;
  const sessionCookie = request.cookies?.get?.("session_token")?.value || null;

  // Read all headers as object
  const headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return Response.json({
    ok: true,
    diagnostics: {
      sessionSecretSet: !!env.SESSION_SECRET,
      sessionSecretLength: (env.SESSION_SECRET || "").length,
      sessionSecretFirstChars: env.SESSION_SECRET?.slice(0, 8) || "MISSING",
      csrfCookieExists: !!csrfCookie,
      csrfCookiePreview: csrfCookie?.slice(0, 30) + "...",
      csrfCookieFormat: csrfCookie?.includes(".") ? "HAS_DOT (good)" : "NO_DOT (broken)",
      sessionCookieExists: !!sessionCookie,
      xCsrfHeader: headers["x-csrf-token"] || "NOT_SENT",
      xCsrfHeaderPreview: (headers["x-csrf-token"] || "").slice(0, 30) + "...",
      cookiesMatch: csrfCookie === headers["x-csrf-token"] ? "YES" : "NO",
    },
  });
}

export async function POST(request) {
  // Same as GET but accepts POST for testing the cookie + header alignment
  return GET(request);
}