import type { NextApiRequest, NextApiResponse } from "next";
import auth from "@/lib/auth/index";

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'USER';
  };
  session?: any;
}

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

// Middleware para verificar autenticación (cualquier usuario logueado)
export async function requireAuth(
  req: AuthenticatedRequest, 
  res: NextApiResponse
): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: convertHeaders(req.headers)
    });
    
    if (!session) {
      res.status(401).json({ 
        error: 'No autenticado',
        message: 'Debes iniciar sesión para acceder a este recurso'
      });
      return false;
    }
    
    // Agregar datos del usuario al request
    req.user = session.user;
    req.session = session;
    
    console.log(`✅ Usuario autenticado: ${session.user?.email} (${session.user?.role})`);
    return true;
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      message: 'Error al verificar autenticación'
    });
    return false;
  }
}

// Middleware para verificar rol de administrador
export async function requireAdmin(
  req: AuthenticatedRequest, 
  res: NextApiResponse
): Promise<boolean> {
  // Primero verificar autenticación
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return false;
  
  // Verificar rol de admin
  if (req.user?.role !== 'ADMIN') {
    console.log(`Acceso denegado: ${req.user?.email} (${req.user?.role}) intentó acceder a recurso de ADMIN`);
    
    res.status(403).json({
      error: 'Acceso denegado',
      message: 'Solo los administradores pueden acceder a este recurso',
      requiredRole: 'ADMIN',
      currentRole: req.user?.role
    });
    return false;
  }
  
  console.log(`✅ Acceso de ADMIN autorizado: ${req.user?.email}`);
  return true;
}

// Middleware para verificar que sea admin o el mismo usuario
export async function requireAdminOrSelf(
  req: AuthenticatedRequest, 
  res: NextApiResponse,
  targetUserId: string
): Promise<boolean> {
  const isAuthenticated = await requireAuth(req, res);
  if (!isAuthenticated) return false;
  
  const isAdmin = req.user?.role === 'ADMIN';
  const isSelf = req.user?.id === targetUserId;
  
  if (!isAdmin && !isSelf) {
    console.log(`Acceso denegado: ${req.user?.email} intentó acceder a datos de otro usuario`);
    
    res.status(403).json({
      error: 'Acceso denegado',
      message: 'Solo puedes acceder a tu propia información o ser administrador'
    });
    return false;
  }
  
  console.log(`✅ Acceso autorizado: ${req.user?.email} ${isAdmin ? '(ADMIN)' : '(propio perfil)'}`);
  return true;
}