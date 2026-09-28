import type { HandlerResult } from "./types";

export function jsonResult<T>(result: HandlerResult<T>): Response {
  return Response.json(result, { status: result.status });
}

export function invalidRequestResponse(): Response {
  return Response.json(
    {
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Request body must be valid JSON",
      },
    },
    { status: 400 },
  );
}

export async function readJson(
  request: Request,
): Promise<{ ok: true; value: unknown } | { ok: false }> {
  try {
    const text = await request.text();
    return {
      ok: true,
      value: text.trim() ? (JSON.parse(text) as unknown) : undefined,
    };
  } catch {
    return { ok: false };
  }
}

export function methodNotAllowed(): Response {
  return Response.json(
    {
      ok: false,
      error: {
        code: "METHOD_NOT_ALLOWED",
        message: "Only POST requests are supported",
      },
    },
    { status: 405, headers: { Allow: "POST" } },
  );
}
