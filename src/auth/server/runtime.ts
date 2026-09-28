import { createAuthService } from "./service";

const AUTH_SERVICE_GLOBAL_KEY = "__cbsdemo_auth_service";
const runtimeGlobal = globalThis as typeof globalThis & {
  [AUTH_SERVICE_GLOBAL_KEY]?: ReturnType<typeof createAuthService>;
};

export const authService =
  runtimeGlobal[AUTH_SERVICE_GLOBAL_KEY] ??
  (runtimeGlobal[AUTH_SERVICE_GLOBAL_KEY] = createAuthService());
