// import { auth } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
// import { generateToken } from "@/lib/jwt";
// import { db } from "@/lib/database";
// import { userProfiles } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export async function GET(request: NextRequest) {
//   try {
//     // Get session to verify user is authenticated
//     const session = await auth.api.getSession({
//       headers: request.headers,
//     });

//     if (!session) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     // Get user profile data
//     const profileResult = await db
//       .select()
//       .from(userProfiles)
//       .where(eq(userProfiles.userId, session.user.id))
//       .limit(1);

//     // Generate a JWT token for the frontend
//     // const jwtToken = await generateToken({
//     //   userId: session.user.id,
//     //   email: session.user.email,
//     //   profileId: profileResult[0]?.id || null,
//     //   // Include profile data in the token if needed
//     //   skillLevel: profileResult[0]?.skillLevel || session.user.skillLevel,
//     //   hardwareExperience: profileResult[0]?.hardwareExperience || session.user.hardwareExperience,
//     //   softwareExperience: profileResult[0]?.softwareExperience || session.user.softwareExperience,
//     //   programmingLevel: profileResult[0]?.programmingLevel || session.user.programmingLevel,
//     //   preferredLearningStyle: profileResult[0]?.preferredLearningStyle || session.user.preferredLearningStyle,
//     //   preferredLanguage: profileResult[0]?.preferredLanguage || session.user.preferredLanguage,
//     // });

//     // Redirect to frontend with the JWT token
//     const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";
//     const redirectUrl = new URL(`${frontendUrl}/auth-callback`);
//     redirectUrl.searchParams.set('token', jwtToken);

//     return NextResponse.redirect(redirectUrl);
//   } catch (error) {
//     console.error("Auth callback error:", error);
//     return NextResponse.redirect(new URL('/login', request.url));
//   }
// }