import type { Request } from 'express';
import { hash, verify } from 'argon2';
import jwt from "jsonwebtoken";
import type { JwtPayload } from 'jsonwebtoken';
import { UnauthorizedError } from './api/errors.js';
import { randomBytes } from "node:crypto";

export async function hashPassword(password: string): Promise<string> {
  return await hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return await verify(hash, password);
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
  const payload: Payload = {
    iss: "chirpy",
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
  };

  return jwt.sign(payload, secret, { expiresIn });
}

export function validateJWT(tokenString: string, secret: string): string {
  try {
    const decoded = jwt.verify(tokenString, secret) as JwtPayload;

    if (typeof decoded.sub !== 'string') {
      throw new UnauthorizedError('Invalid token payload');
    }

    return decoded.sub;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Invalid or malformed token');
    }
    throw error;
  }
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

export function makeRefreshToken(): string {
  return randomBytes(32).toString("hex");
}