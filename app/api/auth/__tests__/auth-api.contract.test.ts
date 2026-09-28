import {
  createAuthApiClient,
  type AuthApiClient,
} from "../../../../src/auth/client";
import type { AuthStorage } from "../../../../src/auth/client/storage";
import {
  authenticateBearerToken,
  createAuthConfig,
  createTokenService,
} from "../../../../src/auth/server";

const baseUrl = process.env.AUTH_API_URL;
const contractTest = baseUrl ? it : it.skip;

type NodeHttpResponse = {
  statusCode?: number;
  on(event: "data" | "end", listener: (chunk?: unknown) => void): void;
};

type NodeHttp = {
  request(
    options: {
      method: string;
      hostname: string;
      port: string;
      path: string;
      headers: Record<string, string>;
    },
    callback: (response: NodeHttpResponse) => void,
  ): {
    on(event: "error", listener: (error: unknown) => void): void;
    end(body?: string): void;
  };
};

function nodeHttp(): NodeHttp {
  const getBuiltinModule = (
    process as unknown as {
      getBuiltinModule?: (name: string) => unknown;
    }
  ).getBuiltinModule;
  if (!getBuiltinModule) {
    throw new Error("Node built-in module loader is unavailable");
  }
  return getBuiltinModule("node:http") as NodeHttp;
}

async function requestJson(
  urlValue: string,
  body: unknown,
): Promise<{ status: number; body: string }> {
  const url = new URL(urlValue);
  return new Promise((resolve, reject) => {
    const request = nodeHttp().request(
      {
        method: "POST",
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        headers: {
          "Content-Type": "application/json",
        },
      },
      (response) => {
        const chunks: string[] = [];
        response.on("data", (chunk) => chunks.push(String(chunk ?? "")));
        response.on("end", () =>
          resolve({
            status: response.statusCode ?? 500,
            body: chunks.join(""),
          }),
        );
      },
    );
    request.on("error", reject);
    request.end(JSON.stringify(body));
  });
}

function makeStorage(): AuthStorage {
  const values = new Map<string, string>();
  return {
    get: async (key) => values.get(key) ?? null,
    set: async (key, value) => {
      values.set(key, value);
    },
    delete: async (key) => {
      values.delete(key);
    },
  };
}

describe("Docker auth API contract", () => {
  contractTest(
    "completes login, access authorization, refresh rotation, and logout",
    async () => {
      const storage = makeStorage();
      const client: AuthApiClient = createAuthApiClient({
        apiUrl: baseUrl,
        storage,
        fetch: async (input, init) => {
          const result = await requestJson(
            String(input),
            JSON.parse(String(init?.body)),
          );
          return {
            ok: result.status >= 200 && result.status < 300,
            status: result.status,
            text: async () => result.body,
          } as Response;
        },
      });

      const session = await client.login({
        username: "demo@example.com",
        password: "demo-password",
      });
      expect(session.tokenType).toBe("Bearer");

      const config = createAuthConfig({
        jwtSecret: "local-development-secret",
      });
      const tokenService = createTokenService(config);
      await expect(
        authenticateBearerToken(
          `Bearer ${session.accessToken}`,
          tokenService,
          "demo-user",
        ),
      ).resolves.toMatchObject({
        ok: true,
        principal: { userId: "demo-user" },
      });

      const rotated = await client.refresh();
      expect(rotated.refreshToken).not.toBe(session.refreshToken);

      const response = await requestJson(`${baseUrl}/api/auth/refresh`, {
        refreshToken: session.refreshToken,
      });
      expect(response.status).toBe(401);

      await client.logout();
      const revokedResponse = await requestJson(`${baseUrl}/api/auth/refresh`, {
        refreshToken: rotated.refreshToken,
      });
      expect(revokedResponse.status).toBe(401);
    },
    30_000,
  );
});
