import { eq } from "drizzle-orm";
import { db } from '../index.js';
import { chirps, NewChirp } from '../schema.js';

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getChirps() {
  const result = await db
    .select()
    .from(chirps)
    .orderBy(chirps.createdAt);
  return result;
}

export async function getOneChirp(id: string) {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id));
  return result;
}

export async function deleteChirp(id: string) {
  await db
    .delete(chirps)
    .where(eq(chirps.id, id))
}