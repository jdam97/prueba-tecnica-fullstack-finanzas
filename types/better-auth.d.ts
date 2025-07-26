import "better-auth";

declare module "better-auth" {
  interface Session {
    role: "ADMIN" | "USER";
  }

  interface User {
    role: "ADMIN" | "USER";
  }
}
