import { getAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { createUserProfile } from '../../../../lib/user-profile';

export async function POST(req: Request) {
  const auth = getAuth()
  const body = await req.json();

   const name = body.firstName && body.lastName
      ? `${body.firstName} ${body.lastName}`
      : body.firstName || body.lastName || "";

  // 1️⃣ Create auth user
  const signUpResult = await auth.api.signUpEmail({
    body: {
        email: body.email,
        password: body.password,
        name: name,
       },
  });

  if (!signUpResult?.user) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 400 }
    );
  }

  // 2️⃣ Create user profile
  await createUserProfile(signUpResult.user.id, {
    skillLevel: body.skillLevel,
    hardwareExperience: body.hardwareExperience,
    softwareExperience: body.softwareExperience,
    programmingLevel: body.programmingLevel,
    preferredLearningStyle: body.preferredLearningStyle,
    preferredLanguage: body.preferredLanguage ?? 'en',
  });

  return NextResponse.json({
    success: true,
    userId: signUpResult.user.id,
  });
}
