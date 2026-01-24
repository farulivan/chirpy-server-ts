import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../connection.js';
import { refreshTokens } from '../schema.js';

type CreateTokenData = {
  token: string;
  userId: string;
  expiresAt: Date;
};

export async function create(data: CreateTokenData) {
  const [result] = await db.insert(refreshTokens).values(data).returning();

  if (!result) {
    throw new Error('Failed to create refresh token');
  }

  return result;
}

export async function revoke(token: string): Promise<boolean> {
  const rows = await db
    .update(refreshTokens)
    .set({
      revokedAt: sql`now()`,
      updatedAt: sql`now()`,
    })
    .where(and(eq(refreshTokens.token, token), isNull(refreshTokens.revokedAt)))
    .returning({ token: refreshTokens.token });

  return rows.length > 0;
}
