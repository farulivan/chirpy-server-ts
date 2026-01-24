import { asc, desc, eq } from 'drizzle-orm';
import { db } from '../connection.js';
import { chirps } from '../schema.js';
import type { Chirp, SortOrder } from '../../../domain/entities/chirp.js';

type CreateChirpData = {
  body: string;
  userId: string;
};

export async function create(data: CreateChirpData): Promise<Chirp> {
  const [result] = await db
    .insert(chirps)
    .values(data)
    .returning();
  
  if (!result) {
    throw new Error('Failed to create chirp');
  }

  return result as Chirp;
}

export async function findAll(sort: SortOrder = 'asc'): Promise<Chirp[]> {
  const sortFn = sort === 'desc' ? desc : asc;
  return db
    .select()
    .from(chirps)
    .orderBy(sortFn(chirps.createdAt)) as Promise<Chirp[]>;
}

export async function findByAuthorId(authorId: string, sort: SortOrder = 'asc'): Promise<Chirp[]> {
  const sortFn = sort === 'desc' ? desc : asc;
  return db
    .select()
    .from(chirps)
    .where(eq(chirps.userId, authorId))
    .orderBy(sortFn(chirps.createdAt)) as Promise<Chirp[]>;
}

export async function findById(id: string): Promise<Chirp | null> {
  const [result] = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id));
  
  return (result as Chirp) ?? null;
}

export async function deleteById(id: string): Promise<void> {
  await db.delete(chirps).where(eq(chirps.id, id));
}
