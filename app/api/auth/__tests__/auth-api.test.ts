import { POST as login } from "./../login+api";
import { POST as logout } from "./../logout+api";
import { POST as refresh } from "./../refresh+api";

describe("auth API routes", () => {
  it("supports the complete login, refresh, and logout lifecycle", async () => {
    const loginResponse = await login(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: "demo@example.com",
          password: "demo-password",
        }),
      }),
    );
    expect(loginResponse.status).toBe(200);
    const loginBody = (await loginResponse.json()) as {
      data: { accessToken: string; refreshToken: string };
    };

    const refreshResponse = await refresh(
      new Request("http://localhost/api/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken: loginBody.data.refreshToken }),
      }),
    );
    expect(refreshResponse.status).toBe(200);
    const refreshBody = (await refreshResponse.json()) as {
      data: { refreshToken: string };
    };

    await expect(
      refresh(
        new Request("http://localhost/api/auth/refresh", {
          method: "POST",
          body: JSON.stringify({ refreshToken: loginBody.data.refreshToken }),
        }),
      ),
    ).resolves.toMatchObject({ status: 401 });

    const logoutResponse = await logout(
      new Request("http://localhost/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({ refreshToken: refreshBody.data.refreshToken }),
      }),
    );
    expect(logoutResponse.status).toBe(200);
  });

  it("maps malformed JSON and invalid credentials to client/auth errors", async () => {
    const malformed = await login(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: "{",
      }),
    );
    expect(malformed.status).toBe(400);

    const invalid = await login(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "wrong", password: "wrong" }),
      }),
    );
    expect(invalid.status).toBe(401);
    await expect(invalid.json()).resolves.toMatchObject({
      error: { code: "INVALID_CREDENTIALS" },
    });
  });
});
