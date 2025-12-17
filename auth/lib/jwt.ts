import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || process.env.BETTER_AUTH_SECRET || 'fallback_secret_for_development';

// Secret key for JWT operations
const getSecretKey = () => {
  const secret = JWT_SECRET;
  if (!secret) {
    throw new Error('JWT Secret is not configured');
  }
  return new TextEncoder().encode(secret);
};

// Generate JWT token
export const generateToken = async (payload: any): Promise<string> => {
  const secretKey = getSecretKey();
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60; // 7 days

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secretKey);
};

// Validate JWT token
export const validateToken = async (token: string): Promise<any> => {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('JWT validation error:', error);
    return null;
  }
};

// Decode JWT token without validation (for debugging)
export const decodeToken = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    const payload = parts[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};