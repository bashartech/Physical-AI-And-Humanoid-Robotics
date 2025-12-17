// import { betterAuth } from "better-auth";
// import { drizzleAdapter } from "better-auth/adapters/drizzle";
// import { getDb } from "./database";
// import * as schema from "../db/schema";

// // Define the plugin with proper typing
// // const userProfilePlugin = ((): any => ({
// //   id: "user-profile-plugin",
// //   name: "User Profile Plugin",
// //   async hooks(ctx:any) {
// //     // Hook for sign up
// //     ctx.hooks.on("session:created", async (session:any) => {
// //       if (session.user) {
// //         const now = new Date();
// //         const createdAt = session.user.createdAt ? new Date(session.user.createdAt) : now;
// //         const updatedAt = session.user.updatedAt ? new Date(session.user.updatedAt) : now;

// //         // Create or update profile record after successful sign up/sign in
// //         const profileExists = await db.select()
// //           .from(userProfiles)
// //           .where(eq(userProfiles.userId, session.user.id))
// //           .limit(1)
// //           .execute();

// //         if (profileExists.length === 0) {
// //           // Create profile if it doesn't exist
// //           await db.insert(userProfiles).values({
// //             id: crypto.randomUUID(),

// //             userId: session.user.id,
// //             skillLevel: session.user.skillLevel || null,
// //             hardwareExperience: session.user.hardwareExperience || null,
// //             softwareExperience: session.user.softwareExperience || null,
// //             programmingLevel: session.user.programmingLevel || null,
// //             preferredLearningStyle: session.user.preferredLearningStyle || null,
// //             preferredLanguage: session.user.preferredLanguage || "en",
// //             createdAt,
// //             updatedAt
// //             // createdAt: new Date(),
// //             // updatedAt: new Date(),
// //           }).execute();
// //         } else {
// //           // Update existing profile with any new values from user
// //           await db.update(userProfiles)
// //             .set({
// //               skillLevel: session.user.skillLevel || null,
// //               hardwareExperience: session.user.hardwareExperience || null,
// //               softwareExperience: session.user.softwareExperience || null,
// //               programmingLevel: session.user.programmingLevel || null,
// //               preferredLearningStyle: session.user.preferredLearningStyle || null,
// //               preferredLanguage: session.user.preferredLanguage || "en",
// //               updatedAt
// //               // updatedAt: new Date(),
// //             })
// //             .where(eq(userProfiles.userId, session.user.id))
// //             .execute();
// //         }
// //       }
// //     });
// //   }
// // }));

// export const auth = betterAuth({
//   baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

//   database: drizzleAdapter(getDb, {
//     provider: "pg",
//     schema,
//   }),

//   secret: process.env.BETTER_AUTH_SECRET || "fallback_secret_for_development",

//   emailAndPassword: {
//     enabled: true,
//     requireEmailVerification: false,
//   },

//   account: {
//     accountLinking: {
//       enabled: true,
//       trustedProviders: ["email"],
//     },
//   },

//   // socialProviders: {
//   //   google: {
//   //     clientId: process.env.GOOGLE_CLIENT_ID!,
//   //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   //   },
//   // },

//   /* ✅ FIX: explicitly allow frontend + backend origins */
//   trustedOrigins: [
//     process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001",
//     process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
//     process.env.BETTER_AUTH_URL || "http://localhost:3000",
//   ],

//   // cookies: {
//   //   sessionToken: {
//   //     name: "better-auth.session",
//   //     options: {
//   //       httpOnly: true,
//   //       secure: false,          // false for localhost development
//   //       sameSite: "none",       // Required for cross-origin requests between ports
//   //       path: "/",
//   //     },
//   //   },
//   // },

//   trustHost: true,

//   // socialCallbackUrl:
//   //   process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001",

//   // plugins: [userProfilePlugin()],
// });



// // Export the type for use in other files
// export type Auth = typeof auth;

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./database";
import * as schema from "../db/schema";

let _auth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (!_auth) {
    if (!process.env.BETTER_AUTH_SECRET) {
      throw new Error("BETTER_AUTH_SECRET is not defined");
    }

    _auth = betterAuth({
      baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

      database: drizzleAdapter(getDb(), {
        provider: "pg",
        schema,
      }),

      secret: process.env.BETTER_AUTH_SECRET,

      emailAndPassword: {
        enabled: true,
        requireEmailVerification: false,
      },

      trustedOrigins: [
        process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3001",
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
        process.env.BETTER_AUTH_URL || "http://localhost:3000",
        "https://physical-ai-and-humanoid-robotics-x.vercel.app/",
        "http://localhost:3000",
        "http://localhost:3001"

      ],

      trustHost: true,
    });
  }

  return _auth;
}

export type Auth = ReturnType<typeof getAuth>;
