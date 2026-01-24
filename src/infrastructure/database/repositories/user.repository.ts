import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from '../connection.js';
import { users, refreshTokens } from '../schema.js';
import type { User, UserPublic } from '../../../domain/entities/user.js';

type CreateUserData = {
  email: string;
  hashedPassword: string;
};

type UpdateUserData = {
  email: string;
  hashedPassword: string;
};

export async function create(data: CreateUserData): Promise<User | null> {
  const [result] = await db
    .insert(users)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return (result as User) ?? null;
}

export async function findByEmail(email: string): Promise<User | null> {
  const [result] = await db.select().from(users).where(eq(users.email, email));
  return (result as User) ?? null;
}

export async function findById(id: string): Promise<User | null> {
  const [result] = await db.select().from(users).where(eq(users.id, id));
  return (result as User) ?? null;
}

export async function findByRefreshToken(
  token: string
): Promise<Pick<User, 'id' | 'email'> | null> {
  const [result] = await db
    .select({
      id: users.id,
      email: users.email,
    })
    .from(refreshTokens)
    .innerJoin(users, eq(refreshTokens.userId, users.id))
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt),
        gt(refreshTokens.expiresAt, sql`now()`)
      )
    )
    .limit(1);

  return result ?? null;
}

export async function update(
  userId: string,
  data: UpdateUserData
): Promise<User | null> {
  const [result] = await db
    .update(users)
    .set({
      email: data.email,
      hashedPassword: data.hashedPassword,
    })
    .where(eq(users.id, userId))
    .returning();

  return (result as User) ?? null;
}

export async function upgradeToChirpyRed(userId: string): Promise<boolean> {
  const [updated] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning({ id: users.id });

  return !!updated;
}

export async function deleteAll(): Promise<void> {
  await db.delete(users);
}

export function toPublic(user: User): UserPublic {
  return {
    id: user.id,
    email: user.email,
    isChirpyRed: user.isChirpyRed,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
