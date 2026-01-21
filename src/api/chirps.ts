import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { BadRequestError, NotFoundError, UnauthorizedError } from './errors.js';
import { createChirp, getChirps, getOneChirp } from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from '../auth.js';
import { config } from '../config.js';

export async function handlerChirps(req: Request, res: Response) {
  type RequestBody = {
    body: string;
  };
  
  const userId = validateJWT(getBearerToken(req), config.api.jwtSecret);

  const parsedBody = req.body as Partial<RequestBody>;

  if (!parsedBody || typeof parsedBody !== 'object') {
    throw new BadRequestError('Invalid request');
  }

  if (typeof parsedBody.body !== 'string' || parsedBody.body.trim().length === 0) {
    throw new BadRequestError('Invalid chirp');
  }

  const chirpContent = parsedBody.body; 

  if (chirpContent.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const profane = ['kerfuffle', 'sharbert', 'fornax'];

  const words = chirpContent.split(/\s+/).filter(Boolean);

  const cleanedWords = words.map((word) => {
    // remove trailing punctuation for comparison only
    const trailingPunctuationMatch = word.match(/[.,!?;:]+$/);
    const trailingPunctuation = trailingPunctuationMatch?.[0] ?? '';
    const bareWord = trailingPunctuation
      ? word.slice(0, -trailingPunctuation.length)
      : word;

    const isProfane = profane.includes(bareWord.toLowerCase());

    if (isProfane) {
      // keep punctuation if it exists, only replace the word
      return '****' + trailingPunctuation;
    }

    return word;
  });

  const cleanedBody = cleanedWords.join(' ');

  const result = await createChirp({
    body: cleanedBody,
    userId
  });

  if (!result) {
    throw new Error('Failed to save chirp to database');
  }

  return respondWithJSON(res, 201, result);
}

export async function handlerGetChirps(_: Request, res: Response) {
  const result = await getChirps();

  if (!result) {
    throw new Error('Failed to get chirps from database');
  }

  return respondWithJSON(res, 200, result);
}

export async function handlerGetOneChirp(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    throw new BadRequestError('Invalid chirp ID');
  }

  const result = await getOneChirp(id);

  if (!result) {
    throw new NotFoundError('Chirp not found');
  }

  return respondWithJSON(res, 200, result);
}