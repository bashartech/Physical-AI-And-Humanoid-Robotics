import { pgTable, uuid, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userProfiles = pgTable('user_profiles', {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar('user_id').notNull().unique(), // foreign key to Better Auth user
  skillLevel: varchar('skill_level'), // enum: beginner, intermediate, advanced
  hardwareExperience: text('hardware_experience'),
  softwareExperience: text('software_experience'),
  programmingLevel: varchar('programming_level'),
  preferredLearningStyle: varchar('preferred_learning_style'),
  preferredLanguage: varchar('preferred_language').default('en'),
  createdAt: timestamp('created_at', { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: "string" }).defaultNow().notNull(),
});

// Personalization settings table
export const personalizationSettings = pgTable('personalization_settings', {
  id: varchar('id').primaryKey().notNull(),
  userId: varchar('user_id').notNull(),
  chapterPath: varchar('chapter_path').notNull(),
  personalizedContent: text('personalized_content'),
  cachedAt: timestamp('cached_at', { mode: "string" }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});