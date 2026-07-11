import NextAuth from "next-auth";
import { createAuthConfig } from "@repo/auth";

const nextAuth = NextAuth(createAuthConfig());

export const handlers: ReturnType<typeof NextAuth>["handlers"] = nextAuth.handlers;
export const auth: ReturnType<typeof NextAuth>["auth"] = nextAuth.auth;
export const signIn: ReturnType<typeof NextAuth>["signIn"] = nextAuth.signIn;
export const signOut: ReturnType<typeof NextAuth>["signOut"] = nextAuth.signOut;
