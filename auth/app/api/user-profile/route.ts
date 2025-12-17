import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { userProfiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const { userId, skillLevel, hardwareExperience, softwareExperience, programmingLevel, preferredLearningStyle, preferredLanguage } = await request.json();

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Insert or update user profile
    const [newProfile] = await db
      .insert(userProfiles)
      .values({
        // id: `profile_${userId}`, // Create a profile ID based on user ID
        userId: userId,
        skillLevel,
        hardwareExperience,
        softwareExperience,
        programmingLevel,
        preferredLearningStyle,
        preferredLanguage,
        // createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
      } )
      .onConflictDoUpdate({
        target: [userProfiles.userId],
        set: {
          skillLevel,
          hardwareExperience,
          softwareExperience,
          programmingLevel,
          preferredLearningStyle,
          preferredLanguage,
          // updatedAt: new Date().toISOString(),
        }
      })
      .returning();

    return NextResponse.json({
      message: 'Profile created/updated successfully',
      profileId: newProfile.id
    }, { status: 201 });

  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}