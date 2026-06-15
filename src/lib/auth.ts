import { randomBytes, pbkdf2Sync } from 'crypto';

export function hashPassword(password: string, salt?: string) {
  const s = salt || randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(password, s, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: s };
}

export function verifyPassword(password: string, hash: string, salt: string) {
  const { hash: newHash } = hashPassword(password, salt);
  return newHash === hash;
}

export function generateToken() {
  return randomBytes(32).toString('hex');
}
