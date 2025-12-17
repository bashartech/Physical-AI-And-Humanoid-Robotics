import { NextRequest, NextResponse } from 'next/server';
import { validateToken, generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken, token } = await request.json();

    if (!token) {
      return NextResponse.json({ message: 'Token is required' }, { status: 400 });
    }

    // In a real implementation, you would validate the refresh token
    // For this demo, we'll just refresh the access token if the current one is valid
    const payload = await validateToken(token);

    if (payload) {
      // Generate a new token with the same claims
      const newToken = await generateToken({
        userId: payload.userId,
        email: payload.email,
        profileId: payload.profileId
      });

      return NextResponse.json({
        token: newToken
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}