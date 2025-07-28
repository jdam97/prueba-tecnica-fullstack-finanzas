// src/pages/api/test-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/auth/prisma";
import {auth} from "@/lib/auth";

function convertHeaders(incomingHeaders: any): Headers {
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("=== TEST USER & SESSION DEBUG ===");

  try {
    // 1. Primero obtener el usuario desde la base de datos (tu código original)
    const user = await prisma.user.findUnique({
      where: {
        email: "jonathandalvarez7@gmail.com",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    console.log("✅ Usuario desde la base de datos:", user);

    // 2. Ahora probar la sesión de Better Auth
    console.log("\n=== PROBANDO SESIÓN BETTER AUTH ===");

    // Ver headers originales
    console.log("Headers originales:", req.headers);
    console.log("Cookies:", req.headers.cookie);

    // Verificar si hay cookie de sesión
    const cookieHeader = req.headers.cookie;
    const hasBetterAuthCookie =
      cookieHeader?.includes("better-auth") ||
      cookieHeader?.includes("session") ||
      cookieHeader?.includes("auth");
    console.log("¿Tiene cookie de Better Auth?:", hasBetterAuthCookie);

    // Convertir headers
    const webHeaders = convertHeaders(req.headers);
    console.log("Headers convertidos:", Array.from(webHeaders.entries()));

    // Intentar obtener la sesión
    let sessionResult = null;
    let sessionError = null;

    try {
      sessionResult = await auth.api.getSession({
        headers: webHeaders,
      });
      console.log("✅ Session resultado:", sessionResult);
    } catch (error) {
      sessionError = error;
      console.error("❌ Error al obtener sesión:", (error as any).message);
    }

    // 3. También probar método alternativo
    console.log("\n=== PROBANDO MÉTODO ALTERNATIVO ===");
    let alternativeSession = null;
    sessionError instanceof Error ? sessionError.message : null
    try {
      alternativeSession = await auth.api.getSession({
        headers: {
          cookie: req.headers.cookie || "",
          authorization: req.headers.authorization || "",
          "user-agent": req.headers["user-agent"] || "",
          host: req.headers.host || "",
        } as any,
      });
      console.log("✅ Sesión método alternativo:", alternativeSession);
    } catch (altError) {
      console.error("❌ Error método alternativo:", JSON.stringify(altError));
    }

    // 4. Respuesta completa con toda la información
    return res.status(200).json({
      // Usuario desde DB
      userFromDB: user,

      // Información de sesión
      session: {
        betterAuthSession: sessionResult,
        alternativeSession: alternativeSession,
        sessionError: sessionError instanceof Error ? sessionError.message : null,
      },

      // Debug info
      debug: {
        hasCookies: !!cookieHeader,
        hasBetterAuthCookie,
        cookieContent: cookieHeader || "No cookies",
        headersReceived: Object.keys(req.headers),
        method: req.method,
      },

      // Comparación
      comparison: {
        userEmailFromDB: user.email,
        userEmailFromSession:
          sessionResult?.user?.email || alternativeSession?.user?.email || null,
        roleFromDB: user.role,
        roleFromSession:
          sessionResult?.user?.role || alternativeSession?.user?.role || null,
        sessionsMatch:
          (sessionResult?.user?.email || alternativeSession?.user?.email) ===
          user.email,
      },
    });
  } catch (error: unknown) {
    console.error("💥 Error en el servidor:", error);
  
    // Variables para mensaje y stack
    let message = "Error desconocido";
    let stack = undefined;
  
    if (error instanceof Error) {
      message = error.message;
      stack = error.stack;
    }
  
    return res.status(500).json({
      error: "Error interno del servidor",
      details: message,
      stack: process.env.NODE_ENV === "development" ? stack : undefined,
    });
  }
}
