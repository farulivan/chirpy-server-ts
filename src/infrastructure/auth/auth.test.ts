import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, verifyPassword } from './password.js';
import { createAccessToken, verifyAccessToken } from './jwt.js';

describe('Password Hashing', () => {
  const password1 = 'correctPassword123!';
  const password2 = 'anotherPassword456!';
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it('should return true for the correct password', async () => {
    const result = await verifyPassword(password1, hash1);
    expect(result).toBe(true);
  });

  it('should return false for an incorrect password', async () => {
    const result = await verifyPassword(password2, hash1);
    expect(result).toBe(false);
  });
});

describe('JWT', () => {
  const userId = '123-123-123';
  const secret = 'This is secret';

  it('should create and validate jwt token', () => {
    const token = createAccessToken(userId, 60, secret);
    const result = verifyAccessToken(token, secret);
    expect(result).toBe(userId);
  });

  it('should reject tokens signed with the wrong secret', () => {
    const token = createAccessToken(userId, 60, secret);
    expect(() => verifyAccessToken(token, 'wrong secret')).toThrow();
  });

  it('should reject expired tokens', () => {
    const token = createAccessToken(userId, -10, secret);
    expect(() => verifyAccessToken(token, secret)).toThrow();
  });
});
