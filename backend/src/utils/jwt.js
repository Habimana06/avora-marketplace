import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'avora_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'avora_refresh_secret';
const ACCESS_EXPIRY = '15m';
const REFRESH_EXPIRY = '7d';

export function generateAccessToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
}

export function generateRefreshToken(payload) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_EXPIRY });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

export function getTokenExpiryDays() {
  return 7;
}
