import type { Credentials, DemoUser } from "./types";

export interface UserRepository {
  findByUsername(username: string): DemoUser | undefined;
}

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly user: DemoUser) {}

  findByUsername(username: string): DemoUser | undefined {
    return this.user.username === username ? this.user : undefined;
  }

  verifyCredentials(credentials: Credentials): DemoUser | undefined {
    const user = this.findByUsername(credentials.username);
    return user && user.password === credentials.password ? user : undefined;
  }
}

export const FakeUserRepository = InMemoryUserRepository;
