import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from "../index.js";
import { NewUser, users, refreshTokens } from "../schema.js";

export async function createUser(user: NewUser): Promise<Omit<NewUser, "hashedPassword">> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return {
    id: result.id,
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
    email: result.email,
  };
}

export async function deleteUsers() {
  const [result] = await db.delete(users)
  return result;
}

export async function getUserByEmail(email: string): Promise<NewUser | undefined> {
  const [result] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  return result;
}

export async function getUserFromRefreshToken(token: string): Promise<Pick<NewUser, 'id' | 'email'> | undefined> {
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
  return result;
}