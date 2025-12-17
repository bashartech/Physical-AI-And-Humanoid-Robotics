CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"name" text,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personalization_settings" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"chapter_path" varchar NOT NULL,
	"personalized_content" text,
	"cached_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_profiles" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"skill_level" varchar,
	"hardware_experience" text,
	"software_experience" text,
	"programming_level" varchar,
	"preferred_learning_style" varchar,
	"preferred_language" varchar DEFAULT 'en',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
