import { and, eq, isNull, sql } from 'drizzle-orm';
import { db } from '../index.js';
import { refreshTokens } from '../schema.js';
import type { NewRefreshToken } from '../schema.js';

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .returning();
  
  if (!result) throw new Error("Failed to create refresh token");

  return result;
}

export async function revokeRefreshToken(token: string) {
  const rows = await db
    .update(refreshTokens)
    .set({
      revokedAt: sql`now()`,
      updatedAt: sql`now()`,
    })
    .where(
      and(
        eq(refreshTokens.token, token),
        isNull(refreshTokens.revokedAt)
      )
    )
    .returning({ token: refreshTokens.token });
  return rows.length > 0;
}