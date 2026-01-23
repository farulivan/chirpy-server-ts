import { asc, desc, eq } from "drizzle-orm";
import { db } from '../index.js';
import { chirps, NewChirp } from '../schema.js';
import type { SortOrder } from '../../api/chirps.js';

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .returning();
  return result;
}

export async function getChirps(sort: "asc" | "desc") {
  const sorting = getSortDirection(sort)
  const result = await db
    .select()
    .from(chirps)
    .orderBy(sorting(chirps.createdAt));
  return result;
}

export function getChirpsByAuthorId(
  authorId: string,
  sort: "asc" | "desc",
) {
  const sorting = getSortDirection(sort)
  return db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(sorting(chirps.createdAt));
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

// Helper function
function getSortDirection(sort: SortOrder) {
  return sort === "desc" ? desc : asc;
}