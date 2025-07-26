import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { useSession, signIn, signOut } = authClient;

export const useSessionWithRole = () => {
  const session = useSession()
  return {
    ...session,
    data: session.data
      ? {
          ...session.data,
          user: {
            ...session.data.user,
            role: (session.data.user as any).role as string,
          },
        }
      : null,
  }
}