import {getAllUsersController} from '../../../../controllers/user.controller'
import { requireAdmin, AuthenticatedRequest } from "../../../../middleware/middleware";
import type {NextApiResponse } from "next";

//Get all users
export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  //Verificamos los permisos
  const hasPermission = await requireAdmin(req, res);  
  if (!hasPermission) return;

  if (req.method === "GET") return await getAllUsersController(req,res);
    return res.status(405).end();
  }
