import type { NextApiRequest, NextApiResponse } from "next";

import {
  getTransactionsService,
  createTransactionService,
  deleteTransactionService,
} from "../services/transaction.service";

//Get all transactions services(ADMIN)
export async function getTransactionsController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  console.log(id);
  try {
    const transactions = await getTransactionsService(id as string | undefined);
    return res.status(200).json(transactions);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al obtener movimientos" + error });
  }
}

//create transactions(USER-ADMIN)
export async function createTransactionController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { amount, concept, date, userId, type } = req.body;

  if (!amount || !concept || !date || !userId || !type) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const newTransaction = await createTransactionService({
      amount,
      concept,
      date,
      userId,
      type,
    });
    return res.status(201).json(newTransaction);
  } catch (error) {
    console.error(" Error creando transacción:", error);
    return res
      .status(500)
      .json({ error: "Error al crear el movimiento" + error });
  }
}

//delete transaction(ADMIN)
export async function deleteTransactionController(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  if (typeof id !== "string") {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    await deleteTransactionService(id);
    return res
      .status(200)
      .json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Error al eliminar movimiento" + error });
  }
}
