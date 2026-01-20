import { hash, verify } from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await hash(password);
  
  if (!hashedPassword) {
    throw new Error('Failed to hash the password');
  }

  return hashedPassword;
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return await verify(hash, password);
}
