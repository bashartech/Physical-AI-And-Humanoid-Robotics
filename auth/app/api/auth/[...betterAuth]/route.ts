// app/api/auth/[...betterAuth]/route.ts
import { getAuth } from "@/lib/auth";

const auth = getAuth()


export const GET = auth.handler;
export const POST = auth.handler;
