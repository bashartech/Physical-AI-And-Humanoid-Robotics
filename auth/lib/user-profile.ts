import { getDb } from './database';
import { userProfiles } from '../db/schema';
import { eq, and } from 'drizzle-orm';

/**
 * Create a new user profile
 */
export const createUserProfile = async (userId: string, profileData: {
  skillLevel?: string;
  hardwareExperience?: string;
  softwareExperience?: string;
  programmingLevel?: string;
  preferredLearningStyle?: string;
  preferredLanguage?: string;
}) => {
  try {
      const db = getDb()

    const [profile] = await db
      .insert(userProfiles)
      .values([
        {
        // id: crypto.randomUUID(),
        userId,
        skillLevel: profileData.skillLevel,
        hardwareExperience: profileData.hardwareExperience,
        softwareExperience: profileData.softwareExperience,
        programmingLevel: profileData.programmingLevel,
        preferredLearningStyle: profileData.preferredLearningStyle,
        preferredLanguage: profileData.preferredLanguage || 'en',
        // createdAt: new Date().toISOString(),
        // updatedAt: new Date().toISOString(),
      },
    ])
      .returning();

    return profile;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

/**
 * Get user profile by user ID
 */
export const getUserProfile = async (userId: string) => {
    const db = getDb()

  try {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId: string, profileData: {
  skillLevel?: string;
  hardwareExperience?: string;
  softwareExperience?: string;
  programmingLevel?: string;
  preferredLearningStyle?: string;
  preferredLanguage?: string;
}) => {
   const db = getDb()

  try {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({
        ...profileData,
        updatedAt: new Date().toISOString()

      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return updatedProfile;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Delete user profile
 */
export const deleteUserProfile = async (userId: string) => {
   const db = getDb()

  try {
    const result = await db
      .delete(userProfiles)
      .where(eq(userProfiles.userId, userId));

    return result;
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw error;
  }
};