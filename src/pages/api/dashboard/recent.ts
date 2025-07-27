import { getRecentTransactionsController } from "../../../../controllers/dashboard.controller";
import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "../../../../middleware/middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET"){
    const hasPermission = await requireAuth(req, res);
    if (!hasPermission) return;
    return await getRecentTransactionsController(req, res);
  } 
  return res.status(405).end(); // Method Not Allowed
}