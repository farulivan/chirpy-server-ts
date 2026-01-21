import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth.js";

describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(password1, hash1);
    expect(result).toBe(true);
  });

  it("should return false for an incorrect password", async () => {
    const result = await checkPasswordHash(password2, hash1);
    expect(result).toBe(false);
  });
});

describe("JWT", () => {
  const userId = '123-123-123';
  const secret = 'This is secret';

  it("should create and validate jwt token", () => {
    const token = makeJWT(userId, 60, secret); // e.g. 60 seconds
    const result = validateJWT(token, secret);
    expect(result).toBe(userId);
  });

  it("should reject tokens signed with the wrong secret", () => {
    const token = makeJWT(userId, 60, secret);
    expect(() => validateJWT(token, "wrong secret")).toThrow();
  });

  it("should reject expired tokens", () => {
    // expiresIn = -10 → already expired
    const token = makeJWT(userId, -10, secret);
    expect(() => validateJWT(token, secret)).toThrow();
  });
});