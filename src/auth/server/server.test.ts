import {
  AuthConfigurationError,
  AuthService,
  InMemoryRefreshSessionRegistry,
  JwtTokenService,
  authenticateBearerToken,
  loadAuthConfig,
  parseBearerToken,
} from "./index";

const config = loadAuthConfig({
  environment: "test",
  jwtSecret: "unit-test-secret",
  accessTokenTtlSeconds: 60,
  refreshTokenTtlSeconds: 120,
});

describe("JWT auth server foundation", () => {
  it("requires an explicit signing secret in production", () => {
    expect(() =>
      loadAuthConfig({ environment: "production", env: {} }),
    ).toThrow(AuthConfigurationError);
  });

  it("signs and verifies typed access tokens", async () => {
    const now = Date.now();
    const service = new JwtTokenService(config, {
      now: () => now,
      createTokenId: () => "access-id",
    });

    const signed = await service.signAccessToken("demo-user");
    expect(signed.claims).toMatchObject({
      sub: "demo-user",
      jti: "access-id",
      iat: Math.floor(now / 1000),
      exp: Math.floor(now / 1000) + 60,
      type: "access",
    });
    await expect(
      service.verifyToken(signed.token, "access", "demo-user"),
    ).resolves.toMatchObject(signed.claims);
    await expect(service.verifyToken(signed.token, "refresh")).rejects.toThrow();
    await expect(
      service.verifyToken(signed.token, "access", "other-user"),
    ).rejects.toThrow();
  });

  it("rejects expired and incorrectly signed tokens", async () => {
    const expiredService = new JwtTokenService(
      loadAuthConfig({
        environment: "test",
        jwtSecret: "unit-test-secret",
        accessTokenTtlSeconds: 1,
        refreshTokenTtlSeconds: 1,
      }),
      { now: () => 0 },
    );
    const expired = await expiredService.signAccessToken("demo-user");
    await expect(
      expiredService.verifyToken(expired.token, "access"),
    ).rejects.toThrow();

    const otherService = new JwtTokenService(
      loadAuthConfig({ environment: "test", jwtSecret: "other-secret" }),
    );
    await expect(
      otherService.verifyToken(expired.token, "access"),
    ).rejects.toThrow();
  });

  it("rotates refresh sessions and rejects reuse", async () => {
    const now = Date.now();
    const service = new AuthService({
      config,
      now: () => now,
      tokenServiceOptions: {
        now: () => now,
        createTokenId: (() => {
          let id = 0;
          return () => `token-${++id}`;
        })(),
      },
    });

    const login = await service.login({
      username: config.demoUser.username,
      password: config.demoUser.password,
    });
    expect(login.ok).toBe(true);
    if (!login.ok) return;

    const refresh = await service.refresh({
      refreshToken: login.data.refreshToken,
    });
    expect(refresh.ok).toBe(true);
    expect((await service.refresh({ refreshToken: login.data.refreshToken })).ok).toBe(
      false,
    );
  });

  it("returns non-sensitive errors for malformed and invalid credentials", async () => {
    const service = new AuthService({ config });
    await expect(service.login({ username: config.demoUser.username })).resolves.toMatchObject({
      ok: false,
      status: 400,
      error: { code: "INVALID_REQUEST" },
    });
    await expect(
      service.login({ username: config.demoUser.username, password: "wrong" }),
    ).resolves.toMatchObject({
      ok: false,
      status: 401,
      error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" },
    });
    await expect(service.refresh({ refreshToken: "not-a-token" })).resolves.toMatchObject({
      ok: false,
      status: 401,
      error: { code: "INVALID_REFRESH_TOKEN" },
    });
  });

  it("keeps logout idempotent and protects requests with bearer tokens", async () => {
    const service = new AuthService({ config });
    const login = await service.login({
      username: config.demoUser.username,
      password: config.demoUser.password,
    });
    if (!login.ok) throw new Error("login should succeed");

    expect(parseBearerToken(undefined)).toMatchObject({
      ok: false,
      error: "MISSING_AUTHORIZATION",
    });
    expect(parseBearerToken("Basic token")).toMatchObject({
      ok: false,
      error: "MALFORMED_AUTHORIZATION",
    });

    await expect(
      authenticateBearerToken(
        `Bearer ${login.data.accessToken}`,
        service.tokenService,
        config.demoUser.id,
      ),
    ).resolves.toMatchObject({ ok: true, principal: { userId: "demo-user" } });
    await expect(
      authenticateBearerToken("Bearer invalid", service.tokenService),
    ).resolves.toMatchObject({ ok: false, status: 401 });

    await expect(service.logout()).resolves.toMatchObject({
      ok: true,
      data: { loggedOut: true },
    });
    await expect(
      service.logout({ refreshToken: login.data.refreshToken }),
    ).resolves.toMatchObject({ ok: true });
  });

  it("does not share refresh state between registries", () => {
    const first = new InMemoryRefreshSessionRegistry();
    const second = new InMemoryRefreshSessionRegistry();
    first.register({
      jti: "session",
      userId: "demo-user",
      issuedAt: 0,
      expiresAt: Date.now() + 1_000,
    });
    expect(first.isActive("session", "demo-user")).toBe(true);
    expect(second.isActive("session", "demo-user")).toBe(false);
  });
});
