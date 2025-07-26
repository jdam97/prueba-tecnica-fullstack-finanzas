import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTransactionController } from "../../../../controllers/transaction.controller";
import { requireAdmin } from "../../../../middleware/middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const hasPermission = await requireAdmin(req, res);
  if (!hasPermission) return;
  if (req.method === "DELETE") return await deleteTransactionController(req, res);
  return res.status(405).json({ error: "Método no permitido" });
}