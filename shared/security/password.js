import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Node's built-in crypto instead of a new dependency (bcrypt/argon2) — keeps
// this simple for a single-project scale while still never storing plaintext.
// Stored format: "<salt-hex>:<hash-hex>".
const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plain, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const hashBuffer = Buffer.from(hash, "hex");
  const candidate = scryptSync(plain, salt, KEY_LENGTH);
  return hashBuffer.length === candidate.length && timingSafeEqual(hashBuffer, candidate);
}

// Never leak the password hash back through the API — used by both
// collaborator.service.js and auth.service.js.
export function sanitizeCollaborator(collaborator) {
  if (!collaborator) return collaborator;
  const plain = collaborator.toJSON ? collaborator.toJSON() : collaborator;
  const { hashPassword: _hash, ...safe } = plain;
  return safe;
}
