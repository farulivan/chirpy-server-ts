import type { NextFunction, Request, Response } from 'express';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      console.log(`[${res.statusCode >= 500 ? 'ERROR' : 'WARN'}] ${req.method} ${req.url} - ${res.statusCode}`);
    }
  });

  next();
}
