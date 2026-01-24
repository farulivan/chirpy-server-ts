import type { Request, Response } from 'express';
import { chirpService } from '../../services/chirp.service.js';
import { BadRequestError } from '../../shared/errors/http-error.js';
import type { SortOrder } from '../../domain/entities/chirp.js';

export async function createChirp(req: Request, res: Response): Promise<void> {
  const userId = req.userId;
  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  const { body } = req.body as { body?: string };

  if (typeof body !== 'string') {
    throw new BadRequestError('Chirp body is required');
  }

  const chirp = await chirpService.createChirp(userId, { body });
  res.status(201).json(chirp);
}

export async function getChirps(req: Request, res: Response): Promise<void> {
  const authorId = typeof req.query.author_id === 'string' ? req.query.author_id : undefined;
  const sort = parseSortOrder(req.query.sort);

  const chirps = await chirpService.getChirps(authorId, sort);
  res.status(200).json(chirps);
}

export async function getChirpById(req: Request, res: Response): Promise<void> {
  const id = req.params.id;

  if (typeof id !== 'string' || !id) {
    throw new BadRequestError('Chirp ID is required');
  }

  const chirp = await chirpService.getChirpById(id);
  res.status(200).json(chirp);
}

export async function deleteChirp(req: Request, res: Response): Promise<void> {
  const id = req.params.id;
  const userId = req.userId;

  if (typeof id !== 'string' || !id) {
    throw new BadRequestError('Chirp ID is required');
  }

  if (!userId) {
    throw new BadRequestError('User ID is required');
  }

  await chirpService.deleteChirp(id, userId);
  res.status(204).send();
}

function parseSortOrder(value: unknown): SortOrder {
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'asc' || lower === 'desc') {
      return lower;
    }
  }
  return 'asc';
}
