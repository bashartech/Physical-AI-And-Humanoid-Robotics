// app/api/auth/[...betterAuth]/route.ts
import { auth } from "@/lib/auth";


export const GET = auth.handler;
export const POST = auth.handler;
