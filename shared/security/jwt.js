import jwt from "jsonwebtoken";

// Dev fallback so the app doesn't crash if `.env` is missing — but warn loudly,
// since a shared, guessable secret defeats the whole point of signing tokens.
const SECRET =
  process.env.JWT_SECRET ||
  (() => {
    console.warn(
      "JWT_SECRET not set in .env — using an insecure dev fallback. Copy .env.example to .env and set a real value."
    );
    return "insecure-dev-fallback-secret";
  })();

const EXPIRES_IN = "7d";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
