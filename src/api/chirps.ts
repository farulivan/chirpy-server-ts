import type { Request, Response } from 'express';
import { respondWithJSON } from './json.js';
import { BadRequestError } from './errors.js';

export async function handlerChirpsValidate(req: Request, res: Response) {
  type RequestBody = {
    body: string;
  };

  const parsedBody = req.body as RequestBody;

  if (!parsedBody || typeof parsedBody.body !== 'string') {
    // return respondWithError(res, 400, 'Invalid request body structure');
    throw new Error('Invalid request body structure')
  }

  const chirpContent = parsedBody.body;

  if (chirpContent.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const profane = ['kerfuffle', 'sharbert', 'fornax'];

  const words = chirpContent.split(' ');

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

  return respondWithJSON(res, 200, { cleanedBody });
}