import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { BadRequestError } from './errors.js';
import { createChirp } from '../db/queries/chirps.js';

export async function handlerChirps(req: Request, res: Response) {
  type RequestBody = {
    body: string;
    userId: string;
  };

  const parsedBody = req.body as Partial<RequestBody>;

  if (!parsedBody || typeof parsedBody !== 'object') {
    throw new BadRequestError('Invalid request');
  }

  if (typeof parsedBody.body !== 'string' || parsedBody.body.trim().length === 0) {
    throw new BadRequestError('Invalid chirp');
  }

  if (typeof parsedBody.userId !== 'string' || parsedBody.userId.trim().length === 0) {
    throw new BadRequestError('Invalid user id');
  }

  const chirpContent = parsedBody.body; 
  const userId = parsedBody.userId; 

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