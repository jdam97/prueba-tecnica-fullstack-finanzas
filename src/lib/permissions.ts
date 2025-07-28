// lib/permissions.ts
import {auth} from "@/lib/auth";

export async function checkUserPermissions(headers: Headers) {
  try {
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return {
        isAuthenticated: false,
        user: null,
        role: null,
        permissions: {
          canViewTransactions: false,
          canCreateTransactions: false,
          canViewUsers: false,
          canEditUsers: false,
          canViewReports: false,
          canDownloadReports: false,
        },
      };
    }

    const userRole = session.user?.role;
    const isAdmin = userRole === "ADMIN";
    const isUser = userRole === "USER";

    return {
      isAuthenticated: true,
      user: session.user,
      role: userRole,
      permissions: {
        // Ambos roles pueden ver transacciones
        canViewTransactions: isAdmin || isUser,

        // Solo ADMIN puede crear transacciones (según requerimientos)
        canCreateTransactions: isAdmin,

        // Solo ADMIN puede gestionar usuarios
        canViewUsers: isAdmin,
        canEditUsers: isAdmin,

        // Solo ADMIN puede ver reportes
        canViewReports: isAdmin,
        canDownloadReports: isAdmin,
      },
    };
  } catch (error) {
    console.error("Error checking permissions:", error);
    return {
      isAuthenticated: false,
      user: null,
      role: null,
      permissions: {
        canViewTransactions: false,
        canCreateTransactions: false,
        canViewUsers: false,
        canEditUsers: false,
        canViewReports: false,
        canDownloadReports: false,
      },
    };
  }
}

// Helper para usar en API routes
export function convertHeaders(incomingHeaders: any): Headers {
  const headers = new Headers();

  Object.entries(incomingHeaders).forEach(([key, value]) => {
    if (value !== undefined) {
      const headerValue = Array.isArray(value) ? value[0] : String(value);
      if (headerValue) {
        headers.set(key, headerValue);
      }
    }
  });

  return headers;
}
