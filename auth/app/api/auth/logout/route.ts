import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get session first to check if user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json(
        { message: "No active session" },
        { status: 400 }
      );
    }

    // Sign out the user
    await auth.api.signOut({
      headers: request.headers,
    });

    return NextResponse.json({
      message: "Logged out successfully"
    }, { status: 200 });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      message: 'Error during logout'
    }, { status: 500 });
  }
}