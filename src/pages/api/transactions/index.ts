import type { NextApiRequest, NextApiResponse } from "next";
import { getTransactionsController, createTransactionController } from "../../../../controllers/transaction.controller";
import { requireAdmin,requireAuth } from "../../../../middleware/middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET"){
    const hasPermission = await requireAuth(req, res);
    if (!hasPermission) return;
    return await getTransactionsController(req, res)
   } 
  if (req.method === "POST"){
    const hasPermission = await requireAdmin(req, res);
    if (!hasPermission) return;
    return await createTransactionController(req, res);
  } 
  return res.status(405).json({ error: "Método no permitido" });
}