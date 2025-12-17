import { NextRequest, NextResponse } from 'next/server';
import { validateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false, message: 'Token is required' }, { status: 400 });
    }

    const payload = await validateToken(token);

    if (payload) {
      return NextResponse.json({
        valid: true,
        userId: payload.userId,
        email: payload.email,
        profileId: payload.profileId
      }, { status: 200 });
    } else {
      return NextResponse.json({ valid: false, message: 'Invalid or expired token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 });
  }
}