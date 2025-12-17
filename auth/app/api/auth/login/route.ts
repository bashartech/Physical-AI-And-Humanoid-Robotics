import { getAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const auth = getAuth()
  try {
    const body = await request.json();

    // Authenticate user using Better Auth API - using the correct method name
    const signInResult = await auth.api.signInEmail({
      body: {
        email: body.email,
        password: body.password,
      },
      headers: request.headers,
    });

    if ("error" in signInResult && signInResult.error) {
      return NextResponse.json(
        { message: (signInResult.error as any)?.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    // Get the updated session after sign in
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // The profile will be handled by the plugin in auth.ts
    return NextResponse.json({
      message: "Login successful",
      session: session,
      user: session?.user,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}