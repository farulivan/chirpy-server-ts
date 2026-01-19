import type { Request, Response } from 'express';
import { respondWithError, respondWithJSON } from './json.js';
import { deleteUsers } from '../db/queries/users.js';

export async function handlerReset(req: Request, res: Response) {
  if (process.env.PLATFORM !== 'dev') {
    respondWithError(res, 403, 'This endpoint only works on dev environment');
  }

  const result = await deleteUsers();
  respondWithJSON(res, 200, result);
}
