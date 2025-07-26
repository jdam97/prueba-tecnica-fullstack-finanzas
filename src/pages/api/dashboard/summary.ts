import { getDashboardSummaryController } from "../../../../controllers/dashboard.controller";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") return await getDashboardSummaryController(req, res);
  return res.status(405).end();
}