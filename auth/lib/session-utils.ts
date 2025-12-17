import { auth } from "./auth";
import { db } from "./database";
import { userProfiles } from "../db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

// Get session with profile data
export async function getSessionWithProfile(request: NextRequest) {
  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return null;
  }

  // Get profile data from custom table
  const profileResult = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, session.user.id))
    .limit(1);

  return {
    session,
    profile: profileResult[0] || null,
  };
}

// Update profile data
export async function updateProfile(userId: string, profileData: any) {
  const [updatedProfile] = await db
    .update(userProfiles)
    .set({
      ...profileData,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.userId, userId))
    .returning();

  return updatedProfile;
}

// Get profile by user ID
export async function getProfileByUserId(userId: string) {
  const profileResult = await db
    .select()
    .from(userProfiles)
    .where(eq(userProfiles.userId, userId))
    .limit(1);

  return profileResult[0] || null;
}