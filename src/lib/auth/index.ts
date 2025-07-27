// src/lib/auth/index.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/auth/prisma";

const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    user: {
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    },
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  callbacks: {
    async session({ session, user }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          role: user.role as "ADMIN" | "USER",
        },
      };
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "ADMIN",
        required: false,
      },
    },
  },
});

export default auth;
