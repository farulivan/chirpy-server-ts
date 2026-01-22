import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { db } from "../index.js";
import { NewUser, users, refreshTokens } from "../schema.js";

export type UserResponse = Omit<NewUser, "hashedPassword">

export async function createUser(user: NewUser): Promise<UserResponse> {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();

  if (!result) {
    throw new Error("User already exists or could not be created");
  }
  
  return omitPassword(result);
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

export async function updateUser(userId: string, newEmail: string, newPasswordHash: string): Promise<UserResponse> {
  const [result] = await db
    .update(users)
    .set({
      email: newEmail,
      hashedPassword: newPasswordHash,
    })
    .where(eq(users.id, userId))
    .returning();
  
  if (!result) {
    throw new Error("User not found");
  }

  return omitPassword(result);
}

export async function upgradeUserChirpyRed(userId: string): Promise<boolean> {
  const [updated] = await db
    .update(users)
    .set({ isChirpyRed: true })
    .where(eq(users.id, userId))
    .returning({ id: users.id }); 

  return !!updated;
}

// Helper function
function omitPassword(user: NewUser): UserResponse {
  const { hashedPassword, ...userWithoutPassword } = user;
  return userWithoutPassword;
}