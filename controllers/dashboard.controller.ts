import type { NextApiRequest, NextApiResponse } from "next";
import { getDashboardSummaryService, getRecentTransactionsService} from "../services/dashboard.service";

export async function getDashboardSummaryController(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string | undefined;

  try {
    const summary = await getDashboardSummaryService(userId);
    return res.status(200).json(summary);
  } catch (error) {
    console.error("Error en resumen dashboard:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getRecentTransactionsController(req: NextApiRequest, res: NextApiResponse) {
  const userId = req.query.userId as string | undefined;

  try {
    const recent = await getRecentTransactionsService(userId);
    return res.status(200).json(recent);
  } catch (error) {
    console.error("Error en movimientos recientes:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
