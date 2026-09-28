import {
  invalidRequestResponse,
  jsonResult,
  methodNotAllowed,
  readJson,
} from "../../../src/auth/server/route-response";
import { authService } from "../../../src/auth/server/runtime";

export async function POST(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return methodNotAllowed();
  }

  const body = await readJson(request);
  if (!body.ok) {
    return invalidRequestResponse();
  }

  return jsonResult(await authService.refresh(body.value));
}
