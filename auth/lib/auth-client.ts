import { createAuthClient } from "better-auth/react";
import { useEffect, useState } from "react";

// Create auth client
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000", // Update with your actual auth URL
  fetchOptions: {
    cache: "no-store",
  }
});

// Define types for session data
interface UserData {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
  skillLevel?: string;
  hardwareExperience?: string;
  softwareExperience?: string;
  programmingLevel?: string;
  preferredLearningStyle?: string;
  preferredLanguage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionData {
  user: UserData;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  };
}

// React hook for session
export const useAuth = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setIsLoading(true);
        const sessionData = await authClient.getSession();
        // The Better Auth getSession returns a different structure
        setSession(sessionData as any || null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Set up session refresh if needed
    const interval = setInterval(fetchSession, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      return result;
    } catch (error: any) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
    additionalData?: {
      skillLevel?: string;
      hardwareExperience?: string;
      softwareExperience?: string;
      programmingLevel?: string;
      preferredLearningStyle?: string;
      preferredLanguage?: string;
    }
  ) => {
    try {
      // Better Auth expects name instead of firstName/lastName for the sign up
      const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || "";

      const result = await authClient.signUp.email({
        email,
        password,
        name, // Better Auth uses 'name' field
      });
      return result;
    } catch (error: any) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      setSession(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return {
    session,
    isLoading,
    authClient,
    signIn,
    signUp,
    signOut
  };
};