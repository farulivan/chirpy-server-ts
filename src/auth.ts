import type { Request } from 'express';
import { hash, verify } from 'argon2';
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from './api/errors.js';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return await verify(hash, password);
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const timeTokenIssued = Math.floor(Date.now() / 1000);
  const payload: Payload = {iss: "chirpy", sub: userID, iat: timeTokenIssued, exp: timeTokenIssued + expiresIn }

  return jwt.sign(payload, secret)
}

export function validateJWT(tokenString: string, secret: string): string {
  const decoded = jwt.verify(tokenString, secret) as JwtPayload;

  if (typeof decoded.sub !== 'string') {
    throw new Error('Invalid token payload');
  }

  return decoded.sub;
}

export function getBearerToken(req: Request): string {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Missing Authorization header");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token?.trim()) {
    throw new UnauthorizedError("Invalid auth token");
  }

  return token.trim();
}