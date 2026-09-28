export interface RefreshSession {
  jti: string;
  userId: string;
  issuedAt: number;
  expiresAt: number;
  revokedAt?: number;
}

export interface RefreshSessionRegistry {
  register(session: RefreshSession): void;
  consume(jti: string, userId: string, now?: number): boolean;
  revoke(jti: string, now?: number): void;
  isActive(jti: string, userId?: string, now?: number): boolean;
  clear(): void;
}

export class InMemoryRefreshSessionRegistry implements RefreshSessionRegistry {
  private readonly sessions = new Map<string, RefreshSession>();

  register(session: RefreshSession): void {
    this.sessions.set(session.jti, { ...session });
  }

  consume(jti: string, userId: string, now = Date.now()): boolean {
    const session = this.sessions.get(jti);
    if (
      !session ||
      session.userId !== userId ||
      session.revokedAt !== undefined ||
      now >= session.expiresAt
    ) {
      return false;
    }

    session.revokedAt = now;
    return true;
  }

  revoke(jti: string, now = Date.now()): void {
    const session = this.sessions.get(jti);
    if (session && session.revokedAt === undefined) {
      session.revokedAt = now;
    }
  }

  isActive(jti: string, userId?: string, now = Date.now()): boolean {
    const session = this.sessions.get(jti);
    return Boolean(
      session &&
        session.revokedAt === undefined &&
        now < session.expiresAt &&
        (userId === undefined || session.userId === userId),
    );
  }

  clear(): void {
    this.sessions.clear();
  }
}

export const RefreshSessionStore = InMemoryRefreshSessionRegistry;
