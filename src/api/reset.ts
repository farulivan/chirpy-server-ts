import type { Request, Response } from 'express';
import { config } from '../config.js';

export async function handlerReset(req: Request, res: Response) {
  config.api.fileserverHits = 0
  res.set('Content-Type', 'text/plain; charset=utf-8')
  res.status(200).send("OK");
}