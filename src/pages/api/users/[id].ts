import type {NextApiResponse } from "next";
import { editUserByIdController } from "../../../../controllers/user.controller";
import { requireAdmin, AuthenticatedRequest } from "../../../../middleware/middleware";


export default async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const hasPermission = await requireAdmin(req, res);
  if (!hasPermission) return;
  if (req.method === "PUT") return await editUserByIdController(req, res);
  return res.status(405).json({ error: "Método no permitido" });
}