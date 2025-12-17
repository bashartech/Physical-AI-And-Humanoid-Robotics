CREATE TABLE IF NOT EXISTS "account" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"provider_id" varchar NOT NULL,
	"provider_account_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" varchar PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" varchar NOT NULL,
	"token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "user_profiles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "preferred_language" varchar DEFAULT 'en';