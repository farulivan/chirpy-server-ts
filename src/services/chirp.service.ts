import type { Chirp, CreateChirpInput, SortOrder } from '../domain/entities/chirp.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../shared/errors/http-error.js';
import { CHIRP_MAX_LENGTH } from '../shared/constants.js';
import { contentFilterService } from './content-filter.service.js';
import * as chirpRepository from '../infrastructure/database/repositories/chirp.repository.js';

export class ChirpService {
  async createChirp(userId: string, input: CreateChirpInput): Promise<Chirp> {
    const { body } = input;

    if (!body || body.trim().length === 0) {
      throw new BadRequestError('Chirp body is required');
    }

    if (body.length > CHIRP_MAX_LENGTH) {
      throw new BadRequestError(`Chirp is too long. Max length is ${CHIRP_MAX_LENGTH}`);
    }

    const filteredBody = contentFilterService.filterProfanity(body);

    const chirp = await chirpRepository.create({
      body: filteredBody,
      userId,
    });

    return chirp;
  }

  async getChirps(authorId?: string, sort: SortOrder = 'asc'): Promise<Chirp[]> {
    if (authorId) {
      return chirpRepository.findByAuthorId(authorId, sort);
    }
    return chirpRepository.findAll(sort);
  }

  async getChirpById(id: string): Promise<Chirp> {
    const chirp = await chirpRepository.findById(id);

    if (!chirp) {
      throw new NotFoundError('Chirp not found');
    }

    return chirp;
  }

  async deleteChirp(chirpId: string, userId: string): Promise<void> {
    const chirp = await chirpRepository.findById(chirpId);

    if (!chirp) {
      throw new NotFoundError('Chirp not found');
    }

    if (chirp.userId !== userId) {
      throw new ForbiddenError('You are not allowed to delete this chirp');
    }

    await chirpRepository.deleteById(chirpId);
  }
}

export const chirpService = new ChirpService();
