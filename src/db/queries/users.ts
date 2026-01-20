import { eq } from 'drizzle-orm';
import { db } from "../index.js";
import { NewUser, users } from "../schema.js";

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